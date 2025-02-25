/* ***********************
 * Require Statements
 *************************/
const express = require('express'); //Importo express
const app = express(); //Guarda express en una variable app
require('dotenv').config();
const static = require("./routes/static")
const expressLayouts = require("express-ejs-layouts")

/* ***********************
 * View Engine and Templates (ejs)
Este codigo construira el layout o diseño de la aplicacion
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(static)

app.get('/', (req, res) => {
    res.render("index", {titulo: 'Home'});
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT; 
const host = process.env.HOST; 


/* ***********************
 * Confirmar operacion del servidor
 *************************/
app.listen(port, () => {
    console.log(`App listening on ${host}:${port}`);
});