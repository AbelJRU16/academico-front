<template>
  <div class="row">
    <div class="col-lg-8 offset-lg-2 mt-4">
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
            <tr v-else v-for="est, i in this.estudiantes" :key="est.id">
              <td v-text="est.id"></td>
              <td>
                <img v-if="est.foto" class="foto-listado img-thumbnail" src="est.foto" alt="">
                <img v-else class="foto-listado img-thumbnail" src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-256.png" alt="">
              </td>
              <td v-text="est.nombre"></td>
              <td v-text="est.apellido"></td>
              <td v-text="new Date(est.created_at).toLocaleDateString('en-US')"></td>
              <td>
                <div class="d-flex justify-content-center gap-2">
                  <router-link :to="{path:'estudiantes/view/'+est.id}" class="btn btn-info">
                    <i class="fa fa-eye" aria-hidden="true"></i>
                  </router-link>
                  <router-link :to="{path:'estudiantes/view/'+est.id}" class="btn btn-warning">
                    <i class="fa fa-pencil" aria-hidden="true"></i>                    
                  </router-link>
                  <button class="btn btn-danger" v-on:click="eliminarEstudiante(est.id)">
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
</template>
<script>
  import axios from 'axios';
  import {mostrarAlerta, confirmar, enviarSolicitud} from '../functions.js'

  export default{
    data(){
      return{
        estudiantes: [],
        cargando: false
      }
    },
    mounted() {
      this.getEstudiantes();
    },
    methods: {
      async getEstudiantes(){
        this.cargando = true;
        try{
          let resp = await axios.get('http://academico.test/api/v1/estudiantes');
          this.estudiantes = resp.data;
        }catch(error){
          console.error(error);
        }finally{
          this.cargando = false;
        }
      },
      async eliminarEstudiante(id){   
        const request = {
          method: 'DELETE',
          url: 'http://academico.test/api/v1/estudiantes/'+id,
        };    
        let resp = await confirmar('Eliminar estudiante', 'Estas seguro de eliminar este estudiante?');
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
      }
    },
  }
</script>
<style>
.foto-listado{
  width: 150px !important;
  height: 150px !important;
}
</style>
