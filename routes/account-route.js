const express = require("express")
const router = new express.Router() 
const cuentaController = require("../controllers/cuentaController")
const utilidades = require("../utilities/")
const accValidation = require("../utilities/accountValidation")

// Ruta para iniciar sesion
router.get("/login", utilidades.handleErrors(cuentaController.buildLoginView))

// Procesar el login
router.post("/login", accValidation.loginRules(), accValidation.checkLoginRules, utilidades.handleErrors(cuentaController.processLogin))

// Ruta para ver formulario para registra una nueva cuenta
router.get("/registrar", utilidades.handleErrors(cuentaController.buildRegisterView))

// Registrar una nueva cuenta
router.post("/registrar", accValidation.registrationNewAccountRules(), accValidation.checkRegistrationNewAccountRules, utilidades.handleErrors(cuentaController.registerAccount))

// Permite ver la vista para editar la informacion del perfil
router.get("/editar-perfil", utilidades.checkLogin, utilidades.handleErrors(cuentaController.buildEditProfileInfoView))

// Edita/Actualiza la informacion
router.post("/editar-perfil", utilidades.checkLogin, accValidation.editProfileRules(), accValidation.checkeditProfileRules, utilidades.handleErrors(cuentaController.processProfileEdit))

// Edita/Actualiza la informacion
router.post("/editar-password", utilidades.checkLogin, utilidades.handleErrors(cuentaController.processPasswordEdit))

// Crear el view para el formulario de nuevos eventos
router.get("/crear-evento", utilidades.checkLogin, utilidades.handleErrors(cuentaController.createEventView))

// Crear el view para el formulario de nuevos eventos
router.post("/crear-evento", utilidades.checkLogin, utilidades.upload.single('evento_image'), utilidades.handleErrors(cuentaController.registerNewEvent))


module.exports = router
