//Este modelo busca en la base de datos (por la cual importamos la conexion) de acuerdo a cada query

const pool = require("../database/")

/* ***************************
 * Obtener todos los proximos eventos registrados
 * ************************** */
async function getProximosEventos() {
    return await pool.query("SELECT *, TO_CHAR(evento_fecha, 'TMMonth FMDD') AS evento_fecha_formateada FROM public.evento ORDER BY evento_fecha ASC")
}

/* ***************************
 * Obtener los detalles de cada evento por medio del evento_id
 * ************************** */
async function getEventoDetalles(evento_id) {
    try {
        const data = await pool.query(
          `SELECT e.*, TO_CHAR(e.evento_fecha, 'TMMonth FMDD') AS evento_fecha_formateada, TO_CHAR(e.evento_hora, 'FMHH12 AM') AS evento_hora_formateada, u.usuario_nombre, u.usuario_apellido FROM public.evento e JOIN public.usuario u ON e.usuario_id = u.usuario_id WHERE e.evento_id = $1`,
          [evento_id]
        );
        return data.rows[0];
      } catch (error) {
        console.error("error: " + error);
      }
}

module.exports = {getProximosEventos, getEventoDetalles}