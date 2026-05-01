<script setup>
import { ref, onMounted } from 'vue'
import { auth } from '../firebase.js'

const listaNotas = ref([])
const textoNota = ref('')

// Lee todas las notas del localStorage (de todos los usuarios)
function leerStorage() {
  var guardadas = localStorage.getItem('notas')
  if (guardadas == null) return []
  return JSON.parse(guardadas)
}

// Guarda todas las notas en localStorage
function escribirStorage(notas) {
  localStorage.setItem('notas', JSON.stringify(notas))
}

// Carga solo las notas del usuario actual
function cargarNotas() {
  var todas = leerStorage()
  var miUid = auth.currentUser.uid
  var miasNotas = []
  for (var i = 0; i < todas.length; i++) {
    if (todas[i].uid == miUid) {
      miasNotas.push(todas[i])
    }
  }
  miasNotas.sort(function(a, b) { return numeroPrioridad(a.prioridad) - numeroPrioridad(b.prioridad) })
  listaNotas.value = miasNotas
}

function numeroPrioridad(prioridad) {
  if (prioridad == 'high') return 0
  if (prioridad == 'normal') return 1
  return 2
}

function guardarNota() {
  if (textoNota.value == '') return
  var nuevaNota = {
    id: Date.now().toString(),
    texto: textoNota.value,
    uid: auth.currentUser.uid,
    prioridad: 'normal',
    completada: false,
    fechaCreacion: Date.now()
  }
  var todas = leerStorage()
  todas.push(nuevaNota)
  escribirStorage(todas)
  textoNota.value = ''
  cargarNotas()
}

function borrarNota(id) {
  var todas = leerStorage()
  var nuevas = []
  for (var i = 0; i < todas.length; i++) {
    if (todas[i].id != id) {
      nuevas.push(todas[i])
    }
  }
  escribirStorage(nuevas)
  cargarNotas()
}

function editarNota(nota) {
  var nuevoTexto = prompt("Editar nota:", nota.texto)
  if (nuevoTexto != null) {
    var todas = leerStorage()
    for (var i = 0; i < todas.length; i++) {
      if (todas[i].id == nota.id) {
        todas[i].texto = nuevoTexto
      }
    }
    escribirStorage(todas)
    cargarNotas()
  }
}

function cambiarPrioridad(nota, nuevaPrioridad) {
  var todas = leerStorage()
  for (var i = 0; i < todas.length; i++) {
    if (todas[i].id == nota.id) {
      todas[i].prioridad = nuevaPrioridad
    }
  }
  escribirStorage(todas)
  cargarNotas()
}

function toggleCompletada(nota) {
  var todas = leerStorage()
  for (var i = 0; i < todas.length; i++) {
    if (todas[i].id == nota.id) {
      if (todas[i].completada == false) {
        todas[i].completada = true
      } else {
        todas[i].completada = false
      }
    }
  }
  escribirStorage(todas)
  cargarNotas()
}

function tiempoRelativo(fecha) {
  if (!fecha) return 'fecha desconocida'
  const segundos = Math.floor((Date.now() - fecha) / 1000)
  if (segundos < 60) return 'hace ' + segundos + ' segundos'
  const minutos = Math.floor(segundos / 60)
  if (minutos < 60) return 'hace ' + minutos + ' minutos'
  const horas = Math.floor(minutos / 60)
  if (horas < 24) return 'hace ' + horas + ' horas'
  const dias = Math.floor(horas / 24)
  return 'hace ' + dias + ' días'
}

function borrarCompletadas() {
  var todas = leerStorage()
  var miUid = auth.currentUser.uid
  var nuevas = []
  for (var i = 0; i < todas.length; i++) {
    if (todas[i].uid == miUid && todas[i].completada == true) {
      // la saltamos (la borramos)
    } else {
      nuevas.push(todas[i])
    }
  }
  escribirStorage(nuevas)
  cargarNotas()
}

onMounted(cargarNotas)
</script>

<template>
  <div class="pagina">
    <h1 class="titulo-app">Proyecto Vue.js - Nombre Alumno/a</h1>

    <form @submit.prevent="guardarNota">
      <input class="input-nota" v-model="textoNota" placeholder="¿Qué quieres recordar?" required />
    </form>

    <div class="stats-line">
      <span>{{ listaNotas.filter(n => !n.completada).length }} Tareas pendientes de un total de {{ listaNotas.length }}</span>
      <span>|</span>
      <button class="btn-borrar-completadas" @click="borrarCompletadas">✕ Borrar tareas completadas</button>
    </div>

    <ul class="lista-notas">
      <li v-for="n in listaNotas" :key="n.id" class="nota-item" :class="{ 'nota-completada': n.completada }">
        <input type="checkbox" :checked="n.completada" @change="toggleCompletada(n)" />
        <span class="nota-texto">{{ n.texto }}</span>
        <button class="btn-editar" @click="editarNota(n)">✎</button>
        <button class="btn-borrar" @click="borrarNota(n.id)">-</button>
        <div class="nota-meta">
          <span>Prioridad:</span>
          <button class="btn-prioridad" :class="{ 'activo-low': n.prioridad == 'low' }" @click="cambiarPrioridad(n, 'low')">Low</button>
          <button class="btn-prioridad" :class="{ 'activo-normal': n.prioridad == 'normal' }" @click="cambiarPrioridad(n, 'normal')">Normal</button>
          <button class="btn-prioridad" :class="{ 'activo-high': n.prioridad == 'high' }" @click="cambiarPrioridad(n, 'high')">High</button>
          <span>Añadido {{ tiempoRelativo(n.fechaCreacion) }}</span>
        </div>
      </li>
    </ul>

    <footer class="footer">
      <p>Desarrollado por "Nombre Alumno/a".</p>
      <p>Codigo disponible en <a href="#">GitHub</a>.</p>
    </footer>
  </div>
</template>