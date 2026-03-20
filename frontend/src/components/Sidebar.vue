<template>
  <aside class="w-64 h-full bg-base-200 border-r border-base-content/5 flex flex-col z-[100]">
    <!-- Logo -->
    <div class="p-6 mb-4">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-primary/10 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-primary">
            <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v9.375c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v4.875c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 18v-4.875Z" />
          </svg>
        </div>
        <span class="text-lg font-black tracking-tight uppercase italic">Glice<span class="text-primary">Chart-multiuser</span></span>
      </div>
      <div class="mt-1 text-[8px] font-black opacity-20 uppercase tracking-[0.2em]">Dashboard {{ APP_VERSION_LABEL }}</div>
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
    <div class="p-4 mt-auto border-t border-base-content/5 space-y-4">
      <div class="flex items-center justify-around bg-base-300/30 p-2 rounded-xl">
        <button 
          @click="changeLang('it')" 
          class="btn btn-ghost btn-xs font-black"
          :class="{ 'text-primary underline': $i18n.locale === 'it' }"
        >IT</button>
        <button 
          @click="changeLang('en')" 
          class="btn btn-ghost btn-xs font-black"
          :class="{ 'text-primary underline': $i18n.locale === 'en' }"
        >EN</button>
      </div>

      <div v-if="auth.user" class="p-4 bg-base-300/50 rounded-2xl flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <div class="avatar avatar-placeholder">
            <div class="bg-primary text-primary-content rounded-xl w-8 h-8">
              <span class="text-xs font-black uppercase">{{ auth.user.username.charAt(0) }}</span>
            </div>
          </div>
          <div class="flex flex-col overflow-hidden">
            <span class="text-[10px] font-black uppercase tracking-tight truncate">{{ auth.user.username }}</span>
            <span v-if="auth.user.isAdmin" class="text-[7px] font-black uppercase text-primary tracking-widest">Administrator</span>
            <span v-else class="text-[7px] font-black uppercase opacity-40 tracking-widest">User</span>
          </div>
        </div>
        <button @click="handleLogout" class="btn btn-ghost btn-xs w-full font-black uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-error">
          <i class="fi fi-sr-exit mr-2"></i>
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

function handleLogout() {
  auth.logout()
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
