const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('./Proyectos');

// Declaramos el modelo y definimos la nueva tabla tareas
const Tareas = db.define('tareas', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    tarea: Sequelize.STRING(200),
    estado: Sequelize.INTEGER(1)
});

// Tarea pertenece a un proyecto
Tareas.belongsTo(Proyectos);

module.exports = Tareas;