//Aqui se importan las funciones del modelo y se insertan en codigo html y exporta todas las funciones en un objeto llama Util

const proxModel = require("../models/proximos-model")
const Util = {}

/* ***************************
 *  Obtiene todos los eventos registrados en la base de datos
 * ************************** */
Util.getProximos = async function(req, res, next) {
    let data = await proxModel.getProximosEventos()
    let list = ""
    data.rows.forEach((row) => {
     list += `
    <div class="evento">
    <a href="/evento/${row.evento_id}"><img src="${row.evento_image}" alt="Flyer del evento"></a>
    <p>${row.evento_nombre}</p>
    <p class="texto_gris">${row.evento_fecha_formateada}</p>    
    <p class="texto_gris">${row.evento_lugar}, ${row.evento_ciudad}</p>
    </div>`    
    })
    return list;    
}

Util.buildDetallesPorEvento = async function(data) {
    let details = "";
    if(data) {
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
        </div>`
        
    }
    console.log(data)
    return details;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util