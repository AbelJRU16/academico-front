<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-success">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Gestion Academica</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Estudiantes
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link class="dropdown-item" to="/estudiantes-list">
                  <i class="fa fa-eye" aria-hidden="true"></i> Ver
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/estudiante/new">
                  <i class="fa fa-file-circle-plus" aria-hidden="true"></i> Nuevo
                </router-link>
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/cursos-list">Cursos</router-link>
          </li>
        </ul>
        <form class="d-flex" role="search">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav>
  <div class="container-fluid">
    <router-view/>
  </div>
</template>
