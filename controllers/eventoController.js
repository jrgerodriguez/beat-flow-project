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

eventoController.buildEditEventView = async function(req, res) {
  const eventoId = req.params.evento_id
  const eventData = await proxModel.getEventoById(eventoId)

  res.render("./evento/editar-evento", {
    titulo: 'Editar Evento',
    errores: null,
    evento_id: eventData.evento_id,
    evento_nombre: eventData.evento_nombre,
    evento_lugar: eventData.evento_lugar,
    evento_ciudad: eventData.evento_ciudad,
    evento_fecha: eventData.evento_fecha,
    evento_hora: eventData.evento_hora,
    evento_descripcion: eventData.evento_descripcion,
    evento_tickets: eventData.evento_tickets,
    usuario_id: eventData.usuario_id
  })

}

eventoController.processEditEvent = async function (req, res) {
  const {evento_nombre, evento_lugar, evento_ciudad, evento_fecha, evento_hora, evento_descripcion, evento_tickets, usuario_id, evento_id} = req.body

  //Reemplazar la imagen que se subira en casi que haya una
  let evento_image = null;

  const eventoId = evento_id
  const data = await proxModel.getEventoById(eventoId)

  if (req.file) {
    //Eliminar la imagen existente
    const imagePath = data.evento_image
    const publicId = imagePath.split('/').pop().split('.')[0];
    const result = await cloudinary.uploader.destroy(publicId);
    if(result.result === 'ok') {
      console.log("La imagen se elimino de Cloudinary")
    } else {
      console.log("La imagen NO se pudo eliminar de Cloudinary")
    }

    //Asignar a evento_image la imagen nueva
    try {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {public_id: `evento_${Date.now()}`,});
      evento_image = uploadResult.secure_url;
    } catch (error) {
      console.error("Error al subir nueva imagen")
    }
    
  } else {
    //Asignar a evento_image la imagen existente
    evento_image = data.evento_image
  }

  const result = await proxModel.updateEvent(evento_nombre, evento_lugar, evento_ciudad, evento_fecha, evento_hora, evento_descripcion, evento_image, evento_tickets, usuario_id, evento_id)

  if(result) {
    req.flash("notice", "Evento Actualizado");
      const data = await accModel.getEventsById(usuario_id)
      const eventos = await utilities.buildEventList(data)
    res.render("./cuenta/mis-eventos", {
      titulo: 'Mis Eventos',
      eventos,
      errores: null
    })
  } else {
    req.flash("notice", "No se pudo actualizar el evento");
    const data = await accModel.getEventsById(usuario_id)
    const eventos = await utilities.buildEventList(data)
    res.render("./cuenta/mis-eventos", {
      titulo: 'Mis Eventos',
      eventos,
      errores: null
    })
  }
}

module.exports = eventoController;
