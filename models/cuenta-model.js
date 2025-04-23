const pool = require("../database/")

//Esta funciona registra una nueva cuenta en la base de datos
async function registrarCuenta(usuario_nombre, usuario_apellido, usuario_email, usuario_password){
    try {
      const sql = "INSERT INTO usuario (usuario_nombre, usuario_apellido, usuario_email, usuario_password) VALUES ($1, $2, $3, $4) RETURNING *"
      return await pool.query(sql, [usuario_nombre, usuario_apellido, usuario_email, usuario_password])
    } catch (error) {
      return error.message
    }
  }

//Esta funciona verifica si el email existe antes de crear una cuenta
 
async function checkExistingEmail(usuario_email) {
  try {
    const sql = "SELECT * FROM usuario WHERE usuario_email = $1"
    const query = await pool.query(sql, [usuario_email])
    return query.rowCount
  } catch (error) {
    return error.message  
  }
}

//Esta funciona verifica si el email existe para poder iniciar sesion
async function getUserByEmail(usuario_email) {
  try {
    const result = await pool.query('SELECT * FROM usuario WHERE usuario_email = $1', [usuario_email])
    return result.rows[0] //Devuelve un objeto con un arreglo de resultados en el que cada resultado es objeto, ejemplo: 
    /* 
      {
        rowCount: 1, 
        rows: [
          { usuario_id: 1, usuario_nombre: "Jorge", usuario_email: "jorge@example.com" }
        ]
      }
    */
  } catch (error) {
    
  }
}

//Procesar la actualizacion de la informacion de la base de datos
async function processEdit(usuario_nombre, usuario_apellido, usuario_email, usuario_id) {
  try {
    const result = await pool.query(
      "UPDATE public.usuario SET usuario_nombre = $1, usuario_apellido = $2, usuario_email = $3 WHERE usuario_id = $4 RETURNING *", //Esto devuelve todo el objeto hasta la contraseña, hay que borrarla al actualizar el token
      [usuario_nombre, usuario_apellido, usuario_email, usuario_id]
    )
    return result.rows[0]
  } catch (error) {
    console.error("model error':" + error)
  }
}

//Obtiene datos del usuario basados en su id 
async function getAccountById(usuario_id) {
  try {
    const result = await pool.query(
     "SELECT * FROM public.usuario WHERE usuario_id = $1",
     [usuario_id] 
    )
    return result.rows[0]
  } catch (error) {
    console.error("model error:" + error)
  }
}

//Actualiza la contraseña
async function updatePassword(usuario_password, usuario_id) {
  try {
    const result = await pool.query(
      "UPDATE public.usuario SET usuario_password = $1 WHERE usuario_id = $2 RETURNING *", 
      [usuario_password, usuario_id])
    return result.rows[0]
  } catch (error) {
    console.error("Error en updatePassword:", error.message);
    throw error;
  }
}

//Esta funcion registra el nuevo evento
async function processNewEventRegister(evento_nombre, evento_lugar, evento_ciudad, evento_fecha, evento_hora, evento_descripcion, evento_image, evento_tickets, usuario_id){
  try {
    const sql = "INSERT INTO evento (evento_nombre, evento_lugar, evento_ciudad, evento_fecha, evento_hora, evento_descripcion, evento_image, evento_tickets, usuario_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
    return await pool.query(sql, [evento_nombre, evento_lugar, evento_ciudad, evento_fecha, evento_hora, evento_descripcion, evento_image, evento_tickets, usuario_id])
  } catch (error) {
    return error.message
  }
}

//Esta funcion obtiene los eventos por numero de id del usuario
async function getEventsById(usuario_id) {
  try {
    const result = await pool.query("SELECT * FROM public.evento WHERE usuario_id = $1", [usuario_id])
    return result.rows
  } catch (error) {
    console.error("model error:", error.message)
    throw error
  }
}

//Esta funcion registra la nueva contraseña
async function setNewPassword(email, password) {
  try {
    const result = await pool.query(
      "UPDATE public.usuario SET usuario_password = $1 WHERE usuario_email = $2", [password, email]
    )
    return result.rows
  } catch (error) {
    console.error("model error:", error.message)
    throw error
  }
}

module.exports = {registrarCuenta, checkExistingEmail, getUserByEmail, processEdit, getAccountById, updatePassword, processNewEventRegister, getEventsById, setNewPassword}