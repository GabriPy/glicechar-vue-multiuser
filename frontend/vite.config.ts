import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // Carica le variabili d'ambiente dalla cartella backend
  // In sviluppo locale usa il proxy verso localhost:3002
  // In produzione il frontend gira sullo stesso server, quindi /api funziona direttamente
  return {
    plugins: [
      vue(),
      tailwindcss()
    ],
    server: {
      port: 5173,
      proxy: {
        // In sviluppo locale: gira le chiamate /api al backend Node
        '/api': {
          target: 'http://localhost:3002',
          changeOrigin: true,
        }
      }
    },
    build: {
      outDir: 'dist',
    }
  }
})
