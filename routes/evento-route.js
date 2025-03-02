const express = require("express")
const router = new express.Router() 
const eventoController = require("../controllers/eventoController")

router.get("/:evento_id", eventoController.buildEventView)

module.exports = router