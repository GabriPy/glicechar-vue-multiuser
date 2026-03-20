<template>
  <div class="flex flex-col gap-6 max-w-4xl mx-auto pb-12">
    
    <!-- Header Page -->
    <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden">
      <div class="card-body p-6 relative">
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full"></div>
        
        <div class="flex items-center gap-4 relative z-10">
          <div class="p-3 bg-primary/10 rounded-2xl">
            <i class="fi fi-sr-info text-primary text-2xl leading-none"></i>
          </div>
          <div>
            <h1 class="text-3xl font-black uppercase tracking-tight leading-none italic text-primary">Glice<span class="text-base-content">Info</span></h1>
            <p class="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] mt-2">{{ $t('about.subtitle') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Sezioni Informative -->
    <div class="grid grid-cols-1 gap-8 relative z-10">
      
      <!-- Introduzione -->
      <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden">
        <div class="card-body gap-5 relative">
          <div class="absolute -top-10 -left-10 w-24 h-24 bg-primary/5 blur-3xl rounded-full"></div>
          
          <h2 class="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-3 relative z-10">
            <i class="fi fi-sr-rocket-lunch"></i> {{ $t('about.what_is') }}
          </h2>
          <p class="text-sm opacity-90 leading-relaxed relative z-10 font-medium">
            {{ $t('about.what_is_desc') }}
          </p>
        </div>
      </div>

      <!-- Predizione Glicemia -->
      <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden">
        <div class="card-body gap-5 relative">
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-secondary/5 blur-3xl rounded-full"></div>
          
          <h2 class="text-xs font-black uppercase tracking-[0.2em] text-secondary flex items-center gap-3 relative z-10">
            <i class="fi fi-sr-chart-line-up"></i> {{ $t('about.prediction_title') }}
          </h2>
          <p class="text-sm opacity-90 leading-relaxed relative z-10 font-medium">
            {{ $t('about.prediction_desc') }}
          </p>
          
          <!-- Formula Box -->
          <div class="bg-base-200/50 p-5 rounded-2xl border border-base-content/5 font-mono relative z-10">
            <span class="text-[9px] font-black uppercase opacity-40 block mb-3 tracking-widest">{{ $t('about.formula_label') }}</span>
            <p class="text-xs italic text-secondary font-black tracking-tight">
              G_pred(t) = G_smussata + (ROC * t) - (Imp_Insulina * ISF) + (Imp_Carbo * CR)
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 relative z-10">
            <div class="bg-base-200/50 p-4 rounded-xl border border-base-content/5">
              <span class="text-[9px] font-black uppercase opacity-40 block mb-2 tracking-widest">{{ $t('about.roc_title') }}</span>
              <p class="text-xs opacity-80 font-medium">
                {{ $t('about.roc_desc') }}
              </p>
            </div>
            <div class="bg-base-200/50 p-4 rounded-xl border border-base-content/5">
              <span class="text-[9px] font-black uppercase opacity-40 block mb-2 tracking-widest">{{ $t('about.clinical_impact_title') }}</span>
              <p class="text-xs opacity-80 font-medium">
                {{ $t('about.clinical_impact_desc') }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Pattern Smart -->
      <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden">
        <div class="card-body gap-5 relative">
          <div class="absolute -top-10 -left-10 w-24 h-24 bg-accent/5 blur-3xl rounded-full"></div>
          
          <h2 class="text-xs font-black uppercase tracking-[0.2em] text-accent flex items-center gap-3 relative z-10">
            <i class="fi fi-sr-brain"></i> {{ $t('about.patterns_title') }}
          </h2>
          <p class="text-sm opacity-90 leading-relaxed relative z-10 font-medium">
            {{ $t('about.patterns_desc') }}
          </p>
          <ul class="list-disc list-inside text-sm opacity-90 space-y-3 ml-2 relative z-10 font-medium">
            <li>
              {{ $t('about.hourly_overlay') }}
            </li>
            <li>
              {{ $t('about.note_correlation') }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Logica IOB e COB -->
      <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden">
        <div class="card-body gap-5 relative">
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full"></div>
          
          <h2 class="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-3 relative z-10">
            <i class="fi fi-sr-calculator"></i> {{ $t('about.iob_cob_title') }}
          </h2>
          <div class="space-y-5 relative z-10">
            <div>
              <h3 class="text-[10px] font-black uppercase opacity-60 mb-2 tracking-widest">IOB (Insulin On Board)</h3>
              <p class="text-sm opacity-90 font-medium">
                {{ $t('about.iob_desc', { n: store.settings?.rapid_duration || 3, isf: store.settings?.insulin_sensitivity || 60 }) }}
              </p>
            </div>
            <div>
              <h3 class="text-[10px] font-black uppercase opacity-60 mb-2 tracking-widest">COB (Carbs On Board)</h3>
              <p class="text-sm opacity-90 font-medium">
                {{ $t('about.cob_desc', { n: store.settings?.carb_duration || 4, cr: store.settings?.carb_ratio || 15 }) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Dietometro -->
      <div class="card bg-base-200 shadow-sm border border-base-content/10">
        <div class="card-body gap-5">
          <h2 class="text-base font-black uppercase tracking-widest text-warning flex items-center gap-3">
            <i class="fi fi-sr-wheat"></i> {{ $t('about.dietometer_title') }}
          </h2>
          <p class="text-base opacity-90 leading-relaxed">
            {{ $t('about.dietometer_desc') }}
          </p>
        </div>
      </div>

      <!-- Interpretazione Grafico -->
      <div class="card bg-base-200 shadow-sm border border-base-content/10">
        <div class="card-body gap-5">
          <h2 class="text-base font-black uppercase tracking-widest text-info flex items-center gap-3">
            <i class="fi fi-sr-interrogation"></i> {{ $t('about.chart_interpretation') }}
          </h2>
          <div class="space-y-4">
            <div class="flex items-start gap-4">
              <div class="w-5 h-5 rounded bg-slate-600/40 mt-1 shrink-0"></div>
              <div>
                <span class="text-sm font-bold uppercase block">{{ $t('about.data_gap') }}</span>
                <p class="text-xs opacity-80">{{ $t('about.data_gap_desc') }}</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-5 h-5 rounded border-2 border-dashed border-slate-500 mt-1 shrink-0"></div>
              <div>
                <span class="text-sm font-bold uppercase block">{{ $t('about.now_line') }}</span>
                <p class="text-xs opacity-80">{{ $t('about.now_line_desc') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Note Finali -->
      <div class="card bg-primary text-primary-content shadow-md border border-primary-content/10">
        <div class="card-body items-center text-center py-10">
          <i class="fi fi-sr-shield-check text-5xl opacity-50 mb-3"></i>
          <h2 class="text-xl font-black uppercase italic tracking-tight">{{ $t('about.secure_management') }}</h2>
          <p class="text-sm opacity-80 max-w-lg leading-relaxed">
            {{ $t('about.secure_management_desc') }}
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useGlucoseStore } from '../stores/glucose'
const store = useGlucoseStore()
</script>

<style scoped>
/* Stili specifici */
</style>
