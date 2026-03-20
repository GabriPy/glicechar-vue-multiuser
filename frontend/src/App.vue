<template>
  <!-- Layout per utenti autenticati -->
  <div v-if="auth.isAuthenticated" class="drawer lg:drawer-open min-h-screen bg-base-100 selection:bg-primary selection:text-white">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />

    <div class="drawer-content flex flex-col min-w-0">

      <!-- Background Decor (subtle gradient/glow) -->
      <div class="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full"></div>
        <div class="absolute top-[40%] -right-[10%] w-[30%] h-[50%] bg-secondary/10 blur-[100px] rounded-full"></div>
      </div>

      <!-- Navbar -->
      <header
        class="navbar bg-base-100/80 backdrop-blur-md border-b border-base-content/5 px-4 md:px-12 sticky top-0 z-[90]">
        <div class="navbar-start flex items-center gap-3">
          <label for="my-drawer" class="btn btn-ghost btn-sm btn-circle lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </label>
          <span class="text-lg font-black tracking-tight uppercase lg:hidden">Glice<span
              class="text-primary">Chart-multiuser</span></span>
        </div>

        <div class="navbar-end gap-3 w-full justify-end">
          <!-- Status Indicator (Desktop only) -->
          <div
            class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-base-200 border border-base-content/5">
            <div class="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></div>
            <span class="text-[10px] font-black uppercase tracking-widest opacity-40">{{ $t('app.system_active') }}</span>
          </div>

          <div class="flex items-center gap-1">
            <!-- Sync manuale -->
            <button class="btn btn-ghost btn-sm btn-circle hover:bg-primary/10 hover:text-primary transition-all"
              :disabled="store.loading" @click="store.syncNow()" :title="$t('app.sync')">
              <svg class="w-4 h-4" :class="{ 'animate-spin': store.loading }" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            <!-- Menu Temi Dropdown -->
            <div class="dropdown dropdown-end">
              <div tabindex="0" role="button" class="btn btn-ghost btn-sm gap-2 normal-case hover:bg-base-200">
                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  class="inline-block h-5 w-5 stroke-current" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01">
                  </path>
                </svg>
                <span class="hidden md:inline font-bold text-xs uppercase tracking-widest opacity-60">{{ $t('app.theme') }}</span>
              </div>
              <ul tabindex="0"
                class="dropdown-content z-[110] menu p-2 shadow-2xl bg-base-300/90 backdrop-blur-xl rounded-box w-60 mt-4 max-h-[70vh] overflow-y-auto border border-white/10">
                <li v-for="t in themes" :key="t" class="mb-1 last:mb-0">
                  <button
                    class="flex items-center justify-between p-3 rounded-xl outline-none focus:outline-none transition-all duration-200 bg-base-100/50 hover:bg-base-200"
                    :class="{ 'ring-2 ring-primary ring-offset-2 ring-offset-base-300': currentTheme === t }"
                    @click="currentTheme = t" :data-theme="t">
                    <div class="flex items-center gap-3">
                      <div class="grid grid-cols-2 grid-rows-2 gap-0.5 rounded-md overflow-hidden shadow-sm">
                        <div class="bg-primary w-2.5 h-2.5"></div>
                        <div class="bg-secondary w-2.5 h-2.5"></div>
                        <div class="bg-accent w-2.5 h-2.5"></div>
                        <div class="bg-neutral w-2.5 h-2.5"></div>
                      </div>
                      <span class="text-[11px] font-black uppercase tracking-widest text-base-content">{{ t }}</span>
                    </div>
                    <div v-if="currentTheme === t"
                      class="flex items-center justify-center bg-primary rounded-full p-0.5 shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" class="w-3 h-3">
                        <path fill-rule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clip-rule="evenodd" />
                      </svg>
                    </div>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="flex-1 max-w-6xl mx-auto w-full p-4 md:p-6 space-y-4 relative">

        <!-- Alert errore -->
        <div v-if="store.error"
          class="alert alert-error shadow-sm border border-error/20 text-[10px] font-black uppercase tracking-wider py-2 px-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-3 w-3" fill="none"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ store.error }}</span>
          <button class="btn btn-xs btn-circle btn-ghost" @click="store.error = null">✕</button>
        </div>

        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>

        <!-- Footer / Legenda Globale -->
        <div class="flex flex-col items-center gap-2 pt-2 border-t border-base-content/5 mt-4">
          <div class="flex flex-wrap justify-center gap-x-6 gap-y-1">
            <div class="flex items-center gap-2">
              <span class="text-[9px] font-black uppercase tracking-widest opacity-30 text-center px-4">{{ $t('app.disclaimer') }}</span>
            </div>
          </div>
          <div class="text-[8px] font-bold opacity-20 uppercase tracking-[0.3em]">
            GliceChart-multiuser {{ APP_VERSION_LABEL }}
          </div>
          <span class="text-[9px] font-black uppercase tracking-widest opacity-30">Made with ❤️ by Ghibiri</span>
        </div>
      </main>
    </div>

    <!-- Drawer Side (Sidebar) -->
    <div class="drawer-side z-[200]">
      <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
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
import { useGlucoseStore } from './stores/glucose'
import { useAuthStore } from './stores/auth'
import Sidebar from './components/Sidebar.vue'
import { APP_VERSION_LABEL } from './appVersion'

const store = useGlucoseStore()
const auth = useAuthStore()

const currentTheme = ref(localStorage.getItem('theme') || 'night')
const themes = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter", "dim", "nord", "sunset",
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

// Watcher per ricaricare i dati quando l'utente effettua il login
watch(() => auth.isAuthenticated, async (newVal) => {
  if (newVal) {
    await store.fetchAll()
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
