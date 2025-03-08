const accModel = require("../models/cuenta-model")

//Esta funcion renderiza el view para hacer login
async function buildLoginView(req, res) {
    res.render("./cuenta/login", {titulo: 'Iniciar Sesión', messages: null})
}

//Esta funcion renderiza el view para crear una nueva cuenta
async function buildRegisterView(req, res) {
    res.render("./cuenta/registrar", {titulo: 'Registro'})
}

//Esta funcion registra una nueva cuenta
async function registerAccount(req, res) {
    const {usuario_nombre, usuario_apellido, usuario_email, usuario_password} = req.body;
    const registroExitoso = await accModel.registrarCuenta(usuario_nombre, usuario_apellido, usuario_email, usuario_password)

    if(registroExitoso) {
    req.flash("notice", 'Registro exitoso, bienvenido/a')
    res.status(201).render("./cuenta/login", {titulo: 'Iniciar Sesión'})
    } else {
        req.flash("warning", "Lo sentimos, el registro falló.");
        res.status(501).render("./cuenta/registrar", {titulo: 'Registro'});
    }
}


module.exports = {buildLoginView, buildRegisterView, registerAccount}