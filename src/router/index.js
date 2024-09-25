import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EstudianteForm from '../views/EstudianteForm.vue'
import EstudianteList from '../views/EstudianteList.vue'
import CursoList from '@/views/CursoList.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/cursos-list',
    name: 'listado-cursos',
    component: CursoList
  },
  {
    path: '/estudiantes-list',
    name: 'listado-estudiantes',
    component: EstudianteList
  },
  {
    path: '/estudiante/view/:id',
    name: 'Estudiante',
    component: EstudianteForm
  },
  {
    path: '/estudiante/new',
    name: 'Agregar Estudiante',
    component: EstudianteForm
  },
  {
    path: '/estudiante/edit/:id',
    name: 'Editar Estudiante',
    component: EstudianteForm
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
