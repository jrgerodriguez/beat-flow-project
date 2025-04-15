const express = require("express")
const router = new express.Router() 
const eventoController = require("../controllers/eventoController")
const utilidades = require("../utilities/")

// Procesa la eliminacion de un evento
router.get('/eliminar-evento', utilidades.handleErrors(eventoController.processEliminateEvent))

// Ruta para ver los detalles de cada evento
router.get("/:evento_id", utilidades.handleErrors(eventoController.buildEventView))

// Ruta para ver los detalles de cada evento
router.get("/editar-evento/:evento_id", utilidades.handleErrors(eventoController.buildEditEventView))

// Ruta para procesar actualizar o editar un evento
router.post("/edit-evento/", utilidades.upload.single('evento_image'), utilidades.handleErrors(eventoController.processEditEvent))

module.exports = router