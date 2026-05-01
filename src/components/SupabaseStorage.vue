<script setup>
import { ref } from 'vue'
import {supabase} from '../supabase.js'

const archivo = ref(null)
var textoRecordatorio = ref('')
var errorEnSubida = ref(false)

function adjuntarArchivo(e){
    archivo.value = e.target.files[0]
    console.log('Archivo seleccionado:', archivo.value)
}

async function subirArchivo(){
const nombreLimpio = archivo.value.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const {data , error} = await supabase.storage.from('ArchivosAdjuntos').upload(nombreLimpio, archivo.value)
        if(error){
        console.error('Error al subir el archivo:', error)
    } else {
        console.log('Archivo subido con éxito:', data)
    }
}


async function altaRecordatorio(){
    if(archivo)
    {
        const nombreLimpio = archivo.value.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const {data , error} = await supabase.storage.from('ArchivosAdjuntos').upload(nombreLimpio, archivo.value)
        if(error){
            console.error('Error al subir el archivo:', error)
            errorEnSubida.value = true
        } else {
            console.log('Archivo subido con éxito:', data)
            errorEnSubida.value = false
        }
    }

    if(!archivo || errorEnSubida.value)
    {
        const {data} = await supabase.from('ArchivosAdjuntos').insert({texto: archivo})
        console.log('No se ha adjuntado ningún archivo o ha ocurrido un error en la subida')
    }
}

</script>

<template>
    <form @submit.prevent="altaRecordatorio">
        <label for="texto">Texto del recordatorio:</label>
        <input type="text" id="texto" v-model="textoRecordatorio">

        <button type="button" @click="subirArchivo">Enviar</button>
        <input type="file" @change="adjuntarArchivo">
    </form>

</template>