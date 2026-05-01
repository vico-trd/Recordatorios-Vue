<script setup>
import { ref, onMounted } from 'vue'
import { auth } from '../firebase.js'

const todasLasNotas = ref([])
const soyAdmin = ref(false)
const correoActual = ref('')
const emailAdmin = "vicotrdinfrx@gmail.com"

function obtenerTodasLasNotas() {
  var guardadas = localStorage.getItem('notas')
  if (guardadas == null) {
    todasLasNotas.value = []
  } else {
    todasLasNotas.value = JSON.parse(guardadas)
  }
}

function borrarNotaAdmin(id) {
  var guardadas = localStorage.getItem('notas')
  var todas = JSON.parse(guardadas)
  var nuevas = []
  for (var i = 0; i < todas.length; i++) {
    if (todas[i].id != id) {
      nuevas.push(todas[i])
    }
  }
  localStorage.setItem('notas', JSON.stringify(nuevas))
  obtenerTodasLasNotas()
}

onMounted(function() {
  var usuario = auth.currentUser
  if (usuario) {
    correoActual.value = usuario.email
    if (usuario.email == emailAdmin) {
      soyAdmin.value = true
      obtenerTodasLasNotas()
    }
  }
})
</script>

<template>
  <div class="admin-pagina">
    <h1>Panel de Administrador</h1>

    <div v-if="soyAdmin">
      <button class="btn-refrescar" @click="obtenerTodasLasNotas">Actualizar lista</button>
      <ul style="list-style: none; padding: 0;">
        <li v-for="nota in todasLasNotas" :key="nota.id" class="admin-item">
          <div class="admin-item-info">
            <p>Usuario: <span>{{ nota.uid }}</span></p>
            <p>Contenido: <span>{{ nota.texto }}</span></p>
          </div>
          <button class="btn-borrar" @click="borrarNotaAdmin(nota.id)">-</button>
        </li>
      </ul>
    </div>

    <div v-else class="acceso-denegado">
      <h2>Acceso denegado</h2>
      <p>Tu correo es: {{ correoActual }}</p>
      <p>No tienes permiso para estar aquí.</p>
    </div>
  </div>
</template>