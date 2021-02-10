const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formularioCrearCuenta = (req, res) => {
    // res.render es para mandarlo a una vista
    res.render('crearCuenta', {
        nombrePagina : 'Crear cuenta una cuenta Teslera'
    });
}

exports.formularioIniciarSesion = (req, res) => {

    const {error} = res.locals.mensajes;
    // res.render es para mandarlo a una vista
    res.render('iniciarSesion', {
        nombrePagina : 'Iniciar sesión',
        error
    });
}

exports.crearCuenta = async (req, res) => {
    // Leer los datos
    const {email, password, nombre} = req.body;

    // Try catch siempre se utiliza donde se crea que puede ocurrir un error
    try {
        // Crear el usuario
        await Usuarios.create({
            email,
            password,
            nombre
        });

        // Crear una URL de confirmación
        const confirmarURL = `https://${req.headers.host}/confirmar/${email}`;
        console.log(confirmarURL);

        // return;

        // Crear el objeto de usuario
        const usuario = {
            email
        }

        // Enviar Email
        await enviarEmail.enviar({
            usuario,
            subject : 'Confirma tu cuenta',
            confirmarURL,
            archivo : 'confirmar-cuenta',
        });

        // Redirigir al usuario
        req.flash('correcto', 'Enviamos un mensaje a tu correo para confirmar la cuenta');
        res.redirect('/iniciar-sesion');

    }catch (error){
        // Obtengo los errores que me da el servidor y los genero con flash message
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina : 'Crear cuenta una cuenta Teslera',
            email,
            nombre
        });
    }
}

exports.formularioRestablecerPassword = (req, res) => {
    res.render('restablecer-clave', {
        nombrePagina: 'Restablecer contraseña'
    });
}

// Activar una cuenta
exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    // Sino existe el usuario
    if(!usuario) {
        req.flash('error', 'Ha ocurrido un error al confirmar un correo que no existe en nuestra base de datos');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');
}