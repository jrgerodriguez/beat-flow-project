//Esta funcion nos lleva hacia la vista del dashboard o panel de control de la cuenta
async function buildDashboard(req, res) {
    res.render("./cuenta/dashboard", {
        titulo: 'Dashboard',
    })
}

//Cerrar la sesion
async function processLogout(req, res) {
    res.clearCookie("jwt", { path: "/" });
    res.locals.loggedin = 0;
    res.redirect("/");
}

module.exports = {buildDashboard, processLogout}