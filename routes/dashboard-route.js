const express = require("express")
const router = new express.Router() 
const dashboardController = require("../controllers/dashboardController")
const utilidades = require("../utilities")

// Crear el dashboard
router.get("/", utilidades.handleErrors(dashboardController.buildDashboard))

// Procesar logout
router.get("/logout", utilidades.handleErrors(dashboardController.processLogout))

module.exports = router