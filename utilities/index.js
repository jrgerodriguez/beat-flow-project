//Aqui se importan las funciones del modelo y se insertan en codigo html y exporta todas las funciones en un objeto llama Util
const jwt = require("jsonwebtoken")
require("dotenv").config()
const proxModel = require("../models/proximos-model");
const Util = {};
const multer = require('multer');
const path = require('path');

/* ***************************
 *  Obtiene todos los eventos registrados en la base de datos
 * ************************** */
Util.getProximos = async function (req, res, next) {
  let data = await proxModel.getProximosEventos();
  let list = "";
  data.rows.forEach((row) => {
    list += `
    <div class="evento">
    <a href="/evento/${row.evento_id}"><img src="${row.evento_image}" alt="Flyer del evento"></a>
    <p>${row.evento_nombre}</p>
    <p class="texto_gris">${row.evento_fecha_formateada}</p>    
    <p class="texto_gris">${row.evento_lugar}, ${row.evento_ciudad}</p>
    </div>`;
  });
  return list;
};

Util.buildDetallesPorEvento = async function (data) {
  let details = "";
  if (data) {
    details += `
        <div class="contenedor-nombre-evento">
            <h1 class="nombre-evento">${data.evento_nombre}</h1>
        </div>
        
        <div class="detalles-grid">
            <div class="detalles-grid-imagen-contenedor">
                <img src="${data.evento_image}" alt="Flyer del evento">
            </div>

            <div class="detalles-grid-informacion">
            
                <div class="casilla-informacion">
                <p class="texto_gris detalle-titulo">LUGAR</p>
                <p>${data.evento_lugar}</p>
                <p>${data.evento_ciudad}</p>
                </div>

                <div class="casilla-informacion">
                <p class="texto_gris detalle-titulo">FECHA</p>
                <p>${data.evento_fecha_formateada}</p>
                <p>${data.evento_hora_formateada}</p>
                </div>

                <div class="casilla-informacion">
                <p>${data.evento_descripcion}</p>
                </div>

                <a href="${data.evento_tickets}" class="boton-gris-sin-border iniciar-sesion" target="blank">Tickets</a>

                <div class="casilla-informacion">
                <p class="texto_gris detalle-titulo creado-por">Autor: ${data.usuario_nombre} ${data.usuario_apellido}</p>
                </div>

            </div>
        </div>`;
  }
  console.log(data);
  return details;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, userData) {
        if (err) {
          req.flash("notice", "Inicia sesión para continuar");
          res.clearCookie("jwt");
          return res.redirect("/cuenta/login");
        }
        res.locals.userData = userData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    res.locals.loggedin = 0
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */

Util.checkLogin = (req, res, next) => {
  if(res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Inicia sesión para continuar")
    return res.render("./cuenta/login", {
      titulo: 'Iniciar Sesión', 
      errores:null
    })
  }
}

/* ****************************************
 * Configuración de Multer para carga de imágenes
 **************************************** */

const storage = multer.diskStorage({
  destination: (req, file, cb) => { //3 parametros: la solicitud, archivo y el callback
    cb(null, 'public/images/flyers'); // Ruta de la imagen
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre para cada archivo, el nombre sera la fecha y hora y la extension
  }
});

// Middleware para la carga de una sola imagen
Util.upload = multer({ storage: storage });

/* ***************************
 *  Obtiene todos los eventos registrados de acuerdo al id del usuario
 * ************************** */
Util.buildEventList = async function (data) {
  let list = "";
  if (data) {  
    data.forEach((row) => {
      list += `
      <div class="evento-list-element">
        <img src="${row.evento_image}" alt="Flyer del evento">
        <div class="evento-list-element__contenido">
          <p>${row.evento_nombre}</p>
          <div class="evento-list-element__contenido-botones">
            <a href="" class="boton-accion editar">Editar</a>
            <a href="" class="boton-accion eliminar">Eliminar</a>
          </div>
        </div>
      </div>`;
    });
  }
  return list;
};

module.exports = Util;
