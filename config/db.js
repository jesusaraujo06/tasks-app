const { Sequelize } = require('sequelize');
console.log('Intentando conectar la base de datos');

// Traer variables de entorno
require('dotenv').config({path: 'variables.env'});

const db = new Sequelize(
    process.env.BD_NOMBRE, 
    process.env.BD_USER,
    process.env.BD_PASS, 
    {
        host: process.env.BD_HOST,
        dialect: 'mysql',
        port: process.env.BD_PORT,

        define: {
            timestamps: false
        }
    }
    
);

console.log('Fin del codigo de Sequelize')

// const probarConexion = async () => {
//     try {
//         await db.authenticate();
//         console.log('La conexión se ha establecido correctamente.');
//     } catch (error) {
//         console.error('No se puede conectar a la base de datos:', error);
//     }
// }

// probarConexion();


module.exports = db;