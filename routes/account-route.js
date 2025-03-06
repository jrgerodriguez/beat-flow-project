const express = require("express")
const router = new express.Router() 
const cuentaController = require("../controllers/cuentaController")
const utilidades = require("../utilities/")

// Ruta para iniciar sesion
router.get("/login", utilidades.handleErrors(cuentaController.buildLoginView))

module.exports = router
