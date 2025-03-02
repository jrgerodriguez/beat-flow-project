const eventoController = {};

eventoController.buildEventView = async function (req, res, next) {
  res.render("./evento/evento", { titulo: "Evento" });
};

module.exports = eventoController;
