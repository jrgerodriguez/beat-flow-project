//El controller importa las utilidades (en este caso la esctructura html con la informacion de eventos ya insertada) o maneja la solicitus que se trasmite a traves de las rutas y renderiza los views

const utilidades = require("../utilities")
const baseController = {}

/* ***************************
 *  Construye el view en Index y muestra un grid de todos los eventos
 * ************************** */
baseController.buildProximos = async function(req, res) {
  try {
    const proximosEventos = await utilidades.getProximos()
    if (!res.headersSent) {
      res.render("index", { titulo: "Beatflow", proximosEventos })
    }
  } catch (error) {
    console.error("Error al obtener eventos:", error.message)
    if (!res.headersSent) {
      res.render("index", { titulo: "Beatflow", proximosEventos: [] })
    }
  }
}

module.exports = baseController