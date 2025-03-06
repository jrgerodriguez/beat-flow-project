
async function buildLoginView(req, res) {
    res.render("./cuenta/login", {titulo: 'Iniciar Sesión'})
}

module.exports = {buildLoginView}