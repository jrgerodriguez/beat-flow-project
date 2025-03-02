const express = require("express")
const router = new express.Router() 
const eventoController = require("../controllers/eventoController")

// Ruta para ver los detalles de cada evento
router.get("/:evento_id", eventoController.buildEventView)

module.exports = router