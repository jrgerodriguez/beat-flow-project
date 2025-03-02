const eventoController = {};


/* ***************************
 *  Construir la vista de detalles de cada evento
 * ************************** */
eventoController.buildEventView = async function (req, res, next) {
  res.render("./evento/evento", { titulo: "Evento" });
};

module.exports = eventoController;
