import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  // Carica le variabili d'ambiente dalla cartella backend
  // In sviluppo locale usa il proxy verso localhost:3002
  // In produzione il frontend gira sullo stesso server, quindi /api funziona direttamente
  return {
    plugins: [
      vue(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'GliceChart',
          short_name: 'GliceChart',
          description: 'Sistema Multiutente per il monitoraggio del diabete',
          theme_color: '#0f172a', // Slate 900
          background_color: '#0f172a',
          display: 'standalone',
          orientation: 'portrait',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        }
      })
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
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // Separa Chart.js
              if (id.includes('chart.js')) {
                return 'vendor-charts'
              }
              // Separa jsPDF
              if (id.includes('jspdf')) {
                return 'vendor-pdf'
              }
              // Separa Vue core e utility
              if (id.includes('vue') || id.includes('pinia') || id.includes('axios')) {
                return 'vendor-core'
              }
              // Tutto il resto dei node_modules
              return 'vendor'
            }
          }
        }
      }
    }
  }
})
