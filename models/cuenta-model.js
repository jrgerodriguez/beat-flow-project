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

module.exports = {registrarCuenta, checkExistingEmail, getUserByEmail}