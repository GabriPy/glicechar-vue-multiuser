<template>
  <nav class="navbar bg-base-100/80 backdrop-blur-md border-b border-base-content/5 px-4 md:px-12 sticky top-0 z-50">
    <div class="navbar-start">
      <router-link to="/" class="flex items-center gap-3 group">
        <div class="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white text-lg shadow-xl shadow-primary/20 group-hover:scale-110 transition-all duration-500 rotate-3 group-hover:rotate-0">
          <i class="fi fi-sr-chart-line-up"></i>
        </div>
        <span class="text-2xl font-black tracking-tighter uppercase italic">Glice<span class="text-primary">Chart</span></span>
      </router-link>
    </div>

    <div class="navbar-end gap-2">
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

      <router-link to="/login" class="btn btn-ghost btn-sm rounded-xl px-6 font-black uppercase tracking-widest text-[10px] hidden sm:flex border border-base-content/5 hover:border-primary/30">
        {{ $t('landing.login') }}
      </router-link>
      <router-link to="/register" class="btn btn-primary btn-sm rounded-xl px-6 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 border-none">
        {{ $t('landing.get_started') }}
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

function changeLang(lang: string) {
  locale.value = lang
  localStorage.setItem('lang', lang)
}
</script>
