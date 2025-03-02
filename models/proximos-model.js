//Este modelo busca en la base de datos (por la cual importamos la conexion), todos los eventos registrados y exporta la funcion que los ha buscado

const pool = require("../database/")

async function getProximosEventos() {
    return await pool.query("SELECT *, TO_CHAR(evento_fecha, 'TMMonth FMDD') AS evento_fecha FROM public.evento")
}

module.exports = {getProximosEventos}