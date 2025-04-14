require("dotenv").config();
const utilidades = require("../utilities")
const proxModel = require("../models/proximos-model")
const accModel = require("../models/cuenta-model")
const utilities = require("../utilities/.")
const path = require("path")
const fs = require("fs")
const eventoController = {};
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


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

  //Detalles e imagen del evento
  const data = await proxModel.getEventoDetalles(eventoId);
  const imagePath = data.evento_image;

 // Eliminar la imagen de Cloudinary
 try {
  // Extraer el public_id de la imagen
  const publicId = imagePath.split('/').pop().split('.')[0];

  // Eliminar la imagen de Cloudinary
  const result = await cloudinary.uploader.destroy(publicId);
  console.log('Resultado de eliminación de Cloudinary:', result);

  if (result.result === 'ok') {
    console.log('Imagen eliminada de Cloudinary con éxito');
  } else {
    console.error('Error al eliminar la imagen de Cloudinary', result);
  }
} catch (error) {
  console.error('Error al eliminar la imagen de Cloudinary:', error);
}

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
