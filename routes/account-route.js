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
router.post("/editar-password", utilidades.checkLogin, accValidation.editPasswordRules(), accValidation.checkEditPasswordRules, utilidades.handleErrors(cuentaController.processPasswordEdit))

// Crear el view para el formulario de nuevos eventos
router.get("/crear-evento", utilidades.checkLogin, utilidades.handleErrors(cuentaController.createEventView))

// Crear el view para el formulario de nuevos eventos
router.post("/crear-evento", utilidades.checkLogin, utilidades.upload.single('evento_image'),  accValidation.newEventRules(), accValidation.checkNewEventRules, utilidades.handleErrors(cuentaController.registerNewEvent))

// Crear el view para ver los eventos registrados
router.get("/mis-eventos/:usuario_id", utilidades.checkLogin, utilidades.handleErrors(cuentaController.buildMyEventsView))

// View para recuperar contraseña
router.get("/olvide-password", utilidades.handleErrors(cuentaController.buildForgotPasswordView))

// Manda el correo de recuperacion de contraseña
router.post("/olvide-password", utilidades.handleErrors(cuentaController.sendForgotPasswordEmail))

// Ruta para el view donde se ingresara la nueva contraseña
router.get("/reset-password", utilidades.handleErrors(cuentaController.buildNewPasswordView))

// Ruta para restablecer la nueva contraseña dentro de la base de datos
router.post("/reset-password", accValidation.editPasswordRules(), accValidation.checkNewPasswordRules, utilidades.handleErrors(cuentaController.processRegisterNewPassword))

module.exports = router
