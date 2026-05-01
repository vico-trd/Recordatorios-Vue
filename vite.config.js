import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/Recordatorios-Vue/',
  plugins: [vue()],
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth'],
  },
})
