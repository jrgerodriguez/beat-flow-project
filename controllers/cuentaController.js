const { hash } = require("bcryptjs");
const accModel = require("../models/cuenta-model")
const proxModel = require("../models/proximos-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const utilities = require("../utilities/.")
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

//Esta funcion renderiza el view para hacer login
async function buildLoginView(req, res) {
    res.render("./cuenta/login", {titulo: 'Iniciar Sesión', messages: null, errores: null})
}

//Esta funcion renderiza el view para crear una nueva cuenta
async function buildRegisterView(req, res) {
    res.render("./cuenta/registrar", {
        titulo: 'Registro',
        errores: null
    })
}

//Esta funcion registra una nueva cuenta
async function registerAccount(req, res) {
    const {usuario_nombre, usuario_apellido, usuario_email, usuario_password} = req.body;

    let hashedPassword
    try {
        hashedPassword = await bcrypt.hashSync(usuario_password, 10)
    } catch(error) {
        req.flash("error", "Hubo un error al procesar el registro")
        res.status(500).render("./cuenta/registrar", {
        titulo: 'Registro',
        errores: null
    })
    }

    const registroExitoso = await accModel.registrarCuenta(usuario_nombre, usuario_apellido, usuario_email, hashedPassword)

    if(registroExitoso) {
        const userData = await accModel.getUserByEmail(usuario_email)
        delete userData.usuario_password
        const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
        if(process.env.NODE_ENV === 'development') {
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        } else {
            res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }
        return res.redirect("/dashboard")
    } else {
        req.flash("warning", "Lo sentimos, el registro falló.");
        res.status(501).render("./cuenta/registrar", {titulo: 'Registro', errores:null});
    }
}

//Esta funcion procesa el login
async function processLogin(req, res) {
    const {usuario_email, usuario_password} = req.body
    const userData = await accModel.getUserByEmail(usuario_email)

    if(!userData) {
        req.flash("notice", "Usuario no encontrado")
        res.status(400).render("./cuenta/login", {
            titulo: 'Iniciar Sesión', 
            errores:null
        }) 
        return
    }
    try {
        if (await bcrypt.compare(usuario_password, userData.usuario_password)) {
            delete userData.usuario_password
            const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            if(process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            return res.redirect("/dashboard")
        } else {
            req.flash("notice", "Contraseña Incorrecta")
            res.status(400).render("./cuenta/login", {
                titulo: 'Iniciar Sesión', 
                errores:null
            })
            return
        }

    } catch (error) {
        throw new Error('Acceso Denegado')
    }
}

//Esta funcion es para ver el formulario para editar la informacion
async function buildEditProfileInfoView(req, res) {
    res.render("./cuenta/editar-perfil", {
        titulo: 'Editar Perfil',
        errores: null
    })
}

async function processProfileEdit(req, res) {
    const {usuario_nombre, usuario_apellido, usuario_email, usuario_id} = req.body

    const result = await accModel.processEdit(usuario_nombre, usuario_apellido, usuario_email, usuario_id)

    if(result) {
        req.flash("notice", "Información Actualizada")

        delete result.usuario_password

        const accessToken = jwt.sign(result, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: 3600 * 1000,
        });

        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });

        res.status(201).render("./cuenta/dashboard", {
            titulo: 'Dashboard',
            userData: result
        });
    } else {
        req.flash("warning", "Lo sentimos, el registro falló.")
        res.status(501).render("./cuenta/editar-perfil", {
            titulo: 'Editar Perfil',
            errores: null
        });
    }
}

async function processPasswordEdit(req, res) {
    const {usuario_password, usuario_id} = req.body;

    let hashedPassword

    try {
        hashedPassword = await bcrypt.hashSync(usuario_password, 10)
    } catch (error) {
        req.flash("error", "Hubo un error al procesar el registro")
        res.status(500).render("./cuenta/editar-perfil", {
        titulo: 'Editar Perfil',
        errores: null
    })
    }

    const updatePassword = await accModel.updatePassword(hashedPassword, usuario_id)

    console.log(usuario_id)

    console.log(`************************ ${updatePassword}`)

    if (updatePassword) {
        req.flash("notice", "Contraseña Actualizada");

        res.status(201).render("./cuenta/dashboard", {
            titulo: 'Dashboard',
        });
    } else {
        req.flash("warning", "Lo sentimos, la actualización falló.")
        res.status(501).render("./cuenta/editar-perfil", {
            titulo: 'Editar Perfil',
            errores: null
        });
    }
 }

//Esta funcion es para ver el formulario para crear un nuevo evento
async function createEventView(req, res) {
    res.render("./cuenta/crear-evento", {
        titulo: 'Crear Evento',
        evento_nombre: '',
        evento_lugar: '',
        evento_ciudad: '',
        evento_fecha: '',
        evento_hora: '',
        evento_descripcion: '',
        evento_tickets: '',
        errores: null
    })
}

//Esta funcion registra el nuevo evento
async function registerNewEvent(req, res) {
    const {evento_nombre, evento_lugar, evento_ciudad, evento_fecha, evento_hora, evento_descripcion, evento_tickets, usuario_id} = req.body

    let evento_image = null;

    if (req.file) {
        try {
            await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { public_id: `evento_${Date.now()}` },
                    (error, result) => {
                        if (error) {
                            console.log("Error al subir la imagen a Cloudinary:", error);
                            reject(error);
                        } else {
                            evento_image = result.secure_url;
                            resolve(result);
                        }
                    }
                );
                stream.end(req.file.buffer); // <-- aquí usás el buffer en vez del path
            });
        } catch (error) {
            return res.status(500).send("Error al subir la imagen.");
        }
    }
    

    const data = await accModel.processNewEventRegister(evento_nombre, evento_lugar, evento_ciudad, evento_fecha, evento_hora, evento_descripcion, evento_image, evento_tickets, usuario_id)

    if(data) {
        req.flash("notice", "Evento Creado Exitosamente");

        res.status(201).render("./cuenta/dashboard", {
            titulo: 'Dashboard',
        });
    } else {
        req.flash("warning", "El evento no pudo ser creado.")
        res.status(501).render("./cuenta/crear-evento", {
            titulo: 'Crear Evento',
            errores: null
        })
    }
}

//Esta funcion es para ver el formulario para editar la informacion
async function buildMyEventsView(req, res) {

    const usuario_id = req.params.usuario_id;

    const data = await accModel.getEventsById(usuario_id)

    const eventos = await utilities.buildEventList(data)

    res.render("./cuenta/mis-eventos", {
        titulo: 'Mis Eventos',
        eventos,
        errores: null,
        messages: null
    })
}

//Esta funcion envia el email para restablecer la contraseña
async function buildForgotPasswordView(req, res) {
    res.render("./cuenta/olvide-password", {titulo: 'Recuperar Contraseña', messages: null, errores: null})
}

//Esta funcio envia el correo de recuperar contraseña en caso que el email exista
async function sendForgotPasswordEmail(req, res) {
    const {usuario_email} = req.body

    const emailExists = await accModel.checkExistingEmail(usuario_email)

    if(emailExists) {
        
        const resetToken = jwt.sign(
            { email: usuario_email }, //Payload
            process.env.JWT_RESET_SECRET, //Secret
            { expiresIn: '15m' } 
        )

        const resetLink = `https://beat-flow-project.onrender.com/cuenta/reset-password?token=${resetToken}`

        //Crear transporte
        const transporter = nodemailer.createTransport({ 
            service: 'gmail',
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS
            }
        })

        //Mail Options
        const mailOptions = {
            from: `"BeatFlow" <${process.env.MAIL_USER}>`, 
            to: usuario_email,
            subject: 'Recupera tu contraseña',
            html: `
              <p>Has solicitado recuperar tu contraseña de tu cuenta de BeatFlow.</p>
              <p>Haz clic en el siguiente enlace para establecer una nueva contraseña:</p>
              <a href="${resetLink}">${resetLink}</a>
              <p>Este enlace expira en 15 minutos.</p>
            `
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error(error)
              return res.send('Error al enviar el correo.')
            }
          
            req.flash("notice", "Se ha enviado un enlace a tu correo.")
            res.render('./cuenta/olvide-password', {
              titulo: 'Restablecer Contraseña',
              errores: null,
            })
          })

    } else {
        req.flash("notice", "Este correo no existe, registra una cuenta.")
        res.render("./cuenta/olvide-password", {titulo: 'Restablecer Contraseña', errores: null})
    }
}

//Esta funcion redirige a establecer una nueva contraseña
async function buildNewPasswordView(req, res) {

    const {token} = req.query

    try {
        const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET)
        const email = decoded.email

        res.render("./cuenta/reset-password", {
            titulo: 'Nueva Contraseña',
            errores: null,
            messages: null,
            token,
        }) 
    } catch (error) {
        req.flash("notice", "El enlace ha expirado o no es válido.")
        res.render("./cuenta/login", {titulo: 'Iniciar Sesión', errores: null})
    }
}

async function processRegisterNewPassword(req, res) {
    const {token, usuario_password} = req.body

    try {
        const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET)
        const email = decoded.email
        
        hashedPassword = await bcrypt.hashSync(usuario_password, 10)

        const setNewPassword = await accModel.setNewPassword(email, hashedPassword)

        if (setNewPassword) {
            req.flash("notice", "Nueva Contraseña Registrada.")
            res.render("./cuenta/login", {
                titulo: 'Iniciar Sesión', 
                errores: null
            }) 
        } else {
            req.flash("notice", "No se pudo registrar la nueva contraseña.")
            res.render("./cuenta/reset-password", {
                titulo: 'Nueva Contraseña',
                errores: null,
                token,
            })
        }
    } catch (error) {
        req.flash("notice", "Ocurrió un error al procesar tu solicitud. Intenta nuevamente.")
        res.render("./cuenta/login", {titulo: 'Iniciar Sesión', errores: null})
    }
}

module.exports = {buildLoginView, buildRegisterView, registerAccount, processLogin, buildEditProfileInfoView, processProfileEdit, processPasswordEdit, createEventView, registerNewEvent, buildMyEventsView, buildForgotPasswordView, sendForgotPasswordEmail, buildNewPasswordView, processRegisterNewPassword}