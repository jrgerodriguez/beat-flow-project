const { hash } = require("bcryptjs");
const accModel = require("../models/cuenta-model")
const bcrypt = require("bcryptjs")

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
        req.flash("warning", "Hubo un error al procesar el registro")
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
        res.status(501).render("./cuenta/registrar", {titulo: 'Registro'});
    }
}

async function processLogin(req, res) {
    res.status(200).send('Bienvenido')
}


module.exports = {buildLoginView, buildRegisterView, registerAccount, processLogin}