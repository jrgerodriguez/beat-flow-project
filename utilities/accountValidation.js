const utilities = require(".");
const { body, check, validationResult } = require("express-validator");
const validate = {};
const accModel = require("../models/cuenta-model");

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
      .withMessage("Ingresa un correo electrónico válido")
      .custom(async (usuario_email) => {
        const emailExiste = await accModel.checkExistingEmail(usuario_email);
        if (emailExiste) {
          throw new Error("Correo electrónico ya existe");
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

/*Esta funcion se encarga de verificar que las reglas se cumplan para crear una nueva cuenta*/
validate.checkRegistrationNewAccountRules = async (req, res, next) => {
  const { usuario_nombre, usuario_apellido, usuario_email, usuario_password } =
    req.body;
  let errores = [];
  errores = validationResult(req);
  if (!errores.isEmpty()) {
    res.render("./cuenta/registrar", {
      titulo: "Registro",
      usuario_nombre,
      usuario_apellido,
      usuario_email,
      errores,
    });
    return;
  }
  next();
};

/*Se establecen las reglas para los datos para hacer el login*/
validate.loginRules = () => {
  return [
    body("usuario_email")
      .trim()
      .isEmail()
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

/*Esta funcion se encarga de verificar que las reglas se cumplan para hacer login*/
validate.checkLoginRules = async (req, res, next) => {
  const { usuario_email, usuario_password } = req.body;
  let errores = [];
  errores = validationResult(req);
  if (!errores.isEmpty()) {
    res.render("./cuenta/login", {
      titulo: "Iniciar Sesión",
      usuario_email,
      errores,
      messages: null,
    });
    return;
  }
  next();
};

/*Se establecen las reglas para actualizar datos de la cuenta*/
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
      .withMessage("Ingresa un correo electrónico válido")
      .custom(async (usuario_email, { req }) => {
        const cuentaOriginal = await accModel.getAccountById(
          req.body.usuario_id
        );

        let emailOriginal;

        if (cuentaOriginal) {
          emailOriginal = cuentaOriginal.usuario_email;
        } else {
          emailOriginal = null;
        }

        if (
          usuario_email !== emailOriginal &&
          (await accModel.checkExistingEmail(usuario_email))
        ) {
          throw new Error("Correo electrónico ya existe");
        }
      }),
  ];
};

/*Esta funcion se encarga de verificar que las reglas se cumplan para actualizar los datos de la cuenta*/
validate.checkeditProfileRules = async (req, res, next) => {
  const { usuario_nombre, usuario_apellido, usuario_email, usuario_password } =
    req.body;
  let errores = [];
  errores = validationResult(req);
  if (!errores.isEmpty()) {
    res.render("./cuenta/editar-perfil", {
      titulo: "Registro",
      usuario_nombre,
      usuario_apellido,
      usuario_email,
      errores,
    });
    return;
  }
  next();
};

/* Se establecen las reglas para crear un nuevo evento */
validate.newEventRules = () => {
  return [
    body("evento_nombre")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Ingresa el nombre del evento"),

      body("evento_lugar")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Ingresa el lugar del evento"),

      body("evento_ciudad")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Ingresa la ciudad"),

      body("evento_fecha")
      .notEmpty()
      .withMessage("Ingresa la fecha del evento")
      .custom((value) => {
        const fecha = new Date(value);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (fecha < hoy) {
          throw new Error("La fecha no puede ser en el pasado");
        }
        return true;
      }),

      body("evento_hora")
      .notEmpty()
      .withMessage("Ingresa la hora del evento"),
      
      body("evento_descripcion")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Ingresa una descripción del evento"),

      check("evento_image").custom((value, { req }) => {
        console.log("Archivo recibido:", req.file); 
        if (req.file) {
          const mimeType = req.file.mimetype.split("/")[0];
          if (mimeType !== "image") {
            throw new Error("El archivo debe ser una imagen");
          }
          return true;
        } else {
          throw new Error("Sube un flyer del evento");
        }
      }),      

      body("evento_tickets")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Ingresa un enlace hacia la compra de tickets")   
  ];
};

/*Esta funcion se encarga de verificar que las reglas se cumplan para crear un nuevo evento*/
validate.checkNewEventRules = async (req, res, next) => {
  const {
    evento_nombre,
    evento_lugar,
    evento_ciudad,
    evento_fecha,
    evento_hora,
    evento_descripcion,
    evento_tickets
  } = req.body;
  
  const evento_image = req.file?.filename || "";
  

  let errores = []
  errores = validationResult(req)

  if (!errores.isEmpty()) {
    res.render("./cuenta/crear-evento", {
      titulo: "Crear Evento",
      evento_nombre, 
      evento_lugar, 
      evento_ciudad, 
      evento_fecha, 
      evento_hora, 
      evento_descripcion, 
      evento_image,
      evento_tickets,
      errores
    });
    return
  }
  next()
};

/*Se establecen las reglas para actualizar la contraseña*/
validate.editPasswordRules = () => {
  return [
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

/*Esta funcion se encarga de verificar que las reglas se cumplan para actualizar la contraseña*/
validate.checkEditPasswordRules = async (req, res, next) => {
  let errores = [];
  errores = validationResult(req);
  if (!errores.isEmpty()) {
    res.render("./cuenta/editar-perfil", {
      titulo: "Registro",
      errores
    });
    return;
  }
  next();
};

/*Esta funcion se encarga de verificar que las reglas se cumplan para crear una nueva contraseña*/
validate.checkNewPasswordRules = async (req, res, next) => {
  const {token} = req.body
  let errores = [];
  errores = validationResult(req);
  if (!errores.isEmpty()) {
    res.render("./cuenta/reset-password", {
      titulo: 'Nueva Contraseña',
      errores,
      token,
      messages: null,
  })
    return;
  }
  next();
};

module.exports = validate;
