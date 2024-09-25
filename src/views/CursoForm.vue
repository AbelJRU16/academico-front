<template>
    <div class="row">
        <div class="col-lg-8 offset-lg-2 mt-5">
            <div class="card">
                <div class="card-header bg-success">
                    <h3 class="text-center text-white">{{ name }}</h3>
                </div>
                <div class="card-body">
                    <form v-on:submit="guardar($event)">
                        <div class="input-group mb-3">
                            <span class="input-group-text"><i class="fa-solid fa-school"></i></span>
                            <input 
                                type="text" 
                                class="form-control" 
                                v-model="form.nombre" 
                                id="nombre"
                                placeholder="Ingrese el nombre del curso"
                                required
                                maxlength="50"
                                :disabled="!isEditable"
                            >
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text"><i class="fa-solid fa-clock"></i></span>
                            <input 
                                type="text" 
                                class="form-control" 
                                v-model="form.apellido" 
                                id="apellido"
                                placeholder="Ingrese la cantidad de horas"
                                required
                                maxlength="50"
                                :disabled="!isEditable"
                            >
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text"><i class="fa-solid fa-gift"></i></span>
                            <input 
                                type="file" 
                                class="form-control"
                                accept="image/png, image/jpeg, image/gif"
                                id="foto"
                                v-on:change="previsualizarFoto($event)"
                                :disabled="!isEditable"
                                required
                            >
                        </div>
                        <div class="d-grid col-4 mx-auto mb-3">
                            <button class="btn btn-success">
                                <i class="fa-solid fa-floppy-disk"></i> Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>      
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import {mostrarAlerta, confirmar, enviarSolicitud} from '../functions.js';  

    export default{
        data(){
            return{
                option: '',
                name: this.$route.name,
                id: null,
                isEditable: true,
                form: {
                    nombre: '',
                    apellido: '',
                    foto: '',
                },
                cargando: false
            }
        },
        mounted() {
            this.option = this.$route.path.split('/')[2];
            this.id = this.$route.params.id;
            if(this.option == 'new' || this.option == 'edit'){
                this.isEditable = true;
            }else{
                this.isEditable = false;
            }
            if(this.option != 'new'){
                this.getData(this.$route.params.id);
            }
        },
        methods: { 
            async guardar(event){
                event.preventDefault();
                this.cargando = true;
                if(this.validateForm()){
                    const method = (this.option == 'new') ? 'POST' : 'PUT';
                    const url = (this.option == 'new') ? 'http://academico.test/api/v1/estudiantes' : 'http://academico.test/api/v1/estudiantes/'+this.id;
                    const param = {
                        nombre: this.form.nombre.trim(),
                        apellido: this.form.apellido.trim(),
                        foto: this.form.foto,
                    }
                    const resp = await enviarSolicitud(method, 
                        url, param);
                    mostrarAlerta(resp.data.message, 'success');
                }
            },
            validateForm(){
                if(this.form.nombre.trim() == ''){
                    mostrarAlerta('Debes agregar un nombre', 'warning', 'nombre');
                    return false;
                }else if(this.form.nombre.trim() == ''){
                    mostrarAlerta('Debes agregar un apellido', 'warning', 'apellido');
                    return false;
                }else if(this.form.foto.trim() == ''){
                    mostrarAlerta('Debes agregar una foto', 'warning', 'foto');
                    return false;
                }
                return true;
            },
            async getData(id){
                this.cargando = true;
                try{
                    let {data} = await axios.get(`http://academico.test/api/v1/cursos/${id}`);
                    this.form = data.data;
                }catch(error){
                    console.error(error);
                }finally{
                    this.cargando = false;
                }
            }
        },
    }
</script>

<style>
.foto-form{
  width: 100% !important;
  height: auto !important;
  max-height: fit-content;
}
</style>