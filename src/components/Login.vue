<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase.js'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, signInWithPopup} from 'firebase/auth'

const router = useRouter()
const email = ref('')
const password = ref('')

function irAHome() {
  router.push('/home')
}

async function entrarConCorreo() {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    irAHome()
  } catch (error) {
    alert("Error: " + error.message)
  }
}

async function crearCuenta() {
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value)
    irAHome()
  } catch (error) {
    alert("Error al crear cuenta: " + error.message)
  }
}

async function entrarConGoogle() {
  try {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
    irAHome()
  } catch (error) {
    alert(error.message)
  }
}

async function entrarConGithub() {
  try {
    const provider = new GithubAuthProvider()
    await signInWithPopup(auth, provider)
    irAHome()
  } catch (error) {
    alert("Error con Github: " + error.message)
  }
}
</script>

<template>
  <div class="login-pagina">
    <div class="login-caja">
      <h2>Entrar a la app</h2>
      <form @submit.prevent="entrarConCorreo">
        <input v-model="email" type="email" placeholder="Tu correo" required />
        <input v-model="password" type="password" placeholder="Tu contraseña" required />
        <button class="btn-login" type="submit">Entrar</button>
        <button class="btn-crear" type="button" @click="crearCuenta">Crear cuenta nueva</button>
      </form>
      <p class="separador">— o entra con —</p>
      <button class="btn-social" @click="entrarConGoogle">Entrar con Google</button>
      <button class="btn-social" @click="entrarConGithub">Entrar con Github</button>
    </div>
  </div>
</template>