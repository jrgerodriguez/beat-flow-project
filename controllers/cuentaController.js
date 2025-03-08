//Esta funcion renderiza el view para hacer login
async function buildLoginView(req, res) {
    res.render("./cuenta/login", {titulo: 'Iniciar Sesión'})
}

//Esta funcion renderiza el view para crear una nueva cuenta
async function buildRegisterView(req, res) {
    res.render("./cuenta/registrar", {titulo: 'Registro'})
}

module.exports = {buildLoginView, buildRegisterView}