<template>
  <div class="min-h-screen bg-base-100 flex flex-col font-sans selection:bg-primary selection:text-white overflow-x-hidden">
    <PublicNavbar />

    <!-- Hero Section: DaisyUI 5 Hero with glass effect and radial gradient -->
    <section class="hero min-h-[90vh] relative overflow-hidden bg-base-100">
      <!-- Background Decorations -->
      <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div class="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 blur-[120px] rounded-full animate-pulse"></div>
        <div class="absolute top-1/2 -right-24 w-80 h-80 bg-secondary/10 blur-[100px] rounded-full"></div>
      </div>

      <div class="hero-content text-center z-10 px-4 max-w-5xl">
        <div class="flex flex-col items-center">
          <!-- Badge v1.4.4 -->
          <div class="badge badge-primary badge-outline badge-md mb-8 font-black uppercase tracking-widest animate-bounce px-6 py-4 rounded-full border-2">
            {{ $t('common.current_version') }}
          </div>

          <h1 class="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.9] mb-8 group">
            <span class="block transition-transform duration-500 group-hover:-translate-y-1">{{ $t('landing.hero_title') }}</span>
            <span class="text-primary relative inline-block transition-transform duration-500 group-hover:translate-y-1">
              {{ $t('landing.hero_subtitle') }}
              <div class="absolute -bottom-2 left-0 w-full h-3 bg-primary/20 -rotate-1 -z-10 rounded-full"></div>
            </span>
          </h1>

          <p class="text-lg md:text-xl font-bold opacity-60 mb-12 max-w-2xl leading-relaxed">
            {{ $t('landing.hero_description') }}
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
            <router-link to="/register" class="btn btn-primary btn-lg rounded-2xl px-12 font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/30 group border-none">
              {{ $t('landing.get_started') }}
              <i class="fi fi-sr-arrow-right group-hover:translate-x-2 transition-transform ml-2"></i>
            </router-link>
            <router-link to="/login" class="btn btn-ghost btn-lg rounded-2xl px-12 font-black uppercase tracking-widest text-xs opacity-60 hover:opacity-100 border border-base-content/10 hover:border-primary/30">
              {{ $t('landing.login') }}
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Bento Features Grid: Modern Layout -->
    <section class="py-24 px-4 bg-base-200/30">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-20 space-y-4">
          <span class="badge badge-secondary badge-outline font-black uppercase tracking-[0.3em] px-4 py-3">{{ $t('landing.features_title') }}</span>
          <h2 class="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">{{ $t('landing.smart_tools') }}</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-6 grid-rows-2 gap-6 min-h-[600px]">
          <!-- Feature 1: Real-time Sync (Large) -->
          <div class="md:col-span-3 md:row-span-1 card bg-base-100 shadow-xl border border-base-content/5 group hover:border-primary/30 transition-all duration-500 overflow-hidden">
            <div class="card-body p-8 relative">
              <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-2xl mb-6 group-hover:scale-110 transition-transform duration-500">
                <i :class="getFeatureIcon(1)"></i>
              </div>
              <h3 class="card-title text-2xl font-black uppercase tracking-tight italic mb-2">{{ $t('landing.feature_1_title') }}</h3>
              <p class="font-bold opacity-50 leading-relaxed">{{ $t('landing.feature_1_desc') }}</p>
              <!-- Decorative background icon -->
              <i :class="getFeatureIcon(1)" class="absolute -bottom-10 -right-10 text-9xl opacity-[0.02] -rotate-12 group-hover:rotate-0 transition-transform duration-700"></i>
            </div>
          </div>

          <!-- Feature 2: AI Prediction (Accent) -->
          <div class="md:col-span-3 md:row-span-1 card bg-primary text-primary-content shadow-xl border-none group hover:scale-[1.02] transition-all duration-500 overflow-hidden">
            <div class="card-body p-8 relative">
              <div class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 group-hover:rotate-12 transition-transform">
                <i :class="getFeatureIcon(2)"></i>
              </div>
              <h3 class="card-title text-2xl font-black uppercase tracking-tight italic mb-2">{{ $t('landing.feature_2_title') }}</h3>
              <p class="font-bold opacity-80 leading-relaxed">{{ $t('landing.feature_2_desc') }}</p>
              <i :class="getFeatureIcon(2)" class="absolute -bottom-10 -right-10 text-9xl opacity-10 -rotate-12 group-hover:rotate-0 transition-transform duration-700"></i>
            </div>
          </div>

          <!-- Feature 3: Dietometro -->
          <div class="md:col-span-2 md:row-span-1 card bg-base-100 shadow-xl border border-base-content/5 group hover:border-secondary/30 transition-all duration-500">
            <div class="card-body p-8">
              <div class="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary text-xl mb-4 group-hover:scale-110 transition-transform">
                <i :class="getFeatureIcon(3)"></i>
              </div>
              <h3 class="text-xl font-black uppercase tracking-tight italic mb-2">{{ $t('landing.feature_3_title') }}</h3>
              <p class="text-sm font-bold opacity-50">{{ $t('landing.feature_3_desc') }}</p>
            </div>
          </div>

          <!-- Feature 4: Smart Patterns -->
          <div class="md:col-span-2 md:row-span-1 card bg-base-100 shadow-xl border border-base-content/5 group hover:border-accent/30 transition-all duration-500">
            <div class="card-body p-8">
              <div class="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent text-xl mb-4 group-hover:scale-110 transition-transform">
                <i :class="getFeatureIcon(4)"></i>
              </div>
              <h3 class="text-xl font-black uppercase tracking-tight italic mb-2">{{ $t('landing.feature_4_title') }}</h3>
              <p class="text-sm font-bold opacity-50">{{ $t('landing.feature_4_desc') }}</p>
            </div>
          </div>

          <!-- Feature 5: Multiutente -->
          <div class="md:col-span-2 md:row-span-1 card bg-base-100 shadow-xl border border-base-content/5 group hover:border-primary/30 transition-all duration-500">
            <div class="card-body p-8">
              <div class="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center text-info text-xl mb-4 group-hover:scale-110 transition-transform">
                <i :class="getFeatureIcon(6)"></i>
              </div>
              <h3 class="text-xl font-black uppercase tracking-tight italic mb-2">{{ $t('landing.feature_6_title') }}</h3>
              <p class="text-sm font-bold opacity-50">{{ $t('landing.feature_6_desc') }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats / Trust Section -->
    <section class="py-20 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="stats stats-vertical lg:stats-horizontal shadow-2xl w-full bg-base-300/50 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 overflow-hidden relative">
          <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
          
          <div class="stat place-items-center py-10">
            <div class="stat-title font-black uppercase tracking-widest text-[10px] opacity-40 mb-2">Performance</div>
            <div class="stat-value text-primary font-black italic tracking-tighter text-5xl">99.9%</div>
            <div class="stat-desc font-bold opacity-30 mt-2">System Uptime</div>
          </div>
          
          <div class="stat place-items-center py-10 border-base-content/5">
            <div class="stat-title font-black uppercase tracking-widest text-[10px] opacity-40 mb-2">Accuracy</div>
            <div class="stat-value text-secondary font-black italic tracking-tighter text-5xl">v3.1</div>
            <div class="stat-desc font-bold opacity-30 mt-2">GliceForecast™ Core</div>
          </div>
          
          <div class="stat place-items-center py-10 border-base-content/5">
            <div class="stat-title font-black uppercase tracking-widest text-[10px] opacity-40 mb-2">Privacy</div>
            <div class="stat-value text-accent font-black italic tracking-tighter text-5xl">E2EE</div>
            <div class="stat-desc font-bold opacity-30 mt-2">Data Protection</div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section: Modern Accordion -->
    <section class="py-24 px-4 bg-base-200/50">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-5xl font-black uppercase tracking-tighter italic mb-4">{{ $t('landing.faq_title') }}</h2>
          <div class="w-20 h-1.5 bg-primary mx-auto rounded-full"></div>
        </div>

        <div class="space-y-4">
          <div v-for="i in 3" :key="i" class="collapse collapse-plus bg-base-100 shadow-md rounded-3xl border border-base-content/5 transition-all hover:border-primary/20">
            <input type="radio" name="my-accordion-3" :checked="i === 1" /> 
            <div class="collapse-title text-lg font-black uppercase tracking-tight italic p-6">
              {{ $t(`landing.faq_${i}_q`) }}
            </div>
            <div class="collapse-content px-6 pb-6"> 
              <p class="font-bold opacity-50 leading-relaxed">{{ $t(`landing.faq_${i}_a`) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer footer-center py-20 px-4 bg-base-300 text-base-content rounded-t-[60px] relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-50"></div>
      
      <div class="max-w-4xl mx-auto relative z-10">
        <div class="mb-12">
          <span class="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 block leading-relaxed px-12 max-w-2xl mx-auto">
            {{ $t('app.disclaimer') }}
          </span>
        </div>

        <div class="flex items-center justify-center gap-4 mb-10">
          <div class="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white text-xl shadow-2xl shadow-primary/20 hover:scale-110 transition-transform">
            <i class="fi fi-sr-chart-line-up"></i>
          </div>
          <span class="text-3xl font-black tracking-tighter uppercase italic">Glice<span class="text-primary">Chart</span></span>
        </div>

        <nav class="flex flex-wrap justify-center gap-8 mb-12">
          <router-link to="/legal" class="link link-hover text-[10px] font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 hover:text-primary transition-all underline decoration-primary/20 underline-offset-8">
            {{ $t('app.cookie_privacy') }}
          </router-link>
          <a href="#" class="link link-hover text-[10px] font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 hover:text-primary transition-all underline decoration-primary/20 underline-offset-8">
            Support
          </a>
          <a href="#" class="link link-hover text-[10px] font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 hover:text-primary transition-all underline decoration-primary/20 underline-offset-8">
            Github
          </a>
        </nav>

        <p class="text-[11px] font-black uppercase tracking-widest opacity-20 mb-2">
          {{ $t('landing.footer_tagline') }}
        </p>
        
        <div class="text-[10px] font-bold opacity-10 uppercase tracking-[0.4em]">
          © 2026 GliceChart Multiuser - Crafted with passion by Ghibiri
        </div>
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
.hero {
  background-image: radial-gradient(circle at 50% 50%, var(--tw-color-base-200) 0%, var(--tw-color-base-100) 100%);
}
</style>