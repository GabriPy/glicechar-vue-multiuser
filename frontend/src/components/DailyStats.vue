<template>
  <div v-if="displayStats" class="stats stats-vertical lg:stats-horizontal shadow-sm bg-base-200 border border-base-content/10 w-full overflow-hidden rounded-2xl">
    
    <!-- Time In Range -->
    <div class="stat place-items-center gap-1 py-3">
      <div class="stat-title text-[11px] uppercase font-black tracking-widest opacity-40 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3 opacity-40">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        {{ $t('home.tir') }}
      </div>
      <div class="stat-value flex items-center gap-2">
        <div class="radial-progress bg-base-300 border-2 border-base-300" :style="`--value:${displayStats.tir}; --size:2.8rem; --thickness: 3px;`" role="progressbar">
          <span class="text-[11px] font-black text-base-content">{{ displayStats.tir }}%</span>
        </div>
      </div>
      <div class="stat-desc text-[10px] font-bold opacity-30 uppercase tracking-tight mt-1">Target {{ store.settings.tir_min }}-{{ store.settings.tir_max }}</div>
    </div>

    <!-- Media -->
    <div class="stat place-items-center gap-1 py-3">
      <div class="stat-title text-[11px] uppercase font-black tracking-widest opacity-40 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3 opacity-40">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V19.875c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
        {{ $t('home.avg') }}
      </div>
      <div class="stat-value text-2xl font-black tracking-tighter">{{ displayStats.avg }}</div>
      <div class="stat-desc text-[10px] font-bold opacity-30 uppercase tracking-tight mt-1">{{ $t('common.mgdl') }}</div>
    </div>

    <!-- Minimo -->
    <div class="stat place-items-center gap-1 py-3">
      <div class="stat-title text-[11px] uppercase font-black tracking-widest opacity-40 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3 opacity-40">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
        </svg>
        {{ $t('home.min') }}
      </div>
      <div class="stat-value text-2xl font-black tracking-tighter">{{ displayStats.min }}</div>
      <div class="stat-desc text-[10px] font-bold opacity-30 uppercase tracking-tight mt-1">{{ $t('common.mgdl') }}</div>
    </div>

    <!-- Massimo -->
    <div class="stat place-items-center gap-1 py-3">
      <div class="stat-title text-[11px] uppercase font-black tracking-widest opacity-40 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3 opacity-40">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
        </svg>
        {{ $t('home.max') }}
      </div>
      <div class="stat-value text-2xl font-black tracking-tighter">{{ displayStats.max }}</div>
      <div class="stat-desc text-[10px] font-bold opacity-30 uppercase tracking-tight mt-1">{{ $t('common.mgdl') }}</div>
    </div>

    <!-- GMI -->
    <div class="stat place-items-center gap-1 py-3">
      <div class="stat-title text-[11px] uppercase font-black tracking-widest opacity-40 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3 opacity-40">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        GMI
      </div>
      <div class="stat-value text-2xl font-black tracking-tighter">{{ displayStats.gmi }}%</div>
      <div class="stat-desc text-[10px] font-bold opacity-30 uppercase tracking-tight mt-1">Gestione</div>
    </div>

    <!-- eA1c -->
    <div class="stat place-items-center gap-1 py-3">
      <div class="stat-title text-[11px] uppercase font-black tracking-widest opacity-40 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3 opacity-40">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
        </svg>
        eA1c
      </div>
      <div class="stat-value text-2xl font-black tracking-tighter">{{ displayStats.eA1c }}%</div>
      <div class="stat-desc text-[10px] font-bold opacity-30 uppercase tracking-tight mt-1">HbA1c stim.</div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGlucoseStore } from '../stores/glucose'

const props = defineProps({
  stats: {
    type: Object,
    default: null
  }
})

const store = useGlucoseStore()

const displayStats = computed(() => {
  return props.stats || store.stats
})
</script>
