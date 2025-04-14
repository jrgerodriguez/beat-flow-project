const utilidades = require("../utilities")
const proxModel = require("../models/proximos-model")
const accModel = require("../models/cuenta-model")
const utilities = require("../utilities/.")
const path = require("path")
const fs = require("fs")
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

/* ***************************
 *  Eliminar un evento
 * ************************** */
eventoController.processEliminateEvent = async function (req, res) {
  const usuarioId = req.query.user
  const eventoId = req.query.event;

  //Eliminar la imagen guardada
  const data = await proxModel.getEventoDetalles(eventoId)
  const imagePath = data.evento_image;
  console.log(imagePath)
  const fullPath = path.join(__dirname, '..', 'public', imagePath.replace(/^\/+/, '')); //Crea la ruta, (..) => sube un nivel
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error('Error al eliminar la imagen:', err);
    } else {
      console.log('Imagen eliminada con éxito');
    }
  });

  const result = await proxModel.processDeleteEvent(eventoId)

  if(result) {
    req.flash("notice", "Evento Eliminado");
      const data = await accModel.getEventsById(usuarioId)
      const eventos = await utilities.buildEventList(data)
      res.render("./cuenta/mis-eventos", {
        titulo: 'Mis Eventos',
        eventos,
        errores: null
    })
  } else {
      req.flash("notice", "No se pudo eliminar el evento");
      const data = await accModel.getEventsById(usuarioId)
      const eventos = await utilities.buildEventList(data)
      res.render("./cuenta/mis-eventos", {
        titulo: 'Mis Eventos',
        eventos,
        errores: null
    })
  }
}

module.exports = eventoController;
