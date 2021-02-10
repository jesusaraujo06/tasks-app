import Swal from 'sweetalert2';

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

export const actualizarAvance = () => {
    // Seleccionar las tareas existentes
    const tareas = document.querySelectorAll('li.tarea-proyecto');
    if(tareas.length){
        // Seleccionar las tareas completadas
        const tareasCompletas = document.querySelectorAll('i.completo')

        // Calcular el avance
        const avance = Math.round((tareasCompletas.length / tareas.length) * 100);

        // Mostrar el avance
        const procentaje = document.querySelector('#porcentaje');
        procentaje.style.width = avance+'%';

        console.log(avance);

        switch (avance) {
            case 70:
                Toast.fire({
                    title: 'Estas terminando ¡Vamos!',
                    icon: 'success'
                });
            break;

            case 80:
                Toast.fire({
                    title: 'Falta poco!!',
                    icon: 'success'
                });
            break;

            case 90:
                Toast.fire({
                    title: 'Se fue asiii!!',
                    icon: 'success'
                });
            break;

            case 100:
                Swal.fire({
                    title: '¡Finalizaste tus actividades! 🥳',
                    width: 600,
                    padding: '3em',
                    background: '#fff url(https://sweetalert2.github.io/images/trees.png)',
                    backdrop: `
                      rgba(0,0,123,0.4)
                      url("https://sweetalert2.github.io/images/nyan-cat.gif")
                      left top
                      no-repeat
                    `
                });
            break;
        
            
        }

    }

}