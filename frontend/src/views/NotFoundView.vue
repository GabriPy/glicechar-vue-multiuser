<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="flex-1 min-h-[70vh] flex flex-col items-center justify-center p-4 relative overflow-hidden rounded-3xl">
    <!-- Background Decor (Subtle) -->
    <div class="absolute inset-0 opacity-10 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary rounded-full blur-[120px]"></div>
    </div>

    <div class="max-w-md w-full text-center relative z-10 space-y-6">
      <!-- 404 Header -->
      <div class="flex flex-col items-center gap-4">
        <div class="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-3xl text-primary shadow-inner animate-bounce">
          <i class="fi fi-sr-exclamation"></i>
        </div>
        <div class="text-[80px] font-black text-base-content/10 leading-none select-none italic tracking-tighter">404</div>
      </div>

      <!-- Text -->
      <div class="space-y-2">
        <h1 class="text-2xl font-black uppercase italic tracking-tight text-base-content">
          {{ $t('error.not_found_title') }}
        </h1>
        <p class="text-[10px] font-bold opacity-40 uppercase tracking-[0.2em] leading-relaxed">
          {{ $t('error.not_found_desc') }}
        </p>
      </div>

      <!-- Action -->
      <div class="pt-2">
        <button 
          @click="goHome"
          class="btn btn-primary btn-md font-black uppercase tracking-widest px-10 rounded-xl shadow-xl shadow-primary/20 group"
        >
          <i class="fi fi-sr-home transition-transform group-hover:-translate-y-1"></i>
          {{ $t('error.back_to_home') }}
        </button>
      </div>

      <!-- Version / Branding -->
      <div class="pt-6">
        <div class="flex items-center justify-center gap-1 opacity-20">
          <span class="text-[10px] font-black uppercase tracking-[0.3em]">Glice<span class="text-primary">Chart</span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-base-900 {
  background-color: #0f172a; /* Slate 900 */
}
</style>
