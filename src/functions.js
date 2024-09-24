import Swal from "sweetalert2";
import axios from "axios";

export function mostrarAlerta(titulo, icono, foco=""){
    if(foco!=''){
        document.getElementById(foco).focus();
    }
    Swal.fire({
        title: titulo,
        icon: icono,
        customClass: {
            confirmButton:'btn btn-primary',
            popup:'animated zoomIn'
        },
        buttonsStyling:false,
    });
}

export async function confirmar(titulo, mensaje, method){
    const swal = Swal.mixin({
        customClass: {
            confirmButton:'btn btn-success me-3',
            cancelButton:'btn btn-danger'
        },
    }); 

    let confirmation = await swal.fire({
        title: titulo,
        text: mensaje,
        icon: 'question',
        showCancelButton:true,
        confirmButtonText:'<i class="fa fa-check" aria-hidden="true"></i> Si, eliminar',
        cancelButtonText:'<i class="fa fa-ban" aria-hidden="true"></i> Cancelar'
    });

    return confirmation.isConfirmed;
}

export async function enviarSolicitud(metodo, url, param = {}){
    return await axios({method:metodo, url:url, param: param});
}