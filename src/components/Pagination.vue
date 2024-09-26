<template>
    <nav class="d-flex justify-content-center">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: paginaActual === 1 }">
          <button class="page-link" @click="cambiarPagina(paginaActual - 1)" :disabled="paginaActual === 1">Anterior</button>
        </li>
        <li class="page-item" :class="{ active: paginaActual === numeroPagina }" v-for="numeroPagina in totalPaginas" :key="numeroPagina">
          <button class="page-link" @click="cambiarPagina(numeroPagina)">{{ numeroPagina }}</button>
        </li>
        <li class="page-item" :class="{ disabled: paginaActual === totalPaginas }">
          <button class="page-link" @click="cambiarPagina(paginaActual + 1)" :disabled="paginaActual === totalPaginas">Siguiente</button>
        </li>
      </ul>
    </nav>
  </template>
  
  <script>
  export default {
    props: {
      estudiantes: Array
    },
    data() {
      return {
        paginaActual: 1,
        estudiantesPorPagina: 5
      };
    },
    computed: {
      totalPaginas() {
        return Math.ceil(this.estudiantes.length / this.estudiantesPorPagina);
      }
    },
    methods: {
      cambiarPagina(pagina) {
        if (pagina > 0 && pagina <= this.totalPaginas) {
          this.paginaActual = pagina;
          this.emitirEstudiantesPaginados();
        }
      },
      emitirEstudiantesPaginados() {
        const inicio = (this.paginaActual - 1) * this.estudiantesPorPagina;
        const fin = inicio + this.estudiantesPorPagina;
        const paginados = this.estudiantes.slice(inicio, fin);
  
        // Emitir los estudiantes paginados al componente padre
        this.$emit('paginaCambiada', paginados);
      }
    },
    mounted() {
      this.emitirEstudiantesPaginados(); // Emitir los estudiantes de la primera página al montar
    }
  };
  </script>
  