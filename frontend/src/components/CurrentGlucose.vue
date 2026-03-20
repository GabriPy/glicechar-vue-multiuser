<template>
  <div class="card bg-base-100 shadow-xl border border-base-content/5 h-full relative overflow-hidden group">
    <!-- Glow di sfondo dinamico -->
    <div 
      class="absolute inset-0 opacity-[0.05] blur-3xl transition-colors duration-1000"
      :class="store.glucoseColor.replace('text-', 'bg-')"
    ></div>

    <div class="card-body items-center justify-center text-center gap-1 py-6 relative z-10">

      <!-- Stato Live -->
      <div class="flex items-center gap-2 mb-1">
        <div class="relative flex h-1.5 w-1.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
          <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-success"></span>
        </div>
        <span class="text-[11px] uppercase font-black tracking-[0.2em] opacity-40">Live Monitoring</span>
      </div>

      <!-- Valore + freccia -->
      <div v-if="store.current" class="flex flex-col items-center gap-4">
        <div class="flex items-center gap-3">
          <div class="flex flex-col items-end">
            <span
              class="font-black leading-none text-8xl tracking-tighter transition-colors duration-500"
              :class="store.glucoseColor"
            >{{ store.current.glucose }}</span>
          </div>
          <div class="flex flex-col items-center gap-1">
            <TrendArrow :trend="store.current.trend" :size="48" />
            <span class="text-[11px] font-bold opacity-30 tracking-widest uppercase">mg/dL</span>
          </div>
        </div>

        <div v-if="store.insulinRecords.length || store.carbRecords.length" class="flex items-center gap-6 mt-1">
          <div class="flex flex-col items-center gap-0.5">
            <div class="flex items-center gap-1.5">
              <div class="w-2 h-2 rounded-full bg-primary"></div>
              <span class="text-xl font-black tracking-tight">{{ store.iob.toFixed(1) }} <span class="text-xs opacity-40">U</span></span>
            </div>
            <span class="text-[10px] font-black uppercase opacity-30 tracking-widest">Insulina Attiva</span>
          </div>
          
          <div class="divider divider-horizontal mx-0 h-6 opacity-10"></div>

          <div class="flex flex-col items-center gap-0.5">
            <div class="flex items-center gap-1.5">
              <div class="w-2 h-2 rounded-full bg-accent"></div>
              <span class="text-xl font-black tracking-tight">{{ Math.round(store.cob) }} <span class="text-xs opacity-40">g</span></span>
            </div>
            <span class="text-[10px] font-black uppercase opacity-30 tracking-widest">CHO da assorbire</span>
          </div>
        </div>
      </div>

      <!-- Nessun dato -->
      <div v-else class="text-6xl font-black opacity-10">—</div>

      <!-- Footer Info -->
      <div v-if="store.minutesAgo !== null" class="mt-2 px-4 py-1 rounded-full bg-base-300/50 border border-base-content/5">
        <span class="text-[11px] font-bold opacity-40 uppercase tracking-wider">
          {{ store.minutesAgo === 0 ? 'adesso' : $t('home.ago', { n: store.minutesAgo }) }}
        </span>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useGlucoseStore } from '../stores/glucose'
import TrendArrow from './TrendArrow.vue'

const store = useGlucoseStore()
</script>
