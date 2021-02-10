const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('../models/Proyectos');
const bcrypt = require('bcrypt');
const { sequelize } = require('../models/Proyectos');

// Cada usuario puede crear varios proyectos y desde los proyectos las tareas

const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        // Este campo no puede ir vacio
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Agrega un correo válido'
            },
            notEmpty: {
                msg: 'El correo no puede ir vacio'
            }
        },
        unique: {
            args: true,
            msg: 'Usuario ya registrado'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La contraseña no puede ir vacio'
            }
        }
    },
    nombre: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El nombre no puede estar vacio'
            }
        }
    },
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE

}, {
    hooks: {
        beforeCreate: function(datosRecibidos, options) {

            const saltRounds = 10;
            const passwordSinFormato = datosRecibidos.password;

            // Se pone return para que retorne antes de que se inserte a la base de datos
            return bcrypt.hash(passwordSinFormato, saltRounds).then(function(hash) {
                datosRecibidos.password = hash;
            });
        }
    }
});

// Metodos personalizados
Usuarios.prototype.verificarPassword = async function(password) {
    // console.log(this.password);
    // console.log(password);
    const match = await bcrypt.compare(password, this.password);

    if(match) {
        return true;
    }else{
        return false;
    }

}


// hasMany por que los usuarios pueden crear multiples proyectos, pueden crear mas de uno
Usuarios.hasMany(Proyectos);

module.exports = Usuarios;