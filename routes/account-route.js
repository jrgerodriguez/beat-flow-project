const express = require("express")
const router = new express.Router() 
const cuentaController = require("../controllers/cuentaController")
const utilidades = require("../utilities/")

// Ruta para iniciar sesion
router.get("/login", utilidades.handleErrors(cuentaController.buildLoginView))

// Ruta para Registra una nueva cuenta
router.get("/registrar", utilidades.handleErrors(cuentaController.buildRegisterView))

// Registrar una nueva cuenta
router.post("/registrar", utilidades.handleErrors(cuentaController.registerAccount))

module.exports = router
