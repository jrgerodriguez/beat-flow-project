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

/* ***************************
 * Eliminar un evento segun su Id
 * ************************** */
async function processDeleteEvent(evento_id) {
  try {
      const data = await pool.query(
        `DELETE FROM public.evento WHERE evento_id = $1`,
        [evento_id]
      );
      return data;
    } catch (error) {
      console.error("error: " + error);
    }
}

/* ***************************
 * Obtener los detalles de cada evento por medio del evento_id
 * ************************** */
async function getEventoById(evento_id) {
  try {
    const data = await pool.query(
      `SELECT 
        e.*, 
        TO_CHAR(e.evento_fecha, 'YYYY-MM-DD') AS evento_fecha 
      FROM public.evento e 
      JOIN public.usuario u ON e.usuario_id = u.usuario_id 
      WHERE e.evento_id = $1`,
      [evento_id]
    );

    return data.rows[0];
  } catch (error) {
    console.error("error: " + error);
  }
}

/* ************************************
 * Procesar la actualizacion de eventos
 * ************************************/
async function updateEvent(evento_nombre, evento_lugar, evento_ciudad, evento_fecha, evento_hora, evento_descripcion, evento_image, evento_tickets, usuario_id, evento_id) {
  try {
    const sql = "UPDATE public.evento SET evento_nombre = $1, evento_lugar = $2, evento_ciudad = $3, evento_fecha = $4, evento_hora = $5, evento_descripcion = $6, evento_image = $7, evento_tickets = $8, usuario_id = $9 WHERE evento_id = $10"
    return await pool.query(sql, [evento_nombre, evento_lugar, evento_ciudad, evento_fecha, evento_hora, evento_descripcion, evento_image, evento_tickets, usuario_id, evento_id])
  } catch (error) {
    console.error("error:" + error)
  }
}

module.exports = {getProximosEventos, getEventoDetalles, processDeleteEvent, getEventoById, updateEvent}