// Llamar a express para obtener todas sus funciones, en este caso utilizaremos Router()
const express = require('express');
const router = express.Router();

// Importar express validator
const {body, validationResult} = require('express-validator');

// Importar el controller
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = () => {
    // Rutas
    router.get('/',
        // Esto revisa si el usuario esta autenticado, si esta autenticado pasa al siguiente middleware
        authController.usuarioAutenticado,
        proyectosController.proyectosHome
    );

    // Mostrar vista con el formulario para crea proyecto
    router.get('/nuevo-proyecto', 
        authController.usuarioAutenticado,
        proyectosController.formularioProyecto
    );
    // Ruta para hacer POST del nuevo proyecto
    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto);

    // Listar proyectos
    router.get('/proyectos/:comodinURL', 
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl
    );

    // Mostrar vista con el formulario para actualizar proyecto
    router.get('/proyecto/editar/:comodinIDProyecto',
        authController.usuarioAutenticado,
        proyectosController.formularioEditar
    );
    
    // ruta para actualizar proyecto
    router.post('/nuevo-proyecto/:comodinIDProyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto
    );

    // Ruta para eliminar proyecto
    router.delete('/proyectos/:comodinURL',
        authController.usuarioAutenticado,
        proyectosController.eliminarProyecto
    );

    // Agregar tareas
    router.post('/proyectos/:comodinURL',
        authController.usuarioAutenticado,
        tareasController.agregarTarea
    );
    // Actualizar el estado
    router.patch('/tareas/:comodinID',
        authController.usuarioAutenticado,
        tareasController.cambiarEstado
    );
    // Eliminar tarea
    router.delete('/tareas/:comodinID',
        authController.usuarioAutenticado,
        tareasController.eliminarTarea
    );

    // Crear nueva cuenta
    // Get para cuando entre en la url
    router.get('/crear-cuenta', usuariosController.formularioCrearCuenta);
    // Ruta para crear el usuario
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    // Confirmar correo para activar cuenta
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

    // Ruta para iniciar sesión
    router.get('/iniciar-sesion', usuariosController.formularioIniciarSesion);
    // Post para iniciar sesion
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    // Post para cerrar sesión
    router.get('/cerrar-sesion', authController.cerrarSesion);

    // Restablecer contraseña
    router.get('/restablecer-clave', usuariosController.formularioRestablecerPassword);
    // Enviar token para restablecer contraseña
    router.post('/restablecer-clave', authController.enviarToken);

    router.get('/restablecer-clave/:token', authController.validarToken);

    router.post('/restablecer-clave/:token', authController.actualizarPassword);

    router.get('/pruebas', proyectosController.prueba);

    return router;
}

