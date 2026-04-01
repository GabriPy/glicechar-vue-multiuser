<template>
  <div class="min-h-screen bg-base-100 flex flex-col font-sans selection:bg-primary selection:text-white">
    <!-- Navbar: DaisyUI 5 Modern Navbar -->
    <nav class="navbar bg-base-100/80 backdrop-blur-md border-b border-base-content/5 px-4 md:px-12 sticky top-0 z-50">
      <div class="navbar-start">
        <router-link to="/" class="flex items-center gap-3 group">
          <div class="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white text-lg shadow-xl shadow-primary/20 group-hover:scale-110 transition-all duration-500 rotate-3 group-hover:rotate-0">
            <i class="fi fi-sr-chart-line-up"></i>
          </div>
          <span class="text-2xl font-black tracking-tighter uppercase italic">Glice<span class="text-primary">Chart</span></span>
        </router-link>
      </div>

      <div class="navbar-end gap-4">
        <!-- Language Selector Dropdown -->
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-sm gap-2 normal-case hover:bg-base-200 rounded-xl px-3 border border-base-content/5 flex items-center">
            <span :class="`flag-icon flag-icon-${locale === 'it' ? 'it' : 'gb'} rounded-sm`" style="width: 1.2rem; height: 0.9rem;"></span>
            <span class="font-black text-[10px] uppercase tracking-widest opacity-60">{{ locale.toUpperCase() }}</span>
          </div>
          <ul tabindex="0" class="dropdown-content z-[110] menu p-2 shadow-2xl bg-base-300/90 backdrop-blur-xl rounded-box w-32 mt-4 border border-white/10">
            <li class="mb-1">
              <button @click="changeLang('it')" class="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-base-100/50" :class="{ 'bg-primary/20 text-primary': locale === 'it' }">
                <span class="flag-icon flag-icon-it rounded-sm"></span>
                <span class="text-[10px] font-black uppercase tracking-widest">IT</span>
              </button>
            </li>
            <li>
              <button @click="changeLang('en')" class="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-base-100/50" :class="{ 'bg-primary/20 text-primary': locale === 'en' }">
                <span class="flag-icon flag-icon-gb rounded-sm"></span>
                <span class="text-[10px] font-black uppercase tracking-widest">EN</span>
              </button>
            </li>
          </ul>
        </div>

        <router-link to="/" class="btn btn-ghost btn-sm font-black uppercase tracking-widest text-[10px] rounded-xl px-6 border border-base-content/5 hover:border-primary/30 transition-all">
          {{ $t('error.back_to_home') }}
        </router-link>
      </div>
    </nav>

    <main class="flex-1 max-w-4xl mx-auto w-full p-6 md:p-12 space-y-16">
      <!-- Privacy Policy Section with DaisyUI 5 Typography/Cards -->
      <section id="privacy" class="space-y-8 animate-fade-in">
        <div class="flex flex-col items-start gap-4">
          <span class="badge badge-primary badge-outline font-black uppercase tracking-[0.3em] px-4 py-3">Legal</span>
          <h1 class="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">{{ $t('legal_page.privacy_title') }}</h1>
          <div class="w-24 h-1.5 bg-primary rounded-full"></div>
        </div>
        
        <div class="prose prose-md max-w-none text-base-content/70 leading-relaxed font-medium">
          <p class="text-lg opacity-100 font-bold">{{ $t('legal_page.privacy_intro') }}</p>
          
          <div class="grid grid-cols-1 gap-12 mt-12">
            <div class="space-y-4">
              <h3 class="text-2xl font-black uppercase tracking-tight text-base-content italic">{{ $t('legal_page.titolare_title') }}</h3>
              <div class="p-6 bg-base-200/50 rounded-3xl border border-base-content/5">
                <p v-html="$t('legal_page.titolare_desc')"></p>
              </div>
            </div>

            <div class="space-y-4">
              <h3 class="text-2xl font-black uppercase tracking-tight text-base-content italic">{{ $t('legal_page.dati_title') }}</h3>
              <p class="opacity-80">{{ $t('legal_page.dati_intro') }}</p>
              <ul class="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0 mt-4">
                <li v-for="i in 4" :key="i" class="p-5 bg-base-200/50 rounded-2xl border border-base-content/5 flex items-start gap-4 group hover:border-primary/20 transition-all">
                  <div class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0 text-xs">
                    <i class="fi fi-sr-check-circle"></i>
                  </div>
                  <span class="text-sm font-bold opacity-70">{{ $t(`legal_page.dati_item_${i}`) }}</span>
                </li>
              </ul>
            </div>

            <div class="space-y-4">
              <h3 class="text-2xl font-black uppercase tracking-tight text-base-content italic">{{ $t('legal_page.finalita_title') }}</h3>
              <div class="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 relative overflow-hidden group">
                <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
                <p class="relative z-10" v-html="$t('legal_page.finalita_desc')"></p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-4">
                <h3 class="text-xl font-black uppercase tracking-tight text-base-content italic">{{ $t('legal_page.conservazione_title') }}</h3>
                <p class="text-sm opacity-70 leading-relaxed">{{ $t('legal_page.conservazione_desc') }}</p>
              </div>
              <div class="space-y-4">
                <h3 class="text-xl font-black uppercase tracking-tight text-base-content italic">{{ $t('legal_page.sicurezza_title') }}</h3>
                <p class="text-sm opacity-70 leading-relaxed">{{ $t('legal_page.sicurezza_desc') }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="divider opacity-5"></div>

      <!-- Cookie Policy Section -->
      <section id="cookies" class="space-y-8 animate-fade-in">
        <div class="flex flex-col items-start gap-4">
          <span class="badge badge-secondary badge-outline font-black uppercase tracking-[0.3em] px-4 py-3">Cookies</span>
          <h2 class="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">{{ $t('legal_page.cookies_title') }}</h2>
          <div class="w-20 h-1.5 bg-secondary rounded-full"></div>
        </div>

        <div class="prose prose-md max-w-none text-base-content/70 leading-relaxed font-medium">
          <p class="text-lg opacity-100 font-bold mb-8">{{ $t('legal_page.cookies_intro') }}</p>

          <div class="card bg-base-300/50 backdrop-blur-xl border border-white/5 rounded-[3rem] overflow-hidden">
            <div class="card-body p-8 md:p-12">
              <h3 class="card-title text-2xl font-black uppercase tracking-tight text-secondary italic mb-6">{{ $t('legal_page.cookies_tecnici_title') }}</h3>
              <p class="mb-8" v-html="$t('legal_page.cookies_tecnici_desc')"></p>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="p-6 bg-base-100/50 rounded-2xl border border-base-content/5 group hover:border-secondary/30 transition-all">
                  <div class="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary mb-4">
                    <i class="fi fi-sr-lock"></i>
                  </div>
                  <p class="text-sm leading-relaxed" v-html="$t('legal_page.cookies_item_1')"></p>
                </div>
                <div class="p-6 bg-base-100/50 rounded-2xl border border-base-content/5 group hover:border-secondary/30 transition-all">
                  <div class="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary mb-4">
                    <i class="fi fi-sr-palette"></i>
                  </div>
                  <p class="text-sm leading-relaxed" v-html="$t('legal_page.cookies_item_2')"></p>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
            <div class="space-y-4">
              <h3 class="text-xl font-black uppercase tracking-tight text-base-content italic">{{ $t('legal_page.cookies_third_party_title') }}</h3>
              <p class="text-sm opacity-70 leading-relaxed" v-html="$t('legal_page.cookies_third_party_desc')"></p>
            </div>
            <div class="space-y-4">
              <h3 class="text-xl font-black uppercase tracking-tight text-base-content italic">{{ $t('legal_page.cookies_consent_title') }}</h3>
              <p class="text-sm opacity-70 leading-relaxed">{{ $t('legal_page.cookies_consent_desc') }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer: DaisyUI 5 Modern Footer -->
    <footer class="footer footer-center py-20 px-4 bg-base-300 text-base-content rounded-t-[60px] mt-24">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-center gap-4 mb-8">
          <div class="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white text-xl shadow-2xl shadow-primary/20">
            <i class="fi fi-sr-chart-line-up"></i>
          </div>
          <span class="text-3xl font-black tracking-tighter uppercase italic">Glice<span class="text-primary">Chart</span></span>
        </div>

        <nav class="flex flex-wrap justify-center gap-8 mb-10">
          <router-link to="/legal" class="link link-hover text-[10px] font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 hover:text-primary transition-all">
            {{ $t('app.cookie_privacy') }}
          </router-link>
        </nav>

        <p class="text-[11px] font-black uppercase tracking-widest opacity-20 mb-2">
          Il Futuro del Monitoraggio Glicemico
        </p>
        
        <div class="text-[10px] font-bold opacity-10 uppercase tracking-[0.4em]">
          © 2026 GliceChart Project - Developed by Ghibiri
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

function changeLang(lang: string) {
  locale.value = lang
  localStorage.setItem('lang', lang)
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.prose h3 {
  margin-top: 0;
}
</style>
