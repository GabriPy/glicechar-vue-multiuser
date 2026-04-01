<template>
  <nav class="navbar bg-base-100/80 backdrop-blur-md fixed top-0 z-[100] px-4 md:px-12 border-b border-base-content/5">
    <div class="navbar-start">
      <router-link to="/" class="flex items-center gap-2 group">
        <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
          <i class="fi fi-sr-chart-line-up"></i>
        </div>
        <span class="text-xl font-black tracking-tighter uppercase italic">Glice<span class="text-primary">Chart</span></span>
      </router-link>
    </div>
    <div class="navbar-end gap-2">
      <!-- Menu Temi Dropdown -->
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-sm btn-circle hover:bg-base-200">
          <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block h-5 w-5 stroke-current" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
          </svg>
        </div>
        <ul tabindex="0" class="dropdown-content z-[110] menu p-2 shadow-2xl bg-base-300/90 backdrop-blur-xl rounded-box w-60 mt-4 max-h-[70vh] overflow-y-auto border border-white/10">
          <li v-for="t in themes" :key="t" class="mb-1 last:mb-0">
            <button class="flex items-center justify-between p-3 rounded-xl outline-none focus:outline-none transition-all duration-200 bg-base-100/50 hover:bg-base-200" :class="{ 'ring-2 ring-primary ring-offset-2 ring-offset-base-300': currentTheme === t }" @click="currentTheme = t" :data-theme="t">
              <div class="flex items-center gap-3">
                <div class="grid grid-cols-2 grid-rows-2 gap-0.5 rounded-md overflow-hidden shadow-sm">
                  <div class="bg-primary w-2.5 h-2.5"></div>
                  <div class="bg-secondary w-2.5 h-2.5"></div>
                  <div class="bg-accent w-2.5 h-2.5"></div>
                  <div class="bg-neutral w-2.5 h-2.5"></div>
                </div>
                <span class="text-[11px] font-black uppercase tracking-widest text-base-content">{{ t }}</span>
              </div>
              <div v-if="currentTheme === t" class="flex items-center justify-center bg-primary rounded-full p-0.5 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" class="w-3 h-3">
                  <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                </svg>
              </div>
            </button>
          </li>
        </ul>
      </div>

      <!-- Language Selector Dropdown -->
      <div class="dropdown dropdown-end mr-2">
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

      <router-link v-if="$route.path !== '/login'" to="/login" class="btn btn-ghost btn-sm font-black uppercase text-[10px] tracking-widest opacity-60 hover:opacity-100">
        {{ $t('landing.login') }}
      </router-link>
      <router-link v-if="$route.path !== '/register'" to="/register" class="btn btn-primary btn-sm font-black uppercase text-[10px] tracking-widest px-6 rounded-full shadow-lg shadow-primary/20">
        {{ $t('landing.get_started') }}
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { locale } = useI18n()
const $route = useRoute()

// Gestione Temi
const currentTheme = ref(localStorage.getItem('theme') || 'night')
const themes = [
  "light", "cupcake", "winter", "night", "dracula", "luxury"
]

watch(() => currentTheme.value, (newTheme) => {
  document.documentElement.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
})

onMounted(() => {
  document.documentElement.setAttribute('data-theme', currentTheme.value)
})

function changeLang(lang) {
  locale.value = lang
  localStorage.setItem('lang', lang)
}
</script>
