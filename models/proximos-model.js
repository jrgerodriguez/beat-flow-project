//Este modelo busca en la base de datos (por la cual importamos la conexion) de acuerdo a cada query

const pool = require("../database/")

/* ***************************
 *  Obtener todos los proximos eventos registrados
 * ************************** */
async function getProximosEventos() {
    return await pool.query("SELECT *, TO_CHAR(evento_fecha, 'TMMonth FMDD') AS evento_fecha_formateada FROM public.evento ORDER BY evento_fecha ASC")
}

module.exports = {getProximosEventos}