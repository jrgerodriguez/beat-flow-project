/* ***********************
 * Require Statements
 *************************/
const express = require('express'); //Importo express
const app = express(); //Guarda express en una variable app
require('dotenv').config();
const static = require("./routes/static")
const expressLayouts = require("express-ejs-layouts")
const baseController = require("./controllers/baseController")
const eventoRoute = require("./routes/evento-route")
const accountRoute = require("./routes/account-route")
const dashboardRoute = require("./routes/dashboard-route")
const utilidades = require("./utilities/")
const session = require("express-session")
const pool = require('./database/')
const bodyParser = require("body-parser") //Para leer lo que venga en el body del post
const cuentaController = require("./controllers/cuentaController")
const cookieParser = require("cookie-parser")

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))



// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  next() //Ultimately, this allows messages to be set, then pass on to the next process. Eventually, when a view is built, the message can be displayed in it.
})


//Para leer lo que venga en el body del post
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/* Cookie Parser: The code in the Middleware section will allow the cookie parser to be implemented throughout the project. */
app.use(cookieParser())

app.use(utilidades.checkJWTToken)

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

app.use("/evento", eventoRoute)
app.use("/cuenta", accountRoute)
app.get('/', baseController.buildProximos);

// Ver el dashboard
app.use("/dashboard", utilidades.checkLogin, dashboardRoute)




// Middleware para RUTAS NO ENCONTRADAS, si la solicitud llega a este punto signiica que ninguna otra ruta la ha manejado, entonces llama a next() pasando un objeto con status y message, este objeto es reconocido como un error. Express detecta que next(err) ha recibido argumentos y por eso es considerado un error, Cuando next(err) recibe cualquier valor que no sea undefined o null, Express: Se salta todos los middleware normales (que tienen req, res, next). Va directamente a un middleware que tenga cuatro parámetros (err, req, res, next)

app.use(async (req, res, next) => {
    next({status: 404, message: 'Page Not Found'})
})


/* ***********************
* Middleware de Manejo de errores
Aqui se recibe el error (err) y entonces es renderizado en el view indicado junto con las propiedades del objeto que le fueron asignadas en el middleware de arriba. err tiene que tenes un status y un message
*************************/
app.use(async (err, req, res, next) => {
    console.error(`Error at: "${req.originalUrl}": ${err.message}`)
    if(err.status == 404){ message = err.message} else {message = 'Something went wrong'}
    res.render("errors/error", {
      titulo: err.status || 'Error',
      message,
    })
  })

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = 3000; 
const host = process.env.HOST; 


/* ***********************
 * Confirmar operacion del servidor
 *************************/
app.listen(port, () => {
    console.log(`App listening on ${host}:${port}`);
});