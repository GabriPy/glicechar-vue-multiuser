<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden">
      <div class="card-body p-4 md:p-6 relative">
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-accent/5 blur-3xl rounded-full"></div>
        
        <div class="flex items-center gap-4 relative z-10">
          <div class="w-12 h-12 bg-accent/10 rounded-2xl text-accent flex items-center justify-center text-2xl">
            <i class="fi fi-sr-brain"></i>
          </div>
          <div>
            <h1 class="text-3xl font-black uppercase tracking-tight leading-none italic text-primary">Glice<span class="text-base-content">AI</span></h1>
            <p class="text-xs font-black opacity-30 uppercase tracking-[0.2em] mt-2">{{ $t('patterns.subtitle') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Caricamento -->
    <div v-if="store.historyLoading" class="flex flex-col items-center justify-center py-20 gap-4">
      <span class="loading loading-ring loading-lg text-primary"></span>
      <span class="text-xs font-black uppercase tracking-widest opacity-40">{{ $t('patterns.analyzing') }}</span>
    </div>

    <!-- Nessun Pattern o Dati Insufficienti -->
    <div v-else-if="!hasPatterns" class="flex flex-col items-center justify-center py-20 opacity-30 gap-4">
      <i class="fi fi-sr-search text-4xl"></i>
      <span class="text-base font-black uppercase tracking-widest">{{ $t('patterns.no_patterns') }}</span>
      <p class="text-xs uppercase tracking-widest max-w-xs text-center leading-relaxed">
        {{ $t('patterns.no_patterns_desc') }}
      </p>
    </div>

    <!-- Patterns List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <div v-for="p in store.patterns" :key="p.id" class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden group">
        <div class="card-body p-6 gap-4 relative">
          <!-- Hover Decor -->
          <div class="absolute inset-0 bg-base-content/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          
          <div class="flex items-center justify-between relative z-10">
            <div class="flex items-center gap-2">
              <i class="fi" :class="[p.icon, `text-${p.color}`]"></i>
              <span class="text-[10px] font-black uppercase tracking-widest opacity-60 italic">{{ $t('patterns.detected') }}</span>
            </div>
            <div v-if="p.confidence > 80" class="badge badge-accent badge-outline font-black text-[10px] uppercase tracking-widest">{{ $t('patterns.high_priority') }}</div>
          </div>
          <h2 class="text-2xl font-black italic tracking-tight leading-none relative z-10">{{ p.title }}</h2>
          <p class="text-sm opacity-80 leading-relaxed relative z-10 font-medium">
            {{ p.description }}
          </p>
          <div class="bg-base-200/50 p-4 rounded-2xl flex flex-col gap-3 relative z-10 border border-base-content/5">
            <div class="flex items-center justify-between text-[10px] font-black uppercase opacity-40">
              <span>{{ $t('patterns.reliability') }}</span>
              <span>{{ p.confidence }}%</span>
            </div>
            <div class="w-full bg-base-content/5 h-2 rounded-full overflow-hidden">
              <div class="h-full transition-all duration-1000" :class="`bg-${p.color}`" :style="{ width: p.intensity + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Data Quality Alert -->
    <div class="alert bg-base-100 border border-base-content/5 shadow-xl p-6 mt-auto overflow-hidden relative">
      <div class="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full"></div>
      
      <div class="flex items-center gap-4 relative z-10">
        <div class="w-12 h-12 bg-primary/10 rounded-2xl text-primary flex items-center justify-center text-xl">
          <i class="fi fi-sr-database"></i>
        </div>
        <div>
          <h3 class="font-black uppercase tracking-tight text-sm italic">{{ $t('patterns.data_analyzed') }}</h3>
          <p class="text-[10px] opacity-40 uppercase tracking-widest mt-1">{{ $t('patterns.data_analyzed_desc') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useGlucoseStore } from '../stores/glucose'

const store = useGlucoseStore()

const hasPatterns = computed(() => {
  if (!store.patterns) return false
  return !!(store.patterns.pizza || store.patterns.night || store.patterns.dawn)
})

onMounted(async () => {
  // Carichiamo 3 giorni di dati per un'analisi reale dei pattern
  await store.fetchLongHistory(4320)
})
</script>
