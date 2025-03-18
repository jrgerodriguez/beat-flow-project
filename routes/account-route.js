const express = require("express")
const router = new express.Router() 
const cuentaController = require("../controllers/cuentaController")
const utilidades = require("../utilities/")
const accValidation = require("../utilities/accountValidation")

// Ruta para iniciar sesion
router.get("/login", utilidades.handleErrors(cuentaController.buildLoginView))

// Procesar el login
router.post("/login", accValidation.loginRules(), accValidation.checkLoginRules, utilidades.handleErrors(cuentaController.processLogin))

// Ruta para Registra una nueva cuenta
router.get("/registrar", utilidades.handleErrors(cuentaController.buildRegisterView))

// Registrar una nueva cuenta
router.post("/registrar", accValidation.registrationNewAccountRules(), accValidation.checkRegistrationNewAccountRules, utilidades.handleErrors(cuentaController.registerAccount))


module.exports = router
