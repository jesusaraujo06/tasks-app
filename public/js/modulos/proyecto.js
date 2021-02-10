import Swal from 'sweetalert2';
import axios from 'axios';

const botonEliminar = document.querySelector('#eliminar-proyecto');
if(botonEliminar){
    botonEliminar.addEventListener('click', (event) => {
        // Traer el valor de una etiqueta personalizada de html5
        const urlProyecto = event.target.dataset.proyectoUrl;

        Swal.fire({
            title: '¿Deseas borrar este proyecto?',
            text: "Un proyecto eliminado no se puede recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar',
            cancelButtonText: 'No, cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Petición a Axios, Axios es para hacer request como fetch, pero mas sencillo
                // location.origin para obtener la url
                const url = `${location.origin}/proyectos/${urlProyecto}`;
                
                axios.delete(url, {params: {urlProyecto}})
                    .then((respuesta) => {
                        Swal.fire(
                            'Proyecto eliminado',
                            respuesta.data,
                            'success'
                        );
            
                        // Redireccionar al inicio
                        setTimeout(() => {
                            window.location.href = '/'
                        }, 1000);
                    })
                    .catch(() => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Hubo un error',
                            text: 'No se pudo eliminar el proyecto'
                        })
                    })
            }
        });
    });
}

export default botonEliminar;