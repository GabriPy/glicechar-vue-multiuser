<template>
  <aside class="w-64 h-full bg-base-100 border-r border-base-content/5 flex flex-col z-[100] relative overflow-hidden">
    <!-- Decor Background -->
    <div class="absolute -top-20 -left-20 w-40 h-40 bg-primary/5 blur-3xl rounded-full pointer-events-none"></div>
    
    <!-- Logo -->
    <div class="p-8 mb-4 relative z-10">
      <div class="flex flex-col">
        <h1 class="text-2xl font-black uppercase tracking-tighter italic leading-none">Glice<span class="text-primary">Chart</span></h1>
        <div class="flex items-center gap-2 mt-1">
          <span class="px-1.5 py-0.5 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest rounded-md">Multiuser</span>
          <span class="text-[8px] font-black opacity-20 uppercase tracking-[0.2em]">{{ APP_VERSION_LABEL }}</span>
        </div>
      </div>
    </div>

    <!-- Navigazione -->
    <nav class="flex-1 px-4 space-y-2">
      <router-link 
        to="/" 
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group"
        :class="$route.path === '/' ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'hover:bg-base-300 opacity-60 hover:opacity-100'"
        @click="$emit('close-drawer')"
      >
        <i class="fi fi-sr-bolt text-sm"></i>
        <span class="text-[11px] font-black uppercase tracking-widest">{{ $t('nav.home') }}</span>
      </router-link>

      <router-link 
        to="/calendar" 
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group"
        :class="$route.path === '/calendar' ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'hover:bg-base-300 opacity-60 hover:opacity-100'"
        @click="$emit('close-drawer')"
      >
        <i class="fi fi-sr-calendar text-sm"></i>
        <span class="text-[11px] font-black uppercase tracking-widest">{{ $t('nav.calendar') }}</span>
      </router-link>

      <router-link 
        to="/prediction" 
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group"
        :class="$route.path === '/prediction' ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'hover:bg-base-300 opacity-60 hover:opacity-100'"
        @click="$emit('close-drawer')"
      >
        <i class="fi fi-sr-chart-line-up text-sm"></i>
        <span class="text-[11px] font-black uppercase tracking-widest">{{ $t('nav.prediction') }}</span>
      </router-link>

      <router-link 
        to="/patterns" 
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group"
        :class="$route.path === '/patterns' ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'hover:bg-base-300 opacity-60 hover:opacity-100'"
        @click="$emit('close-drawer')"
      >
        <i class="fi fi-sr-brain text-sm"></i>
        <span class="text-[11px] font-black uppercase tracking-widest">{{ $t('nav.patterns') }}</span>
      </router-link>

      <router-link 
        to="/comparison" 
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group"
        :class="$route.path === '/comparison' ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'hover:bg-base-300 opacity-60 hover:opacity-100'"
        @click="$emit('close-drawer')"
      >
        <i class="fi fi-sr-apps-sort text-sm"></i>
        <span class="text-[11px] font-black uppercase tracking-widest">{{ $t('nav.comparison') }}</span>
      </router-link>

      <router-link 
        to="/dietometer" 
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group"
        :class="$route.path === '/dietometer' ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'hover:bg-base-300 opacity-60 hover:opacity-100'"
        @click="$emit('close-drawer')"
      >
        <i class="fi fi-sr-wheat text-sm"></i>
        <span class="text-[11px] font-black uppercase tracking-widest">{{ $t('nav.dietometer') }}</span>
      </router-link>

      <router-link 
        to="/summary" 
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group"
        :class="$route.path === '/summary' ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'hover:bg-base-300 opacity-60 hover:opacity-100'"
        @click="$emit('close-drawer')"
      >
        <i class="fi fi-sr-document-signed text-sm"></i>
        <span class="text-[11px] font-black uppercase tracking-widest">{{ $t('nav.summary') }}</span>
      </router-link>

      <router-link 
        to="/settings" 
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group"
        :class="$route.path === '/settings' ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'hover:bg-base-300 opacity-60 hover:opacity-100'"
        @click="$emit('close-drawer')"
      >
        <i class="fi fi-sr-settings text-sm"></i>
        <span class="text-[11px] font-black uppercase tracking-widest">{{ $t('nav.settings') }}</span>
      </router-link>

      <router-link 
        to="/about" 
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group"
        :class="$route.path === '/about' ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'hover:bg-base-300 opacity-60 hover:opacity-100'"
        @click="$emit('close-drawer')"
      >
        <i class="fi fi-sr-info text-sm"></i>
        <span class="text-[11px] font-black uppercase tracking-widest">{{ $t('nav.about') }}</span>
      </router-link>

      <!-- Admin Section -->
      <div v-if="auth.isAdmin" class="pt-4 pb-2 border-t border-base-content/5">
        <div class="px-4 mb-2 text-[8px] font-black uppercase tracking-[0.3em] opacity-30">Admin</div>
        <router-link 
          to="/admin/users" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group"
          :class="$route.path === '/admin/users' ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'hover:bg-base-300 opacity-60 hover:opacity-100'"
          @click="$emit('close-drawer')"
        >
          <i class="fi fi-sr-users-gear text-sm"></i>
          <span class="text-[11px] font-black uppercase tracking-widest">{{ $t('nav.admin') }}</span>
        </router-link>
      </div>
    </nav>

    <!-- Language Selector & Footer -->
    <div class="p-6 mt-auto border-t border-base-content/5 space-y-4 relative z-10">
      <div class="flex items-center justify-around bg-base-200/50 p-1 rounded-xl border border-base-content/5">
        <button 
          @click="changeLang('it')" 
          class="btn btn-ghost btn-xs font-black uppercase tracking-widest text-[9px] flex-1 rounded-lg"
          :class="{ 'bg-primary text-primary-content shadow-sm': $i18n.locale === 'it', 'opacity-40': $i18n.locale !== 'it' }"
        >IT</button>
        <button 
          @click="changeLang('en')" 
          class="btn btn-ghost btn-xs font-black uppercase tracking-widest text-[9px] flex-1 rounded-lg"
          :class="{ 'bg-primary text-primary-content shadow-sm': $i18n.locale === 'en', 'opacity-40': $i18n.locale !== 'en' }"
        >EN</button>
      </div>

      <div v-if="auth.user" class="p-4 bg-base-200/50 rounded-2xl flex flex-col gap-3 border border-base-content/5">
        <div class="flex items-center gap-3">
          <div class="avatar avatar-placeholder">
            <div class="bg-primary/10 text-primary rounded-xl w-8 h-8 border border-primary/20">
              <span class="text-xs font-black uppercase">{{ auth.user.username.charAt(0) }}</span>
            </div>
          </div>
          <div class="flex flex-col overflow-hidden">
            <span class="text-[10px] font-black uppercase tracking-tight truncate leading-none">{{ auth.user.username }}</span>
            <span v-if="auth.user.isAdmin" class="text-[7px] font-black uppercase text-primary tracking-widest mt-1">Administrator</span>
            <span v-else class="text-[7px] font-black uppercase opacity-40 tracking-widest mt-1">Standard User</span>
          </div>
        </div>
        <button @click="handleLogout" class="btn btn-ghost btn-xs w-full font-black uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-error transition-all">
          <i class="fi fi-sr-exit mr-2 text-[10px]"></i>
          {{ $t('nav.logout') }}
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { APP_VERSION_LABEL } from '../appVersion'
import { useAuthStore } from '../stores/auth'
import { useI18n } from 'vue-i18n'

const $route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const { locale } = useI18n()

defineEmits(['close-drawer'])

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}

function changeLang(lang: string) {
  locale.value = lang
  localStorage.setItem('lang', lang)
}
</script>

<style scoped>
.router-link-active {
  /* Classi gestite dinamicamente nel template */
}
</style>
