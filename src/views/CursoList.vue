<template>
    <div class="row mt-5 mb-5">
        <div class="col-lg-8 offset-lg-2">
            <div class="card">
                <div class="card-header bg-success d-flex justify-content-between">
                    <h3 class="text-center text-white">Listado de Cursos</h3>
                    <button 
                        class="btn btn-light text-success" 
                        data-bs-toggle="modal" 
                        data-bs-target="#exampleModal" 
                        v-on:click="openModalForm('new')"
                    >
                        <i class="fa-solid fa-plus" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="card-body">
                    <div class="table-responsive">        
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">NOMBRE</th>
                                    <th scope="col"># Horas</th>
                                    <th scope="col">REGISTRO</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody class="table-group-divider" id="contenido">
                                <tr v-if="this.cargando">
                                    <td colspan="7"><h3>Cargando...</h3></td>
                                </tr>
                                <tr v-else v-for="cur, i in this.cursos" :key="cur.id">
                                    <td v-text="cur.id"></td>
                                    <td v-text="cur.nombre"></td>
                                    <td v-text="cur.horas"></td>
                                    <td v-text="new Date(cur.created_at).toLocaleDateString('en-US')"></td>
                                    <td>
                                        <div class="d-flex justify-content-center gap-2">
                                            <button 
                                                class="btn btn-warning"
                                                data-bs-toggle="modal" 
                                                data-bs-target="#exampleModal" 
                                                v-on:click="openModalForm('edit', cur)"
                                            >
                                                <i class="fa fa-pencil" aria-hidden="true"></i>                    
                                            </button>
                                            <button class="btn btn-danger" v-on:click="eliminarCurso(cur.id, cur.nombre)">
                                                <i class="fa fa-trash" aria-hidden="true"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>      
        </div>
    </div>
    <!-- Modal -->
    <div class="modal fade " id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="input-group mb-3">
                        <span class="input-group-text"><i class="fa-solid fa-school"></i></span>
                        <input 
                            type="text" 
                            class="form-control" 
                            id="nombre"
                            v-model="form.nombre" 
                            placeholder="Ingrese el nombre del curso"
                            required
                            maxlength="50"
                        >
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text"><i class="fa-solid fa-clock"></i></span>
                        <input 
                            type="number" 
                            class="form-control" 
                            id="horas"
                            v-model="form.horas" 
                            placeholder="Ingrese la cantidad de horas"
                            required
                            min="0"
                        >
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button 
                        type="button" 
                        class="btn btn-success"
                        v-on:click="guardar"
                        data-bs-dismiss="modal"
                    >
                    <i class="fa-solid fa-floppy-disk"></i> Guardar</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import axios from 'axios';
    import {mostrarAlerta, confirmar, enviarSolicitud} from '../functions.js'
  
    export default{
        data(){
            //const myModal = new bootstrap.Modal(document.getElementById('modalForm'));
            return{
                cursos: [],
                option: '',
                id: null,
                form: {
                    name: '',
                    horas: '',
                },
                cargando: false
            }
        },
        mounted() {
            this.getCursos();
        },
        methods: {
            async getCursos(){
                this.cargando = true;
                try{
                    let resp = await axios.get('http://academico.test/api/v1/cursos');
                    this.cursos = resp.data;
                }catch(error){
                    console.error(error);
                }finally{
                    this.cargando = false;
                }
            },
            async guardar(event){
                event.preventDefault();
                this.cargando = true;
                try{
                    if(this.validateForm()){
                        const method = (this.option == 'new') ? 'POST' : 'PUT';
                        const url = (this.option == 'new') ? 'http://academico.test/api/v1/cursos' : 'http://academico.test/api/v1/cursos/'+this.id;
                        const param = {
                            nombre: this.form.nombre.trim(),
                            horas: this.form.horas,
                        }
                        const resp = await enviarSolicitud(method, url, param);
                        await this.getCursos();
                        mostrarAlerta(resp.data.message, 'success');
                    }
                }catch(error){
                    console.error(error);
                }finally{
                    this.cargando = false;
                }
            },
            validateForm(){
                if(this.form.nombre.trim() == ''){
                    mostrarAlerta('Debes agregar un nombre', 'warning', 'nombre');
                    return false;
                }else if(this.form.horas < 1){
                    mostrarAlerta('Debes agregar el numero de horas', 'warning', 'apellido');
                    return false;
                }
                return true;
            },
            async eliminarCurso(id, nombre){   
                const request = {
                    method: 'DELETE',
                    url: 'http://academico.test/api/v1/cursos/'+id,
                };    
                let resp = await confirmar('Eliminar Curso', 'Estas seguro de eliminar el curso de '+nombre+'?');
                if(resp){
                    this.cargando = true;
                    try{          
                        const response = await enviarSolicitud(request.method, request.url);
                        mostrarAlerta(response.data.message, 'success');
                        await this.getCursos();
                    }catch(error){
                        console.error(error);
                    }finally{
                        this.cargando = false;
                    }
                }
            },
            openModalForm(option, data = {}){
                this.option = option;
                this.form = data;
                this.id = data.id;
            }
        },
    }
</script>
<style>
    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }    
    input[type="number"] {
        -moz-appearance: textfield;
    }    
    .foto-listado{
        width: 150px !important;
        height: 150px !important;
        max-height: fit-content;
    }
  </style>
  