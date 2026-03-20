<template>
  <div class="flex flex-col gap-6 max-w-4xl mx-auto pb-12">
    
    <!-- Header Page -->
    <div class="card bg-base-200 shadow-xl border border-base-content/5">
      <div class="card-body p-6">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-primary/10 rounded-2xl">
            <i class="fi fi-sr-info text-primary text-2xl leading-none"></i>
          </div>
          <div>
            <h1 class="text-3xl font-black uppercase tracking-tight leading-none italic">{{ $t('about.title') }}</h1>
            <p class="text-xs font-black opacity-30 uppercase tracking-[0.2em] mt-2">{{ $t('about.subtitle') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Sezioni Informative -->
    <div class="grid grid-cols-1 gap-8">
      
      <!-- Introduzione -->
      <div class="card bg-base-200 shadow-sm border border-base-content/10">
        <div class="card-body gap-5">
          <h2 class="text-base font-black uppercase tracking-widest text-primary flex items-center gap-3">
            <i class="fi fi-sr-rocket-lunch"></i> {{ $t('about.what_is') }}
          </h2>
          <p class="text-base opacity-90 leading-relaxed">
            {{ $t('about.what_is_desc') }}
          </p>
        </div>
      </div>

      <!-- Predizione Glicemia -->
      <div class="card bg-base-200 shadow-xl border border-base-content/5">
        <div class="card-body gap-5">
          <h2 class="text-base font-black uppercase tracking-widest text-secondary flex items-center gap-3">
            <i class="fi fi-sr-chart-line-up"></i> {{ $t('about.prediction_title') }}
          </h2>
          <p class="text-base opacity-90 leading-relaxed">
            {{ $t('about.prediction_desc') }}
          </p>
          
          <!-- Formula Box -->
          <div class="bg-base-300/50 p-4 rounded-2xl border border-base-content/5 font-mono-num mb-2">
            <span class="text-[10px] font-black uppercase opacity-40 block mb-2">{{ $t('about.formula_label') }}</span>
            <p class="text-sm italic text-secondary">
              G_pred(t) = G_smussata + (ROC * t) - (Imp_Insulina * ISF) + (Imp_Carbo * CR)
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div class="bg-base-300/30 p-4 rounded-xl">
              <span class="text-xs font-black uppercase opacity-40 block mb-2">{{ $t('about.roc_title') }}</span>
              <p class="text-sm opacity-80">
                {{ $t('about.roc_desc') }}
              </p>
            </div>
            <div class="bg-base-300/30 p-4 rounded-xl">
              <span class="text-xs font-black uppercase opacity-40 block mb-2">{{ $t('about.clinical_impact_title') }}</span>
              <p class="text-sm opacity-80">
                {{ $t('about.clinical_impact_desc') }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Pattern Smart -->
      <div class="card bg-base-200 shadow-sm border border-base-content/10">
        <div class="card-body gap-5">
          <h2 class="text-base font-black uppercase tracking-widest text-accent flex items-center gap-3">
            <i class="fi fi-sr-brain"></i> {{ $t('about.patterns_title') }}
          </h2>
          <p class="text-base opacity-90 leading-relaxed">
            {{ $t('about.patterns_desc') }}
          </p>
          <ul class="list-disc list-inside text-base opacity-90 space-y-3 ml-2">
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
      <div class="card bg-base-200 shadow-sm border border-base-content/10">
        <div class="card-body gap-5">
          <h2 class="text-base font-black uppercase tracking-widest text-primary flex items-center gap-3">
            <i class="fi fi-sr-calculator"></i> {{ $t('about.iob_cob_title') }}
          </h2>
          <div class="space-y-5">
            <div>
              <h3 class="text-sm font-bold uppercase opacity-60 mb-2">IOB (Insulin On Board)</h3>
              <p class="text-base opacity-90">
                {{ $t('about.iob_desc', { n: store.settings.rapid_duration, isf: store.settings.insulin_sensitivity }) }}
              </p>
            </div>
            <div class="divider opacity-5 my-0"></div>
            <div>
              <h3 class="text-sm font-bold uppercase opacity-60 mb-2">COB (Carbs On Board)</h3>
              <p class="text-base opacity-90">
                {{ $t('about.cob_desc', { n: store.settings.carb_duration, cr: store.settings.carb_ratio }) }}
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
