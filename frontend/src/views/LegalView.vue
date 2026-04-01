<template>
  <div class="min-h-screen bg-base-100 flex flex-col">
    <!-- Simple Navbar -->
    <nav class="navbar bg-base-100/80 backdrop-blur-md border-b border-base-content/5 px-4 md:px-12 sticky top-0 z-50">
      <div class="navbar-start">
        <router-link to="/" class="flex items-center gap-2 group">
          <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <i class="fi fi-sr-chart-line-up"></i>
          </div>
          <span class="text-xl font-black tracking-tighter uppercase italic">Glice<span class="text-primary">Chart</span></span>
        </router-link>
      </div>
      <div class="navbar-end gap-3">
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

        <router-link to="/" class="btn btn-ghost btn-sm font-black uppercase tracking-widest text-[10px]">
          {{ $t('error.back_to_home') }}
        </router-link>
      </div>
    </nav>

    <main class="flex-1 max-w-4xl mx-auto w-full p-6 md:p-12 space-y-12">
      <!-- Privacy Policy -->
      <section id="privacy" class="space-y-6">
        <div class="flex items-center gap-3">
          <div class="w-2 h-8 bg-primary rounded-full"></div>
          <h1 class="text-3xl font-black uppercase tracking-tighter italic">{{ $t('legal_page.privacy_title') }}</h1>
        </div>
        
        <div class="prose prose-sm max-w-none text-base-content/70 leading-relaxed font-bold">
          <p>{{ $t('legal_page.privacy_intro') }}</p>
          
          <h3 class="text-base-content font-black uppercase tracking-tight mt-8">{{ $t('legal_page.titolare_title') }}</h3>
          <p v-html="$t('legal_page.titolare_desc')"></p>

          <h3 class="text-base-content font-black uppercase tracking-tight mt-8">{{ $t('legal_page.dati_title') }}</h3>
          <p>{{ $t('legal_page.dati_intro') }}</p>
          <ul class="list-disc pl-5 space-y-2">
            <li>{{ $t('legal_page.dati_item_1') }}</li>
            <li>{{ $t('legal_page.dati_item_2') }}</li>
            <li>{{ $t('legal_page.dati_item_3') }}</li>
            <li>{{ $t('legal_page.dati_item_4') }}</li>
          </ul>

          <h3 class="text-base-content font-black uppercase tracking-tight mt-8">{{ $t('legal_page.finalita_title') }}</h3>
          <p v-html="$t('legal_page.finalita_desc')"></p>

          <h3 class="text-base-content font-black uppercase tracking-tight mt-8">{{ $t('legal_page.conservazione_title') }}</h3>
          <p>{{ $t('legal_page.conservazione_desc') }}</p>

          <h3 class="text-base-content font-black uppercase tracking-tight mt-8">{{ $t('legal_page.sicurezza_title') }}</h3>
          <p>{{ $t('legal_page.sicurezza_desc') }}</p>
        </div>
      </section>

      <div class="divider opacity-10"></div>

      <!-- Cookie Policy -->
      <section id="cookies" class="space-y-6">
        <div class="flex items-center gap-3">
          <div class="w-2 h-8 bg-secondary rounded-full"></div>
          <h1 class="text-3xl font-black uppercase tracking-tighter italic">{{ $t('legal_page.cookies_title') }}</h1>
        </div>

        <div class="prose prose-sm max-w-none text-base-content/70 leading-relaxed font-bold">
          <p>{{ $t('legal_page.cookies_intro') }}</p>

          <h3 class="text-base-content font-black uppercase tracking-tight mt-8">{{ $t('legal_page.cookies_tecnici_title') }}</h3>
          <p v-html="$t('legal_page.cookies_tecnici_desc')"></p>
          <ul class="list-disc pl-5 space-y-2">
            <li v-html="$t('legal_page.cookies_item_1')"></li>
            <li v-html="$t('legal_page.cookies_item_2')"></li>
          </ul>

          <h3 class="text-base-content font-black uppercase tracking-tight mt-8">{{ $t('legal_page.cookies_third_party_title') }}</h3>
          <p v-html="$t('legal_page.cookies_third_party_desc')"></p>
          
          <h3 class="text-base-content font-black uppercase tracking-tight mt-8">{{ $t('legal_page.cookies_consent_title') }}</h3>
          <p>{{ $t('legal_page.cookies_consent_desc') }}</p>
        </div>
      </section>
    </main>

    <footer class="py-16 px-4 border-t border-base-content/5 text-center bg-base-200/50">
      <!-- Brand row -->
      <div class="flex items-center justify-center gap-3 mb-6">
        <div class="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white text-sm shadow-lg shadow-primary/20">
          <i class="fi fi-sr-chart-line-up"></i>
        </div>
        <span class="text-xl font-black tracking-tighter uppercase italic">Glice<span class="text-primary">Chart</span></span>
      </div>

      <!-- Legal Links -->
      <div class="flex items-center justify-center gap-6 mb-6">
        <router-link to="/legal" class="text-[9px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity hover:text-primary underline decoration-primary/20 underline-offset-4">
          {{ $t('app.cookie_privacy') }}
        </router-link>
      </div>

      <p class="text-[10px] font-black uppercase tracking-widest opacity-30">
        © 2026 GliceChart Project - Developed by Ghibiri
      </p>
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
.prose h3 {
  margin-bottom: 0.5rem;
}
</style>
