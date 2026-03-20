<template>
  <div v-if="displayStats" class="stats stats-vertical lg:stats-horizontal shadow-xl bg-base-100 border border-base-content/5 w-full overflow-hidden rounded-2xl">
    
    <!-- Time In Range -->
    <div class="stat place-items-center gap-1 py-4 border-base-content/5">
      <div class="stat-title text-[10px] uppercase font-black tracking-widest opacity-40 flex items-center gap-2">
        <i class="fi fi-sr-target text-[10px]"></i>
        {{ $t('home.tir') }}
      </div>
      <div class="stat-value flex items-center gap-2 mt-1">
        <div class="radial-progress bg-base-200 border-2 border-base-200 text-success" :style="`--value:${displayStats.tir}; --size:3rem; --thickness: 4px;`" role="progressbar">
          <span class="text-[11px] font-black text-base-content">{{ displayStats.tir }}%</span>
        </div>
      </div>
      <div class="stat-desc text-[9px] font-black opacity-30 uppercase tracking-tighter mt-1">Target {{ store.settings.tir_min }}-{{ store.settings.tir_max }}</div>
    </div>

    <!-- Media -->
    <div class="stat place-items-center gap-1 py-4 border-base-content/5">
      <div class="stat-title text-[10px] uppercase font-black tracking-widest opacity-40 flex items-center gap-2">
        <i class="fi fi-sr-stats text-[10px]"></i>
        {{ $t('home.avg') }}
      </div>
      <div class="stat-value text-2xl font-black tracking-tighter italic">{{ displayStats.avg }}</div>
      <div class="stat-desc text-[9px] font-black opacity-30 uppercase tracking-tighter mt-1">{{ $t('common.mgdl') }}</div>
    </div>

    <!-- Min/Max -->
    <div class="stat place-items-center gap-1 py-4 border-base-content/5">
      <div class="stat-title text-[10px] uppercase font-black tracking-widest opacity-40 flex items-center gap-2">
        <i class="fi fi-sr-arrows-v text-[10px]"></i>
        Range
      </div>
      <div class="stat-value text-xl font-black tracking-tighter italic flex items-baseline gap-1">
        <span class="text-error">{{ displayStats.min }}</span>
        <span class="text-xs opacity-20">/</span>
        <span class="text-info">{{ displayStats.max }}</span>
      </div>
      <div class="stat-desc text-[9px] font-black opacity-30 uppercase tracking-tighter mt-1">Min / Max</div>
    </div>

    <!-- GMI -->
    <div class="stat place-items-center gap-1 py-4 border-base-content/5">
      <div class="stat-title text-[10px] uppercase font-black tracking-widest opacity-40 flex items-center gap-2">
        <i class="fi fi-sr-clock text-[10px]"></i>
        GMI
      </div>
      <div class="stat-value text-2xl font-black tracking-tighter italic text-primary">{{ displayStats.gmi }}%</div>
      <div class="stat-desc text-[9px] font-black opacity-30 uppercase tracking-tighter mt-1">Gestione</div>
    </div>

    <!-- eA1c -->
    <div class="stat place-items-center gap-1 py-4 border-base-content/5">
      <div class="stat-title text-[10px] uppercase font-black tracking-widest opacity-40 flex items-center gap-2">
        <i class="fi fi-sr-chart-pie-alt text-[10px]"></i>
        eA1c
      </div>
      <div class="stat-value text-2xl font-black tracking-tighter italic text-secondary">{{ displayStats.eA1c }}%</div>
      <div class="stat-desc text-[9px] font-black opacity-30 uppercase tracking-tighter mt-1">HbA1c stim.</div>
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
