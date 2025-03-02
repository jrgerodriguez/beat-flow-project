//El controller importa las utilidades (en este caso la esctructura html con la informacion de eventos ya insertada) y renderiza este view en index, se agrega el titulo y la variable que contiene la data de los eventos.

const utilidades = require("../utilities")
const baseController = {}

baseController.buildProximos = async function(req, res) {
    const proximosEventos = await utilidades.getProximos()
    res.render("index", {titulo: "Home", proximosEventos})
}

module.exports = baseController