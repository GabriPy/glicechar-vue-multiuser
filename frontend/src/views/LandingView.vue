<template>
  <div class="min-h-screen bg-base-100 overflow-x-hidden selection:bg-primary selection:text-white">
    
    <!-- Navbar -->
    <PublicNavbar />

    <!-- Hero Section -->
    <section class="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 overflow-hidden">
      <!-- Decor -->
      <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse"></div>
      <div class="absolute top-[40%] -right-[10%] w-[30%] h-[50%] bg-secondary/10 blur-[100px] rounded-full animate-pulse" style="animation-delay: 1s;"></div>
      
      <div class="max-w-4xl mx-auto text-center relative z-10">
        <div class="badge badge-outline badge-primary font-black text-[10px] uppercase tracking-[0.3em] py-3 px-5 mb-6">
          v1.4.0
        </div>
        <h1 class="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none mb-4">
          {{ $t('landing.hero_title') }} <br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
            {{ $t('landing.hero_subtitle') }}
          </span>
        </h1>
        <p class="text-base md:text-lg font-bold opacity-40 max-w-xl mx-auto mb-8 leading-relaxed">
          {{ $t('landing.hero_description') }}
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <router-link to="/register" class="btn btn-primary rounded-xl px-10 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/30 group">
            {{ $t('landing.get_started') }}
            <i class="fi fi-sr-arrow-right group-hover:translate-x-1 transition-transform ml-2"></i>
          </router-link>
          <router-link to="/login" class="btn btn-ghost rounded-xl px-10 font-black uppercase tracking-widest text-xs opacity-60 hover:opacity-100">
            {{ $t('landing.login') }}
          </router-link>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 px-4 bg-base-200/30">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <span class="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 block">{{ $t('landing.features_title') }}</span>
          <h2 class="text-3xl md:text-4xl font-black uppercase tracking-tighter mt-2 italic italic-primary">Strumenti <span class="text-primary">Intelligenti</span></h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Features loop -->
          <div v-for="n in 6" :key="n" class="card bg-base-100 shadow-lg border border-base-content/5 hover:border-primary/20 transition-all group overflow-hidden">
            <div class="card-body p-6 items-center text-center relative">
              <div class="w-12 h-12 bg-base-200 rounded-xl flex items-center justify-center text-primary text-xl mb-4 group-hover:bg-primary/10 transition-colors">
                <i :class="getFeatureIcon(n)"></i>
              </div>
              <h3 class="text-lg font-black uppercase tracking-tight mb-1">{{ $t(`landing.feature_${n}_title`) }}</h3>
              <p class="text-xs font-bold opacity-40 leading-relaxed">
                {{ $t(`landing.feature_${n}_desc`) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Deep Tech Section (Ex About Content) -->
    <section class="py-20 px-4 bg-base-100 relative overflow-hidden">
      <!-- Background Decor -->
      <div class="absolute top-[20%] left-0 w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div class="absolute bottom-0 right-0 w-[40%] h-[40%] bg-secondary/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div class="max-w-6xl mx-auto relative z-10">
        <!-- Intro Section -->
        <div class="max-w-3xl mx-auto text-center mb-24">
          <span class="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 block">{{ $t('about.what_is') }}</span>
          <h2 class="text-3xl md:text-4xl font-black uppercase tracking-tighter mt-2 mb-8 italic italic-primary">Controllo <span class="text-primary">Totale</span></h2>
          <p class="text-base md:text-lg font-bold opacity-40 leading-relaxed">
            {{ $t('about.what_is_desc') }}
          </p>
        </div>

        <div class="text-center mb-16">
          <span class="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 block">{{ $t('about.subtitle') }}</span>
          <h2 class="text-3xl md:text-4xl font-black uppercase tracking-tighter mt-2 italic italic-secondary">Il Cuore della <span class="text-secondary">Predizione</span></h2>
        </div>

        <!-- Featured Prediction Section -->
        <div class="card bg-base-200/50 shadow-2xl border border-base-content/5 overflow-hidden mb-12">
          <div class="card-body p-8 md:p-12 relative">
            <div class="absolute -top-20 -right-20 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-12">
              <!-- Left: Description -->
              <div class="lg:col-span-5">
                <h3 class="text-xs font-black uppercase tracking-[0.2em] text-secondary flex items-center gap-3 mb-6 italic">
                  <i class="fi fi-sr-chart-line-up"></i> {{ $t('about.prediction_title') }}
                </h3>
                <p class="text-base font-bold opacity-50 leading-relaxed">
                  {{ $t('about.prediction_desc') }}
                </p>
              </div>

              <!-- Right: Steps Grid -->
              <div class="lg:col-span-7">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div v-for="n in 4" :key="n" class="p-6 bg-base-100 rounded-2xl border border-base-content/5 hover:border-secondary/30 transition-all hover:shadow-lg group">
                    <div class="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary text-xs font-black mb-4 group-hover:bg-secondary group-hover:text-secondary-content transition-colors">
                      {{ n }}
                    </div>
                    <span class="text-[10px] font-black text-secondary uppercase block mb-2">{{ $t(`about.sim_step_${n}`) }}</span>
                    <p class="text-[11px] font-bold opacity-40 leading-relaxed">{{ $t(`about.sim_step_${n}_desc`) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Full Width Formula -->
            <div class="bg-base-100 p-10 rounded-[2.5rem] border border-base-content/5 shadow-inner overflow-x-auto relative group">
              <div class="absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]"></div>
              <span class="text-[10px] font-black uppercase opacity-30 block mb-8 tracking-[0.3em] text-center whitespace-nowrap relative z-10">{{ $t('about.formula_label') }}</span>
              <div class="flex items-center justify-center gap-4 md:gap-8 font-black tracking-tighter whitespace-nowrap px-4 relative z-10">
                <div class="flex flex-col items-center">
                  <span class="text-3xl md:text-5xl text-secondary">G<sub>pred</sub></span>
                </div>
                <span class="text-2xl md:text-4xl opacity-20">=</span>
                <div class="flex flex-col items-center">
                  <span class="text-2xl md:text-4xl opacity-70">G<sub>base</sub></span>
                </div>
                <span class="text-2xl md:text-4xl opacity-20">+</span>
                <div class="flex flex-col items-center">
                  <span class="text-2xl md:text-4xl text-primary">&Delta;<sub>trend</sub></span>
                </div>
                <span class="text-2xl md:text-4xl opacity-20">&minus;</span>
                <div class="flex flex-col items-center">
                  <span class="text-2xl md:text-4xl text-error">&Delta;<sub>ins</sub></span>
                </div>
                <span class="text-2xl md:text-4xl opacity-20">+</span>
                <div class="flex flex-col items-center">
                  <span class="text-2xl md:text-4xl text-success">&Delta;<sub>cho</sub></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Secondary Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Smart Patterns card -->
          <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden flex flex-col">
            <div class="card-body p-8 relative flex-1">
              <div class="absolute -top-10 -left-10 w-32 h-32 bg-accent/5 blur-3xl rounded-full"></div>
              <h3 class="text-xs font-black uppercase tracking-[0.2em] text-accent flex items-center gap-3 mb-6">
                <i class="fi fi-sr-brain"></i> {{ $t('about.patterns_title') }}
              </h3>
              <p class="text-[11px] font-bold opacity-40 leading-relaxed mb-8 flex-1">
                {{ $t('about.patterns_desc') }}
              </p>
              <div class="space-y-3 mt-auto">
                <div v-for="n in 2" :key="n" class="flex items-start gap-4 p-4 bg-base-200/30 rounded-xl border border-base-content/5">
                  <div class="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center text-accent shrink-0 text-xs">
                    <i :class="n === 1 ? 'fi fi-sr-apps-sort' : 'fi fi-sr-chart-line-up'"></i>
                  </div>
                  <div>
                    <h4 class="text-[9px] font-black uppercase tracking-tight">{{ $t(`about.pattern_logic_${n}`) }}</h4>
                    <p class="text-[9px] font-bold opacity-40 mt-0.5 leading-tight">{{ $t(`about.pattern_logic_${n}_desc`) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- IOB / COB card -->
          <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden flex flex-col">
            <div class="card-body p-8 relative flex-1">
              <div class="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full"></div>
              <h3 class="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-3 mb-6">
                <i class="fi fi-sr-calculator"></i> {{ $t('about.iob_cob_title') }}
              </h3>
              <div class="space-y-4 flex-1">
                <div class="p-5 bg-base-200/30 rounded-2xl border border-base-content/5 h-[45%] flex flex-col justify-center">
                  <span class="text-[9px] font-black uppercase opacity-30 block mb-2 tracking-widest">IOB (Insulin On Board)</span>
                  <p class="text-[11px] font-bold opacity-50 leading-relaxed">
                    {{ $t('about.iob_desc', { n: 3, isf: 60 }) }}
                  </p>
                </div>
                <div class="p-5 bg-base-200/30 rounded-2xl border border-base-content/5 h-[45%] flex flex-col justify-center">
                  <span class="text-[9px] font-black uppercase opacity-30 block mb-2 tracking-widest">COB (Carbs On Board)</span>
                  <p class="text-[11px] font-bold opacity-50 leading-relaxed">
                    {{ $t('about.cob_desc', { n: 4, cr: 15 }) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Tools & Legend Column -->
          <div class="space-y-8 flex flex-col">
            <!-- Dietometro -->
            <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden flex-1">
              <div class="card-body p-8 relative">
                <div class="absolute top-0 right-0 w-24 h-24 bg-warning/5 blur-3xl rounded-full"></div>
                <h3 class="text-xs font-black uppercase tracking-[0.2em] text-warning flex items-center gap-3 mb-4">
                  <i class="fi fi-sr-wheat"></i> {{ $t('about.dietometer_title') }}
                </h3>
                <p class="text-[11px] font-bold opacity-50 leading-relaxed">
                  {{ $t('about.dietometer_desc') }}
                </p>
              </div>
            </div>

            <!-- Chart Legend -->
            <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden">
              <div class="card-body p-8">
                <h3 class="text-xs font-black uppercase tracking-[0.2em] text-info flex items-center gap-3 mb-6">
                  <i class="fi fi-sr-interrogation"></i> {{ $t('about.chart_interpretation') }}
                </h3>
                <div class="space-y-4">
                  <div class="flex items-start gap-4">
                    <div class="w-5 h-5 rounded bg-slate-600/40 mt-1 shrink-0 shadow-sm"></div>
                    <div>
                      <span class="text-[10px] font-black uppercase block leading-none tracking-tight">{{ $t('about.data_gap') }}</span>
                      <p class="text-[10px] font-bold opacity-40 mt-1 leading-tight">{{ $t('about.data_gap_desc') }}</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-4">
                    <div class="w-5 h-5 rounded border-2 border-dashed border-slate-500 mt-1 shrink-0"></div>
                    <div>
                      <span class="text-[10px] font-black uppercase block leading-none tracking-tight">{{ $t('about.now_line') }}</span>
                      <p class="text-[10px] font-bold opacity-40 mt-1 leading-tight">{{ $t('about.now_line_desc') }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-20 px-4 max-w-3xl mx-auto">
      <div class="text-center mb-12">
        <span class="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 block">{{ $t('landing.faq_title') }}</span>
        <h2 class="text-3xl md:text-4xl font-black uppercase tracking-tighter mt-2 italic">FAQ</h2>
      </div>

      <div class="space-y-4">
        <div v-for="n in 3" :key="n" class="collapse collapse-plus bg-base-200/50 border border-base-content/5 rounded-2xl">
          <input type="radio" name="my-accordion-3" :checked="n === 1" /> 
          <div class="collapse-title text-sm font-black uppercase tracking-tight">
            {{ $t(`landing.faq_${n}_q`) }}
          </div>
          <div class="collapse-content"> 
            <p class="text-xs font-bold opacity-50 leading-relaxed">
              {{ $t(`landing.faq_${n}_a`) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Secure Management (Final CTA) -->
    <section class="py-20 px-4">
      <div class="max-w-4xl mx-auto text-center bg-primary text-primary-content rounded-[3rem] p-12 md:p-20 shadow-2xl relative overflow-hidden">
        <div class="absolute inset-0 opacity-10 pointer-events-none">
          <div class="absolute -top-20 -left-20 w-64 h-64 bg-white blur-[100px] rounded-full"></div>
          <div class="absolute -bottom-20 -right-20 w-64 h-64 bg-white blur-[100px] rounded-full"></div>
        </div>
        
        <i class="fi fi-sr-shield-check text-6xl opacity-30 mb-8"></i>
        <h2 class="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-6 italic leading-none">
          {{ $t('about.secure_management') }}
        </h2>
        <p class="text-sm md:text-base font-bold opacity-80 max-w-xl mx-auto mb-10 leading-relaxed">
          {{ $t('about.secure_management_desc') }}
        </p>
        <router-link to="/register" class="btn bg-white text-primary border-none hover:bg-white/90 btn-lg rounded-2xl px-16 font-black uppercase tracking-widest text-xs shadow-xl">
          {{ $t('landing.get_started') }}
        </router-link>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 px-4 border-t border-base-content/5 text-center">
      <div class="flex items-center justify-center gap-2 mb-6">
        <div class="w-6 h-6 bg-primary rounded flex items-center justify-center text-white text-xs">
          <i class="fi fi-sr-chart-line-up"></i>
        </div>
        <span class="text-lg font-black tracking-tighter uppercase italic">Glice<span class="text-primary">Chart</span></span>
      </div>
      <p class="text-[10px] font-black uppercase tracking-widest opacity-30 mb-2">
        {{ $t('landing.footer_tagline') }}
      </p>
      <div class="text-[8px] font-bold opacity-20 uppercase tracking-[0.3em]">
        © 2026 GliceChart Multiuser - Developed by Ghibiri
      </div>
    </footer>

  </div>
</template>

<script setup>
import PublicNavbar from '../components/PublicNavbar.vue'

function getFeatureIcon(n) {
  const icons = [
    'fi fi-sr-bolt',
    'fi fi-sr-brain',
    'fi fi-sr-wheat',
    'fi fi-sr-apps-sort',
    'fi fi-sr-file-pdf',
    'fi fi-sr-cloud-share'
  ]
  return icons[n-1]
}
</script>

<style scoped>
.collapse-title::after {
  top: 1.2rem;
}
</style>