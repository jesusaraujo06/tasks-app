const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
// Esto nos permitira generar un token
const crypto = require('crypto');
// Hashear password
const bcrypt = require('bcrypt');

const enviarEmail = require('../handlers/email');


// Aqui es para escoger la strategy, en este caso local
exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Hay campos vacios'
});

// Funcion para revisar si el usuario esta logueado o no
exports.usuarioAutenticado = (req, res, next) => {
    // Si el usuario esta autenticado, adelante
    if(req.isAuthenticated()){
        return next();
    }
    // Si no esta autentica, redirigir al formulario
    return res.redirect('/iniciar-sesion');
}

// Funcion para cerrar seisión
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        // Al cerrar nos lleva a iniciar sesi´´on
        res.redirect('/iniciar-sesion');
    });
}

// Genera un token si el usuario es valido
// Async por que vamos hacer algunas cosas en la base de datos
exports.enviarToken = async (req, res) => {
    // El primer paso es verificar que el usuario/correo existe en la bd
    const usuario = await Usuarios.findOne({
        where: {email: req.body.email}
    });

    // Si no existe el usuario
    if(!usuario) {
        req.flash('error', 'No existe un usuario con ese correo');
        res.redirect('/restablecer-clave');
    }

    // El usuario si existe

    // Generar un token
    usuario.token = crypto.randomBytes(20).toString('hex');
    // Expiración del token = 1 hora
    usuario.expiracion = Date.now() + 3600000;

    // Guardar en la base de datos
    await usuario.save();

    // Url de reset
    const resetUrl = `https://${req.headers.host}/restablecer-clave/${usuario.token}`;
    console.log(resetUrl);

    // Enviar un correo con el token
    await enviarEmail.enviar({
        usuario,
        subject : 'Resetear contraseña - Tareas Tesla',
        resetUrl,
        archivo : 'restablecer-password',
    });

    // Terminar
    req.flash('correcto', 'Se envió un mensaje a tu correo');
    res.redirect('/iniciar-sesion');

}

exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    // Sino encuentra el usuario
    if(!usuario) {
        req.flash('error', 'El token no es válido');
        res.redirect('/restablecer-clave');
    }

    // Formulario para generar el password
    res.render('resetear-password', {
        nombrePagina: 'Restablecer contraseña'
    });
}

// Actualizar el password por una nueva
exports.actualizarPassword = async (req, res) => {
    // Con esto obtenemos los parametros de la url
    // console.log(req.params.token);
    
    // Verificar el token valido pero tambien la fecha de expiración
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,

            expiracion: {
                // Validar que expiracion sea mayor a la fecha actual
                [Op.gte] : Date.now()
            }
        }
    });

    console.log(usuario)
    // Verificamos si el usuario existe
    if(!usuario) {
        req.flash('error', 'Ha ocurrido un error');
        res.redirect('/restablecer-clave');
    }

    // Hashear el nuevo password
    const saltRounds = 10;
    const passwordSinFormato = req.body.password;

    
    await bcrypt.hash(passwordSinFormato, saltRounds).then(function(hash) {
        usuario.password = hash;
    });

    // Limpiar el token y la expiracion de la base de datos
    usuario.token = null;
    usuario.expiracion = null;

    // Guardamos el nuevo password, como ya tenemos una instancia del objeto podemos utilizar save() de sequelize
    await usuario.save();

    req.flash('correcto', 'Tu contraseña ha sido actualizada correctamente');
    res.redirect('/iniciar-sesion');
}