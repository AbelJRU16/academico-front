<template>
    <div class="row mt-5 mb-5">
        <div class="col-lg-8 offset-lg-2">
            <div class="card">
                <div class="card-header bg-success">
                    <h3 class="text-center text-white">Listado de Usuarios</h3>
                </div>
                <div class="card-body">
                    <div class="table-responsive">        
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">FOTO</th>
                                    <th scope="col">NOMBRE</th>
                                    <th scope="col">APELLIDO</th>
                                    <th scope="col">REGISTRO</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody class="table-group-divider" id="contenido">
                                <tr v-if="this.cargando">
                                    <td colspan="7"><h3>Cargando...</h3></td>
                                </tr>
                                <tr v-else v-for="est in estudiantesPaginados" :key="est.id">
                                    <td v-text="est.id"></td>
                                    <td>
                                        <img v-if="est.foto" class="foto-listado img-thumbnail" :src="est.foto" alt="">
                                        <img v-else class="foto-listado img-thumbnail" src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-256.png" alt="">
                                    </td>
                                    <td v-text="est.nombre"></td>
                                    <td v-text="est.apellido"></td>
                                    <td v-text="new Date(est.created_at).toLocaleDateString('en-US')"></td>
                                    <td>
                                        <div class="d-flex justify-content-center gap-2">
                                            <router-link :to="{path:'estudiante/view/'+est.id}" class="btn btn-primary">
                                                <i class="fa fa-eye" aria-hidden="true"></i>
                                            </router-link>
                                            <router-link :to="{path:'estudiante/edit/'+est.id}" class="btn btn-warning">
                                                <i class="fa fa-pencil" aria-hidden="true"></i>                    
                                            </router-link>
                                            <button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                                <i class="fa fa-gears" aria-hidden="true"></i>
                                            </button>
                                            <button class="btn btn-danger" v-on:click="eliminarEstudiante(est.id, est.nombre+' '+est.apellido)">
                                                <i class="fa fa-trash" aria-hidden="true"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <pagination
                        :estudiantes="estudiantes"
                        @paginaCambiada="actualizarEstudiantesPaginados"
                    />
                </div>
            </div>      
        </div>
    </div>
    <!-- Modal -->
     <div class="modal fade " id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Administrar cursos de estudiante</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Nombre del curso</th>
                                <th scope="col">Horas</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="cur in this.cursos" :key="cur.id">
                                <td>{{cur.id}}</td>
                                <td>{{cur.nombre}}</td>
                                <td>{{cur.horas}}</td>
                                <td>
                                    <div class="d-flex justify-content-center">
                                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button 
                        type="button" 
                        class="btn btn-success"
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
    import Pagination from '@/components/Pagination.vue';
  
    export default{
        components: {
            Pagination
        },
        data(){
            return{
                cursos: [],
                estudiantes: [],
                estudiantesPaginados: [], // Lista paginada
                cargando: false
            }
        },
        mounted() {
            this.getEstudiantes();
            this.getCursos();
        },
        methods: {
            async getEstudiantes(){
                this.cargando = true;
                try{
                    let resp = await axios.get('http://academico.test/api/v1/estudiantes');
                    this.estudiantes = resp.data;
                    this.actualizarEstudiantesPaginados(this.estudiantes.slice(0, 5));
                }catch(error){
                    console.error(error);
                }finally{
                    this.cargando = false;
                }
            },
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
            async eliminarEstudiante(id, nombre){   
                const request = {
                    method: 'DELETE',
                    url: 'http://academico.test/api/v1/estudiantes/'+id,
                };    
                let resp = await confirmar('Eliminar estudiante', 'Estas seguro de eliminar a '+nombre+'?');
                if(resp){
                    this.cargando = true;
                    try{          
                        const response = await enviarSolicitud(request.method, request.url);
                        mostrarAlerta(response.data.message, 'success');
                        await this.getEstudiantes();
                    }catch(error){
                        console.error(error);
                    }finally{
                        this.cargando = false;
                    }
                }
            },
            actualizarEstudiantesPaginados(paginados) {
                this.estudiantesPaginados = paginados;
            },
        },
    }
</script>
<style>
    select[multiple] {
        width: 100%;
        height: 200px;
        padding: 10px;
        border: 2px solid #007bff;
        border-radius: 5px;
        background-color: #f8f9fa;
        color: #333;
        font-size: 16px;
    }

    select[multiple] option {
        padding: 8px;
    }

    select[multiple]:focus {
        border-color: #28a745;
        outline: none;
    }
    .foto-listado{
        width: 150px !important;
        height: 150px !important;
        max-height: fit-content;
    }
</style>
  