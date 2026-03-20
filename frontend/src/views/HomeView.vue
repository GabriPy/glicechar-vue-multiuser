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

      <!-- Statistiche Rapide -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <!-- Media -->
        <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden group hover:border-primary/30 transition-all">
          <div class="card-body p-5 relative">
            <div class="absolute -top-10 -right-10 w-24 h-24 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-colors"></div>
            <div class="flex items-center justify-between relative z-10">
              <span class="text-[10px] font-black uppercase tracking-widest opacity-40">{{ $t('home.avg') }}</span>
              <div class="p-2 bg-primary/10 rounded-xl text-primary">
                <i class="fi fi-sr-stats"></i>
              </div>
            </div>
            <div class="flex items-baseline gap-2 mt-2 relative z-10">
              <span class="text-4xl font-black tracking-tighter italic">{{ store.stats?.avg || '--' }}</span>
              <span class="text-[10px] font-bold opacity-30 uppercase">{{ $t('common.mgdl') }}</span>
            </div>
          </div>
        </div>

        <!-- TIR -->
        <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden group hover:border-success/30 transition-all">
          <div class="card-body p-5 relative">
            <div class="absolute -top-10 -right-10 w-24 h-24 bg-success/5 blur-3xl rounded-full group-hover:bg-success/10 transition-colors"></div>
            <div class="flex items-center justify-between relative z-10">
              <span class="text-[10px] font-black uppercase tracking-widest opacity-40">{{ $t('home.tir') }}</span>
              <div class="p-2 bg-success/10 rounded-xl text-success">
                <i class="fi fi-sr-target"></i>
              </div>
            </div>
            <div class="flex items-baseline gap-2 mt-2 relative z-10">
              <span class="text-4xl font-black tracking-tighter italic">{{ store.stats?.tir || '--' }}</span>
              <span class="text-[10px] font-bold opacity-30 uppercase">%</span>
            </div>
          </div>
        </div>

        <!-- IOB -->
        <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden group hover:border-secondary/30 transition-all">
          <div class="card-body p-5 relative">
            <div class="absolute -top-10 -right-10 w-24 h-24 bg-secondary/5 blur-3xl rounded-full group-hover:bg-secondary/10 transition-colors"></div>
            <div class="flex items-center justify-between relative z-10">
              <span class="text-[10px] font-black uppercase tracking-widest opacity-40">IOB ({{ $t('home.active_insulin') }})</span>
              <div class="p-2 bg-secondary/10 rounded-xl text-secondary">
                <i class="fi fi-sr-syringe"></i>
              </div>
            </div>
            <div class="flex items-baseline gap-2 mt-2 relative z-10">
              <span class="text-4xl font-black tracking-tighter italic">{{ store.iob.toFixed(1) }}</span>
              <span class="text-[10px] font-bold opacity-30 uppercase">{{ $t('common.units') }}</span>
            </div>
          </div>
        </div>

        <!-- COB -->
        <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden group hover:border-accent/30 transition-all">
          <div class="card-body p-5 relative">
            <div class="absolute -top-10 -right-10 w-24 h-24 bg-accent/5 blur-3xl rounded-full group-hover:bg-accent/10 transition-colors"></div>
            <div class="flex items-center justify-between relative z-10">
              <span class="text-[10px] font-black uppercase tracking-widest opacity-40">COB ({{ $t('home.active_carbs') }})</span>
              <div class="p-2 bg-accent/10 rounded-xl text-accent">
                <i class="fi fi-sr-wheat"></i>
              </div>
            </div>
            <div class="flex items-baseline gap-2 mt-2 relative z-10">
              <span class="text-4xl font-black tracking-tighter italic">{{ store.cob.toFixed(0) }}</span>
              <span class="text-[10px] font-bold opacity-30 uppercase">g</span>
            </div>
          </div>
      </div>
    </div>

    <!-- Statistiche Dettagliate -->
    <div class="w-full relative z-10">
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
