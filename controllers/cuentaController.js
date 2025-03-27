const { hash } = require("bcryptjs");
const accModel = require("../models/cuenta-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

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
    req.flash("notice", 'Registro exitoso, bienvenido/a')
    res.status(201).render("./cuenta/login", {titulo: 'Iniciar Sesión', errores:null})
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

module.exports = {buildLoginView, buildRegisterView, registerAccount, processLogin, buildEditProfileInfoView, processProfileEdit, processPasswordEdit}