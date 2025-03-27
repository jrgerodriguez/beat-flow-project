const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const accModel = require("../models/cuenta-model")

/*Se establencen las reglas para los datos para crear una nueva cuenta*/
validate.registrationNewAccountRules = () => {
  return [
    body("usuario_nombre")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Ingresa tu nombre"),

    body("usuario_apellido")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Ingresa tu apellido"),

    body("usuario_email")
      .trim()
      .isEmail()
      .normalizeEmail({ remove_dots: false }) 
      .withMessage("Ingresa un correo electrónico válido")
      .custom(async (usuario_email) => {
        const emailExiste = await accModel.checkExistingEmail(usuario_email)
        if(emailExiste) {
          throw new Error("Correo electrónico ya existe")
        }
      }),

    body("usuario_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 10,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Formato de contraseña incorrecto"),
  ];
};

/*Esta funcion se encarga de verificar que las reglas se cumplan en los datos proporcionados*/
validate.checkRegistrationNewAccountRules = async (req, res, next) => {
    const {usuario_nombre, usuario_apellido, usuario_email, usuario_password} = req.body
    let errores = []
    errores = validationResult(req)
    if(!errores.isEmpty()) {
        res.render("./cuenta/registrar", {
            titulo: 'Registro',
            usuario_nombre,
            usuario_apellido,
            usuario_email,
            errores
        })
        return
    }
    next();
}


/*Se establencen las reglas para los datos para hacer el login*/
validate.loginRules = () => {
  return [

    body("usuario_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Ingresa un correo electrónico válido"),

    body("usuario_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 10,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Formato de contraseña incorrecto"),
  ];
};

/*Esta funcion se encarga de verificar que las reglas se cumplan en los datos proporcionados*/
validate.checkLoginRules = async (req, res, next) => {
  const {usuario_email, usuario_password} = req.body
  let errores = []
  errores = validationResult(req)
  if(!errores.isEmpty()) {
      res.render("./cuenta/login", {
          titulo: 'Iniciar Sesión',
          usuario_email,
          errores, 
          messages: null
      })
      return
  }
  next();
}

/*Se establencen las reglas para actualizar datos de la cuentra*/
validate.editProfileRules = () => {
  return [
    body("usuario_nombre")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Ingresa tu nombre"),

    body("usuario_apellido")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Ingresa tu apellido"),

    body("usuario_email")
      .trim()
      .isEmail()
      .normalizeEmail({ remove_dots: false }) 
      .withMessage("Ingresa un correo electrónico válido")
      .custom(async (usuario_email, {req}) => {

        const cuentaOriginal = await accModel.getAccountById(req.body.usuario_id)

        let emailOriginal;

        if (cuentaOriginal) {
            emailOriginal = cuentaOriginal.usuario_email;
        } else {
            emailOriginal = null;
        }

        if (usuario_email !== emailOriginal && await accModel.checkExistingEmail(usuario_email)) {
          throw new Error("Correo electrónico ya existe")
        }

      })
  ];
};

/*Esta funcion se encarga de verificar que las reglas se cumplan en los datos proporcionados*/
validate.checkeditProfileRules = async (req, res, next) => {
  const {usuario_nombre, usuario_apellido, usuario_email, usuario_password} = req.body
  let errores = []
  errores = validationResult(req)
  if(!errores.isEmpty()) {
      res.render("./cuenta/editar-perfil", {
          titulo: 'Registro',
          usuario_nombre,
          usuario_apellido,
          usuario_email,
          errores
      })
      return
  }
  next();
}

module.exports = validate