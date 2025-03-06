const express = require("express")
const router = new express.Router() 
const eventoController = require("../controllers/eventoController")
const utilidades = require("../utilities/")

// Ruta para ver los detalles de cada evento
router.get("/:evento_id", utilidades.handleErrors(eventoController.buildEventView))

module.exports = router