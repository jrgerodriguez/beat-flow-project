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
    // <a href="${row.evento_tickets}" class="boton-gris-sin-border iniciar-sesion" target="blank">Tickets</a>    
    })
    return list;    
}

module.exports = Util