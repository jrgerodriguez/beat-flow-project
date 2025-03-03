const utilidades = require("../utilities")
const proxModel = require("../models/proximos-model")

const eventoController = {};


/* ***************************
 *  Construir la vista de detalles de cada evento
 * ************************** */
eventoController.buildEventView = async function (req, res, next) {
  const evento_id = req.params.evento_id;
  const data = await proxModel.getEventoDetalles(evento_id)
  const details = await utilidades.buildDetallesPorEvento(data)
  res.render("./evento/evento", { titulo: `${data.evento_nombre}`, details});
};

module.exports = eventoController;
