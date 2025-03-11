CREAR UN PROYECTO DE NODE DESDE 0

1. Voy a hacerlo con pnpm asi que lo instalo (si no esta instalado), luego comienzo a instalar las dependencia de desarrollo

2. Agregar a scripts "start": "node server.js" y "dev": "nodemon server.js" para inicializarlos con comandos (esto en el package.json)

3. Creamos el archivo server.js para simular un servidor con variables de entorno

4. Para las variables de entorno usamos un archivo.env para esto instalo dotenv, lo importo en el server.js y declaro las variables de entorno PORT y HOST y luego en el servidor uso este codigo: 


const port = process.env.PORT; 
const host = process.env.HOST; 

app.listen(port, () => {
    console.log(`App listening on ${host}:${port}`);
});

5. Agrego las rutas de los archivos estaticos y los demas folder a utilizar en todo el proyecto.

5.1. Creo la ruta hacia los archivos estaticos (images, css, js) y en server.js agrego este codigo: 
app.use(static)

6. Instalamos ejs y ejs Layouts en la terminal a traves de este codigo: 
pnpm add ejs express-ejs-layouts

6.1. En server.js, importamos ejs con un require 
const expressLayouts = require("express-ejs-layouts") y usamos este codigo: 
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

6.2 creamos en views>layouts el archivos layout.ejs y agregamos la estructura de la aplicacion

7. Creo los partials, en este caso, un elemento por elemento con index siendo el body

views

    layouts
        layout.ejs

    partials
        footer.ejs
        head.ejs
        header.ejs
        
    index.ejs    


<!-- Vamos a usar SASS para este proyecto -->
1. Se instala la dependencia, como estoy usando pnpm, uso este comando: 
pnpm add -D sass

2. Agrego el script al package.json para compilar:
"scripts": {
  "sass": "sass public/scss:public/css --watch"
}

3. Creo la estructura y listo


<!-- Creando la conexion a la base de datos, crear una solicitud, insertar esos datos en codigo html, usar un controlador para retornarlo al view -->

1. He creado un archivo index.js en el directorio database para almacenar la conexion a la base de datos utilizando el metodo Pool 

2. Cree un modelo proximos-model.js, aqui he importado la conexion, creado una funcion que tenga la solicitud hacia todos los eventos registrados en la base de datos y este exporta esa funcion

3. He creado el directorio utilities con el archivo index.js, este importa la funcion desde el modelo e inserta los datos de la base de datos en etiquetas html. Casa propiedad o funcion es almacenada en el objeto Util y este objeto es exportado

4. Por ultimo, he creado el archivo baseController.js para importar el objeto Util y renderizar el view en index para que los eventos puedan verse.

<!-- Para hashear passwords -->

1. Usamos el comando pnpm add bcryptjs

2. Usamos el controller para importar mediantes este require const bcrypt = require("bcryptjs")
