
const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async (req, res, next) => {
    // console.log(req.params);
    // Obtenemos el proyecto actual
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.comodinURL
        }
    });

    // Leer el valor del input
    const {tarea} = req.body;

    // Estado 0 = incumpleto y ID del proyecto
    const estado = 0;
    const proyectoId = proyecto.id;

    // Insertr en la base de datos
    const resultado = await Tareas.create({tarea, estado, proyectoId});

    if(!resultado){
        return next();
    }

    // Redireccionar
    res.redirect(`/proyectos/${req.params.comodinURL}`);
}

exports.cambiarEstado = async (req, res) => {
    const {comodinID} = req.params;
    const tareaObtenida = await Tareas.findOne({
        where: {id : comodinID}
    });

    // Cambiar el estado
    let estado = 0;
    if(tareaObtenida.estado === estado){
        estado = 1;
    }

    tareaObtenida.estado = estado;

    const resultado = await tareaObtenida.save();

    if(!resultado) return next();

    res.status(200).send('Actualizado');
}

exports.eliminarTarea = async (req, res) => {
    
    const {comodinID} = req.params;

    const resultado = await Tareas.destroy({
        where: {id : comodinID}
    })

    if(!resultado) return next();

    res.status(200).send('Tarea eliminada con exito');

}