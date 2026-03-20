<template>
  <div class="space-y-3">
    <!-- Alert errore critico (Sync) -->
    <div v-if="store.hasSyncError" 
      class="card bg-base-100 shadow-xl border-2 border-warning/30 overflow-hidden">
      <div class="card-body items-center text-center p-8 space-y-6">
        <!-- Icona centrata e animata -->
        <div class="relative flex items-center justify-center">
          <div class="absolute w-20 h-20 bg-warning/10 rounded-full animate-ping"></div>
          <div class="relative w-16 h-16 rounded-full bg-warning/20 flex items-center justify-center">
            <i class="fi fi-sr-exclamation text-warning text-3xl leading-none"></i>
          </div>
        </div>
        
        <div class="space-y-3">
          <h2 class="text-2xl font-black uppercase tracking-tighter text-warning text-center w-full">
            {{ $t('home.sync_error') }}
          </h2>
          <div class="space-y-1">
            <p class="text-sm font-bold opacity-80">
              {{ auth.user?.last_sync_error || $t('home.sync_error_desc') }}
            </p>
            <p class="text-[11px] opacity-40 max-w-sm mx-auto italic leading-relaxed">
              Per visualizzare il grafico e le tue statistiche in tempo reale, assicurati che i parametri Gluroo nelle impostazioni siano corretti.
            </p>
          </div>
        </div>
        
        <div class="card-actions pt-2">
          <router-link to="/settings" class="btn btn-warning btn-sm md:btn-md font-black uppercase tracking-widest px-10 shadow-lg shadow-warning/20">
            <i class="fi fi-sr-settings"></i>
            Configura Ora
          </router-link>
        </div>
      </div>
    </div>

    <!-- Contenuto principale: mostrato solo se non ci sono errori bloccanti -->
    <template v-else>
      <!-- Riga 1: Glicemia Attuale + Grafico -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        <div class="lg:col-span-4 flex">
          <CurrentGlucose class="flex-1" />
        </div>
        <div class="lg:col-span-8 flex">
          <GlucoseChart class="flex-1" />
        </div>
      </div>

      <!-- Riga 3: Statistiche (TIR, Media, ecc.) -->
      <div class="w-full">
        <DailyStats />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useGlucoseStore } from '../stores/glucose'
import { useAuthStore } from '../stores/auth'
import CurrentGlucose from '../components/CurrentGlucose.vue'
import GlucoseChart   from '../components/GlucoseChart.vue'
import DailyStats     from '../components/DailyStats.vue'

const store = useGlucoseStore()
const auth = useAuthStore()

// ── Auto-refresh ogni 60s ─────────────────────────────────────────────────────
let interval: any = null
onMounted(async () => {
  await store.fetchAll()
  interval = setInterval(() => store.fetchAll(), 60_000)
})
onUnmounted(() => clearInterval(interval))
</script>
