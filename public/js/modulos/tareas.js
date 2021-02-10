import axios from "axios";
import Swal from 'sweetalert2';
import ClipboardJS from 'clipboard';
import {actualizarAvance} from '../funciones/avance';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

const clipbooard = new ClipboardJS('#botonCopiar');

// Utilizamos delegation para saber en donde hemos dado clic
const tareas = document.querySelector('.listado-tareas');

if(tareas){
    tareas.addEventListener('click', (event) => {
        if(event.target.classList.contains('fa-check-circle')){
            const icono = event.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            // Request hacia /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`;
            axios.patch(url, {idTarea})
                .then((respuesta) => {
                      if(respuesta.status === 200){
                          icono.classList.toggle('completo');
                        //   Actualizar el avance
                          actualizarAvance();
                      }
                })
        }

        if(event.target.classList.contains('fa-trash')){
            const tareaHTML = event.target.parentElement.parentElement,
                  idTarea = tareaHTML.dataset.tarea;

            Swal.fire({
                title: '¿Deseas eliminar esta tarea?',
                text: "Una tarea eliminada no se puede recuperar",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrar',
                cancelButtonText: 'No, cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    const url = `${location.origin}/tareas/${idTarea}`;
                    // Enviar delete por medio de aXios
                    // Delete requiere pasar los datos por params, los demas metodos no
                    axios.delete(url, {params: {idTarea}})
                        .then((respuesta) => {
                            if(respuesta.status === 200){
                                // Eliminar el nodo
                                tareaHTML.parentElement.removeChild(tareaHTML);
                                // Opcional un alerta
                                Toast.fire({
                                    title: respuesta.data,
                                    icon: 'success'
                                });

                                // Actualizar avance
                                actualizarAvance();
                            }
                        })
                }
            });
        }
    });
}

export default tareas;