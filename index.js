const express = require('express');
const routes = require('./routes/index');
const path = require('path');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
// Importar variables de entorno
require('dotenv').config({path: 'variables.env'});

// Mi helper con algunas funciones
const helpers = require('./helpers');

// Crear la conexion a la DB
const db = require('./config/db');

// Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
// db.authenticate()
    .then( () => console.log('Conectando al servidor'))
    .catch(error => console.log(error));

// Crear la app de express
const app = express();

// Middleware = funciones que se ejecutan una tras otra

// Donde cargar los archivos estaticos
app.use(express.static('public'));

// Habilitar template engine, en este caso PUG
app.set('view engine', 'pug');

// Habilitar BodyParse para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}));

// Agregamos express validator a toda la aplicacion
app.use(check());


// Añadir carpeta de las vistas, para que express sepa donde van a estar las vistas
app.set('views', path.join(__dirname, './views'));

// Agregar flash messages a toda la app
app.use(flash());

app.use(cookieParser());

// Sessiones nos permiten navegar entre distintas paginas sin volvernos a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Pasar la funcion var dump de helper.js a la app
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    // Spread operator
    res.locals.usuario = {...req.user} || null;
    // console.log(res.locals.usuario);
    next();
})

// Rutas
app.use('/', routes());

// Servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log(`El servidor esta funcionando con exito en el puerto: ${port}`);
    console.log(`Host del servidor ${host}`);
});

// Para hacer pruebas enviando el email soliticandolo desde el servidor
// require('./handlers/email');