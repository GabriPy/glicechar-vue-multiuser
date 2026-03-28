<template>
  <div class="space-y-3">
    <!-- Alert errore critico (Sync) -->
    <div v-if="store.hasSyncError" 
      class="card bg-base-100 shadow-xl border-2 border-warning/30 overflow-hidden">
      <div class="card-body items-center text-center p-8 space-y-6">
        <!-- Icona centrata e animata -->
        <div class="relative flex items-center justify-center">
          <div class="absolute w-20 h-20 bg-warning/10 rounded-3xl animate-ping"></div>
          <div class="relative w-16 h-16 rounded-3xl bg-warning/20 flex items-center justify-center">
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

      <!-- Statistiche Rapide -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        <!-- Media -->
        <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden group hover:border-primary/30 transition-all">
          <div class="card-body p-5 relative items-center text-center">
            <div class="absolute -top-10 -right-10 w-24 h-24 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-colors"></div>
            <div class="flex flex-col items-center gap-2 relative z-10 w-full">
              <div class="w-12 h-12 bg-primary/10 rounded-2xl text-primary flex items-center justify-center text-xl mb-1">
                <i class="fi fi-sr-stats"></i>
              </div>
              <span class="text-[11px] font-extrabold uppercase tracking-[0.2em] text-primary/60">{{ $t('home.avg') }}</span>
            </div>
            <div class="flex items-baseline justify-center gap-2 mt-2 relative z-10">
              <span class="text-4xl font-extrabold tracking-tight text-base-content">{{ store.stats?.avg ?? '--' }}</span>
              <span class="text-[10px] font-bold opacity-40 uppercase">{{ $t('common.mgdl') }}</span>
            </div>
          </div>
        </div>

        <!-- TIR -->
        <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden group hover:border-success/30 transition-all">
          <div class="card-body p-5 relative items-center text-center">
            <div class="absolute -top-10 -right-10 w-24 h-24 bg-success/5 blur-3xl rounded-full group-hover:bg-success/10 transition-colors"></div>
            <div class="flex flex-col items-center gap-2 relative z-10 w-full">
              <div class="w-12 h-12 bg-success/10 rounded-2xl text-success flex items-center justify-center text-xl mb-1">
                <i class="fi fi-sr-target"></i>
              </div>
              <span class="text-[11px] font-extrabold uppercase tracking-[0.2em] text-success/60">{{ $t('home.tir') }}</span>
            </div>
            <div class="flex items-baseline justify-center gap-2 mt-2 relative z-10">
              <span class="text-4xl font-extrabold tracking-tight text-base-content">{{ store.stats?.tir ?? '--' }}</span>
              <span class="text-[10px] font-bold opacity-40 uppercase">%</span>
            </div>
          </div>
        </div>

        <!-- IOB -->
        <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden group hover:border-secondary/30 transition-all">
          <div class="card-body p-5 relative items-center text-center">
            <div class="absolute -top-10 -right-10 w-24 h-24 bg-secondary/5 blur-3xl rounded-full group-hover:bg-secondary/10 transition-colors"></div>
            <div class="flex flex-col items-center gap-2 relative z-10 w-full">
              <div class="w-12 h-12 bg-secondary/10 rounded-2xl text-secondary flex items-center justify-center text-xl mb-1">
                <i class="fi fi-sr-syringe"></i>
              </div>
              <span class="text-[11px] font-extrabold uppercase tracking-[0.2em] text-secondary/60">IOB</span>
            </div>
            <div class="flex items-baseline justify-center gap-2 mt-2 relative z-10">
              <span class="text-4xl font-extrabold tracking-tight text-base-content">{{ store.iob.toFixed(1) }}</span>
              <span class="text-[10px] font-bold opacity-40 uppercase">{{ $t('common.units') }}</span>
            </div>
          </div>
        </div>

        <!-- COB -->
        <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden group hover:border-accent/30 transition-all">
          <div class="card-body p-5 relative items-center text-center">
            <div class="absolute -top-10 -right-10 w-24 h-24 bg-accent/5 blur-3xl rounded-full group-hover:bg-accent/10 transition-colors"></div>
            <div class="flex flex-col items-center gap-2 relative z-10 w-full">
              <div class="w-12 h-12 bg-accent/10 rounded-2xl text-accent flex items-center justify-center text-xl mb-1">
                <i class="fi fi-sr-wheat"></i>
              </div>
              <span class="text-[11px] font-extrabold uppercase tracking-[0.2em] text-accent/60">COB</span>
            </div>
            <div class="flex items-baseline justify-center gap-2 mt-2 relative z-10">
              <span class="text-4xl font-extrabold tracking-tight text-base-content">{{ store.cob.toFixed(0) }}</span>
              <span class="text-[10px] font-bold opacity-40 uppercase">g</span>
            </div>
          </div>
        </div>
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
