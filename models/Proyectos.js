const Sequelize = require('sequelize');
const db = require('../config/db');
const slug = require('slug');
const shortid = require('shortid');

// Crear tabla y definir sus columnas
const Proyectos = db.define('proyectos', {

    id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre : {
        type: Sequelize.STRING(100)
    },
    url : {
        type: Sequelize.STRING(100)
    }

}, {
    // Los hooks corren una funcion en determinado tiempo, esto lo trae sequelize
    hooks: {
        beforeCreate(datosRecibidos) {
            // obtener el nombre del proyecto y lo pasamos por slug para que nos de la url
            const url = slug(datosRecibidos.nombre);
            // Creamos url dentro de los datos y la asignamos para que tambien se inserte a la DB
            datosRecibidos.url = `${url}-${shortid.generate()}`;
        }
    }
});

module.exports = Proyectos;