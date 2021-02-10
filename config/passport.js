const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

// Referencia al modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios');

// Local strategy - Login con credenciales propios (Usuario y password)
passport.use(
    new localStrategy(
        // Por default passport espera un usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        // done es como un next()
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email: email,
                        activo: 1
                    }
                });
                
                const validarPassword = await usuario.verificarPassword(password);
                
                // El usuario existe, pero el password es incorrecto
                if(!validarPassword){
                    // console.log('validar')
                    // console.log(validarPassword);
                    return done(null, false, {
                        message: 'Contraseña incorrecta'
                    });
                   
                }else{
                    // El email existe y el password esta correcto
                    return done(null, usuario);
                }
 

            } catch (error) {
                // Ese correo no existe
                return done(null, false, {
                    message: 'Ese correo no existe en la base de datos'
                });
            }

          
        }
    )
);

// Serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

// Deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

// Exportar
module.exports = passport;