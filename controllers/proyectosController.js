// Importar el modelo
const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.proyectosHome = async(req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectosObtenidos = await Proyectos.findAll({
        where: {usuarioId: usuarioId}
    });
    // Eso va a llamar a index que esta en la carpeta views
    res.render('index', {
        nombrePagina : 'Proyectos',
        proyectosObtenidos
    });
}

exports.formularioProyecto = async (req, res) => {
    // Esto se llama en todos por que el menu es dinamico
    const usuarioId = res.locals.usuario.id;
    const proyectosObtenidos = await Proyectos.findAll({
        where: {usuarioId: usuarioId}
    });
    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo proyecto',
        proyectosObtenidos
    });
}

exports.nuevoProyecto = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosObtenidos = await Proyectos.findAll({
        where: {usuarioId: usuarioId}
    });
    // Enivar a la consola lo que el usuario escriba
    // console.log(req.body);

    // Validar que tengamos algo en el input
    const {nombre} = req.body; // Estamos aplicando destructuring

    let errores = [];

    if(!nombre){
        errores.push({'texto': 'Agrega un nombre al proyecto'});
    }

    // Si hay errores
    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo proyecto',
            errores,
            proyectosObtenidos
        });
    }else{
        // Insertar en la base de datos
        const usuarioId = res.locals.usuario.id;
        const insertarProyecto = await Proyectos.create({nombre, usuarioId});
        res.redirect('/');
    }
}

exports.proyectoPorUrl = async (req, res, next) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosObtenidosPromise = Proyectos.findAll({
        where: {usuarioId: usuarioId}
    });
    const contenidoDelProyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.comodinURL,
            // Se le pasa el usuario cuando va a ser una consulta de ver el contenido del proyecto por que nadie mas lo puede ver
            usuarioId: usuarioId
        }
    });

    // Si se tienen varias consultas independientes en una misma funcion lo mejor es ponerlas en un promise
    const [proyectosObtenidos, contenidoDelProyecto] = await Promise.all([proyectosObtenidosPromise, contenidoDelProyectoPromise]);

    if(!contenidoDelProyecto) return next();

    // Cosultar tareas del proyecto actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: contenidoDelProyecto.id
        },
        // Esto es como hacer un join en SQL pero con Sequelize
        // include: [
        //     {model: Proyectos}
        // ]
    })
    
    // Render a la vista tareas
    res.render('tareas', {
        nombrePagina : '',
        contenidoDelProyecto,
        proyectosObtenidos,
        tareas
    });

}

exports.formularioEditar = async (req, res) => {
    // Este que obtiene todos los proyectos es para el menu
    const usuarioId = res.locals.usuario.id;
    const proyectosObtenidosPromise = Proyectos.findAll({
        where: {usuarioId: usuarioId}
    });
    const contenidoDelProyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.comodinIDProyecto,
            usuarioId: usuarioId
        }
    });

    const [proyectosObtenidos, contenidoDelProyecto] = await Promise.all([proyectosObtenidosPromise, contenidoDelProyectoPromise]);
    // Render a la vista
    res.render('nuevoProyecto', {
        nombrePagina : 'Editar proyecto',
        proyectosObtenidos,
        contenidoDelProyecto

    });
}

exports.actualizarProyecto = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosObtenidos = await Proyectos.findAll({
        where: {usuarioId: usuarioId}
    });
    // Enivar a la consola lo que el usuario escriba
    // console.log(req.body);

    // Validar que tengamos algo en el input
    const {nombre} = req.body; // Estamos aplicando destructuring

    let errores = [];

    if(!nombre){
        errores.push({'texto': 'Agrega un nombre al proyecto'});
    }

    // Si hay errores
    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo proyecto',
            errores,
            proyectosObtenidos
        });
    }else{
        // Insertar en la base de datos
        const actualizarProyecto = await Proyectos.update(
            {nombre: nombre},
            {where : 
                { id: req.params.comodinIDProyecto}
            }
        );
        res.redirect('/');
    }
}

exports.eliminarProyecto = async (req, res, next) => {
    // req. query o params, para acceder los datos que son recibidos
    const {urlProyecto} = req.query;

    const resultado = await Proyectos.destroy({
        where: {
            url: urlProyecto
        }
    });

    // Si da error ves a la otra funcion
    if(!resultado){
        return next();
    }

    res.status(200).send('Proyecto eliminado con exito');
}

exports.prueba = (req, res) => {
    res.render('lo', {
      
    });
}