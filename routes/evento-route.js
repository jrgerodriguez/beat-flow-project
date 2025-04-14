const express = require("express")
const router = new express.Router() 
const eventoController = require("../controllers/eventoController")
const utilidades = require("../utilities/")

// Procesa la eliminacion de un evento
router.get('/eliminar-evento', utilidades.handleErrors(eventoController.processEliminateEvent))

// Ruta para ver los detalles de cada evento
router.get("/:evento_id", utilidades.handleErrors(eventoController.buildEventView))

module.exports = router