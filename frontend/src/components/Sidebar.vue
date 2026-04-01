<template>
  <aside class="flex flex-col h-full bg-base-200/50 backdrop-blur-xl border-r border-base-content/5 relative overflow-hidden group/sidebar">
    <!-- Background Decor -->
    <div class="absolute inset-0 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-1000 pointer-events-none">
      <div class="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 blur-[80px] rounded-full"></div>
    </div>

    <!-- Header / Logo -->
    <div class="p-8 mb-4 relative z-10">
      <router-link to="/dashboard" class="flex items-center gap-3 group/logo">
        <div class="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white text-lg shadow-xl shadow-primary/20 group-hover/logo:scale-110 transition-all duration-500 rotate-3 group-hover/logo:rotate-0">
          <i class="fi fi-sr-chart-line-up"></i>
        </div>
        <div class="flex flex-col">
          <span class="text-xl font-black tracking-tighter uppercase italic leading-none">Glice<span class="text-primary">Chart</span></span>
          <span class="text-[8px] font-black uppercase tracking-[0.4em] opacity-30 mt-1 ml-0.5">v1.4.4</span>
        </div>
      </router-link>
    </div>

    <!-- Navigation Menu: DaisyUI 5 Menu -->
    <nav class="flex-1 px-4 overflow-y-auto custom-scrollbar relative z-10">
      <ul class="menu menu-md w-full p-0 gap-1">
        <!-- Dashboard -->
        <li>
          <router-link to="/dashboard" class="flex items-center gap-4 py-4 px-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 hover:bg-primary/10 hover:text-primary group" :class="{ 'bg-primary text-primary-content shadow-lg shadow-primary/20 hover:bg-primary hover:text-primary-content': $route.path === '/dashboard' }">
            <i class="fi fi-sr-apps text-lg opacity-40 group-hover:opacity-100 transition-opacity" :class="{ 'opacity-100': $route.path === '/dashboard' }"></i>
            {{ $t('nav.home') }}
          </router-link>
        </li>

        <div class="divider opacity-5 my-4 px-4 font-black text-[9px] uppercase tracking-[0.3em]">{{ $t('nav.history_section') }}</div>

        <!-- History Items -->
        <li v-for="item in navItems" :key="item.path">
          <router-link :to="item.path" class="flex items-center gap-4 py-4 px-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 hover:bg-base-content/5 group" :class="{ 'bg-base-content text-base-100 shadow-xl': $route.path === item.path }">
            <i :class="[item.icon, { 'opacity-100': $route.path === item.path, 'opacity-40 group-hover:opacity-100': $route.path !== item.path }]" class="text-lg transition-opacity"></i>
            {{ $t(`nav.${item.key}`) }}
          </router-link>
        </li>

        <div class="divider opacity-5 my-4 px-4 font-black text-[9px] uppercase tracking-[0.3em]">{{ $t('nav.ai_section') }}</div>

        <!-- AI Tools -->
        <li v-for="item in aiItems" :key="item.path">
          <router-link :to="item.path" class="flex items-center gap-4 py-4 px-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 hover:bg-base-content/5 group" :class="{ 'bg-base-content text-base-100 shadow-xl': $route.path === item.path }">
            <i :class="[item.icon, { 'opacity-100': $route.path === item.path, 'opacity-40 group-hover:opacity-100': $route.path !== item.path }]" class="text-lg transition-opacity"></i>
            {{ $t(`nav.${item.key}`) }}
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Admin Section -->
    <div v-if="auth.isAdmin" class="px-4 mb-4 relative z-10 space-y-1">
      <router-link to="/admin" class="flex items-center gap-4 py-4 px-5 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-secondary/10 text-secondary hover:bg-secondary hover:text-secondary-content transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-secondary/20 group" :class="{ 'bg-secondary text-secondary-content': $route.path === '/admin' }">
        <i class="fi fi-sr-settings-sliders text-lg opacity-60 group-hover:opacity-100 transition-opacity" :class="{ 'opacity-100': $route.path === '/admin' }"></i>
        {{ $t('nav.admin') }}
      </router-link>
      <router-link to="/admin/support" class="flex items-center gap-4 py-4 px-5 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-accent/10 text-accent hover:bg-accent hover:text-accent-content transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-accent/20 group" :class="{ 'bg-accent text-accent-content': $route.path === '/admin/support' }">
        <i class="fi fi-sr-envelope-dot text-lg opacity-60 group-hover:opacity-100 transition-opacity" :class="{ 'opacity-100': $route.path === '/admin/support' }"></i>
        {{ $t('support.admin_title') }}
      </router-link>
    </div>

    <!-- Bottom Actions: DaisyUI 5 List / Menu -->
    <div class="p-4 bg-base-300/30 border-t border-base-content/5 relative z-10 space-y-2">
      <!-- Settings -->
      <router-link to="/settings" class="flex items-center gap-4 py-3 px-5 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-base-content/5 transition-all group" :class="{ 'bg-base-content/10': $route.path === '/settings' }">
        <i class="fi fi-sr-settings text-md opacity-40 group-hover:opacity-100 transition-opacity"></i>
        {{ $t('nav.settings') }}
      </router-link>

      <!-- Language Selector Dropdown -->
      <div class="dropdown dropdown-top w-full">
        <div tabindex="0" role="button" class="btn btn-ghost btn-sm w-full flex items-center justify-between px-4 rounded-xl border border-base-content/5 hover:bg-base-200">
          <div class="flex items-center gap-3">
            <span :class="`flag-icon flag-icon-${locale === 'it' ? 'it' : 'gb'} rounded-sm`" style="width: 1.2rem; height: 0.9rem;"></span>
            <span class="text-[10px] font-black uppercase tracking-widest opacity-60">{{ locale.toUpperCase() }}</span>
          </div>
          <i class="fi fi-sr-angle-small-up opacity-40"></i>
        </div>
        <ul tabindex="0" class="dropdown-content z-[110] menu p-2 shadow-2xl bg-base-300/90 backdrop-blur-xl rounded-box w-full mb-2 border border-white/10">
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

      <!-- Logout -->
      <button @click="handleLogout" class="flex items-center gap-4 py-3 px-5 rounded-xl font-black uppercase tracking-widest text-[9px] text-error hover:bg-error/10 transition-all w-full group">
        <i class="fi fi-sr-exit text-md opacity-60 group-hover:opacity-100 transition-opacity"></i>
        {{ $t('nav.logout') }}
      </button>

      <!-- Footer Info -->
      <div class="flex flex-col items-center gap-2 pt-4 opacity-20">
        <div class="text-[7px] font-black uppercase tracking-[0.4em]">GliceChart Multiuser</div>
        <div class="text-[7px] font-black uppercase tracking-[0.2em] italic">Made with ❤️ by Ghibiri</div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const auth = useAuthStore()
const router = useRouter()
const { locale } = useI18n()

const navItems = [
  { path: '/calendar', key: 'calendar', icon: 'fi fi-sr-calendar' },
  { path: '/summary', key: 'summary', icon: 'fi fi-sr-document-signed' },
  { path: '/comparison', key: 'comparison', icon: 'fi fi-sr-stats' }
]

const aiItems = [
  { path: '/dietometer', key: 'dietometer', icon: 'fi fi-sr-wheat' },
  { path: '/patterns', key: 'patterns', icon: 'fi fi-sr-brain' }
]

function changeLang(lang: string) {
  locale.value = lang
  localStorage.setItem('lang', lang)
}

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(var(--tw-color-primary), 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--tw-color-primary), 0.2);
}
</style>
