<template>
  <!-- Layout per utenti autenticati -->
  <CookieBanner />
  <div v-if="auth.isAuthenticated && !$route.meta.public" class="drawer lg:drawer-open min-h-screen bg-base-100 selection:bg-primary selection:text-white">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    
    <!-- Content -->
    <div class="drawer-content flex flex-col bg-base-100">
      <!-- Navbar per Mobile -->
      <div class="lg:hidden sticky top-0 z-30 flex h-16 w-full justify-center bg-base-100/80 backdrop-blur-md border-b border-base-content/5">
        <div class="flex-1">
          <label for="my-drawer" class="btn btn-ghost drawer-button lg:hidden">
            <i class="fi fi-sr-menu-burger"></i>
          </label>
        </div>
        <div class="flex-none flex items-center pr-4">
          <span class="text-lg font-black tracking-tighter uppercase italic">Glice<span class="text-primary">Chart</span></span>
        </div>
      </div>

      <main class="flex-1 p-4 md:p-8 lg:p-12 animate-fade-in">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>

        <!-- Footer / Legenda Globale -->
        <div class="footer footer-center p-10 bg-base-200/30 rounded-[3rem] mt-20 border border-base-content/5">
          <div class="max-w-2xl">
            <span class="text-[10px] font-black uppercase tracking-[0.2em] opacity-20 block leading-relaxed px-4 italic">
              {{ $t('app.disclaimer') }}
            </span>
          </div>

          <nav class="grid grid-flow-col gap-4 mt-4">
            <router-link to="/legal" class="link link-hover text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 hover:text-primary transition-all">
              {{ $t('app.cookie_privacy') }}
            </router-link>
            <router-link to="/support" class="link link-hover text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 hover:text-primary transition-all">
              {{ $t('app.support') }}
            </router-link>
          </nav>

          <div class="flex flex-col items-center gap-2">
            <div class="badge badge-outline badge-xs opacity-20 font-black uppercase tracking-widest px-4 py-2">
              GliceChart-multiuser {{ APP_VERSION_LABEL }}
            </div>
            <span class="text-[9px] font-black uppercase tracking-[0.3em] opacity-20 mt-2">Made with ❤️ by Ghibiri</span>
          </div>
        </div>
      </main>
    </div>

    <!-- Sidebar / Drawer Side -->
    <div class="drawer-side z-[100]">
      <label for="my-drawer" class="drawer-overlay"></label>
      <Sidebar @close-drawer="closeDrawer" />
    </div>
  </div>

  <!-- Layout per utenti non autenticati (Login/Register) -->
  <div v-else>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGlucoseStore } from './stores/glucose'
import { useAuthStore } from './stores/auth'
import Sidebar from './components/Sidebar.vue'
import CookieBanner from './components/CookieBanner.vue'
import { APP_VERSION_LABEL } from './appVersion'

const store = useGlucoseStore()
const auth = useAuthStore()
const router = useRouter()

const currentTheme = ref(localStorage.getItem('theme') || 'night')
const themes = [
  "light", "cupcake", "winter", "night", "dracula", "luxury"
]

watch(() => currentTheme.value, (newTheme) => {
  document.documentElement.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
})

onMounted(async () => {
  document.documentElement.setAttribute('data-theme', currentTheme.value)
  if (auth.isAuthenticated) {
    await auth.fetchMe()
    if (auth.isAuthenticated) {
      await store.fetchAll()
    }
  }
})

// Watcher per gestire login e logout
watch(() => auth.isAuthenticated, async (newVal) => {
  if (newVal) {
    await store.fetchAll()
  } else {
    // Se l'utente non è più autenticato, lo riportiamo al login
    router.push('/login')
  }
})

function closeDrawer() {
  const drawer = document.getElementById('my-drawer') as HTMLInputElement | null
  if (drawer) drawer.checked = false
}
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
