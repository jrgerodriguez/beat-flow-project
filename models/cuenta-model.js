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

module.exports = {registrarCuenta}