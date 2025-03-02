//Aqui se importan las funciones del modelo que trae recupera todos los eventos y los inserta en codigo html y exporta todas las funciones en un objeto llama Util

const proxModel = require("../models/proximos-model")
const Util = {}

Util.getProximos = async function(req, res, next) {
    let data = await proxModel.getProximosEventos()
    let list = ""
    data.rows.forEach((row) => {
     list += `
    <div class="evento">
    <img src="${row.evento_image}" alt="Flyer del evento">
    <p>${row.evento_nombre}</p>
    <p class="texto_gris">${row.evento_fecha}</p>    
    <p class="texto_gris">${row.evento_lugar}, ${row.evento_ciudad}</p>
    <a href="${row.evento_tickets}" class="boton-gris-sin-border iniciar-sesion" target="blank">Tickets</a>    
    </div>`
    })
    return list;    
}

module.exports = Util