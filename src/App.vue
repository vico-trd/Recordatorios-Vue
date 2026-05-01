<script setup>import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { auth } from './firebase.js';
  import { onAuthStateChanged, signOut } from 'firebase/auth';

  const router = useRouter();
  const user = ref(null);

  onAuthStateChanged(auth, function(usuarioActual) {
    user.value = usuarioActual;
  });

  async function cerrarSesion() {
    await signOut(auth);
    router.push('/');
  }
</script>

<template>
  <Transition name="fade">
    <nav v-if="user">
      <router-link to="/home">Mis Notas</router-link>
      <router-link to="/admin">Administración</router-link>
      <span class="link-desactivado">Subida de Archivos</span>
      <button @click="cerrarSesion">Cerrar Sesión</button>
    </nav>
  </Transition>
  <router-view></router-view>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.link-desactivado {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
