<template>
  <div class="min-h-screen bg-base-100 flex flex-col font-sans selection:bg-primary selection:text-white">
    <PublicNavbar />

    <main class="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
      <!-- Background Decor -->
      <div class="absolute inset-0 z-0 pointer-events-none">
        <div class="absolute top-1/4 -left-24 w-96 h-96 bg-primary/10 blur-[120px] rounded-full"></div>
        <div class="absolute bottom-1/4 -right-24 w-80 h-80 bg-secondary/10 blur-[100px] rounded-full"></div>
      </div>

      <div class="max-w-xl w-full relative z-10 animate-fade-in">
        <!-- Success State -->
        <div v-if="submitted" class="card bg-base-200/50 backdrop-blur-xl border border-primary/20 rounded-[3rem] p-12 text-center shadow-2xl">
          <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-4xl mx-auto mb-8 animate-bounce">
            <i class="fi fi-sr-check-circle"></i>
          </div>
          <h2 class="text-3xl font-black uppercase tracking-tighter italic mb-4">{{ $t('support.success_title') }}</h2>
          <p class="font-bold opacity-50 mb-10 leading-relaxed">{{ $t('support.success_desc') }}</p>
          <router-link to="/" class="btn btn-primary rounded-2xl px-12 font-black uppercase tracking-widest text-xs border-none">
            {{ $t('error.back_to_home') }}
          </router-link>
        </div>

        <!-- Form State -->
        <div v-else class="card bg-base-300/50 backdrop-blur-2xl border border-white/5 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden">
          <div class="card-body p-8 md:p-12">
            <div class="text-center mb-10 space-y-2">
              <span class="badge badge-primary badge-outline font-black uppercase tracking-[0.3em] px-4 py-3">{{ $t('app.support') }}</span>
              <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tighter italic">{{ $t('support.subtitle') }}</h1>
              <p class="text-sm font-bold opacity-40 leading-relaxed max-w-xs mx-auto">
                {{ $t('support.desc') }}
              </p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Email -->
              <div class="form-control">
                <label class="label px-4 mb-1">
                  <span class="label-text text-[10px] font-black uppercase tracking-widest opacity-40">{{ $t('support.email') }}</span>
                </label>
                <input 
                  v-model="form.email"
                  type="email" 
                  required
                  class="input bg-base-100/50 border-base-content/5 focus:border-primary/30 rounded-2xl h-14 px-6 font-bold"
                  placeholder="gabriele@example.it"
                />
              </div>

              <!-- Subject -->
              <div class="form-control">
                <label class="label px-4 mb-1">
                  <span class="label-text text-[10px] font-black uppercase tracking-widest opacity-40">{{ $t('support.subject') }}</span>
                </label>
                <input 
                  v-model="form.subject"
                  type="text" 
                  required
                  minlength="3"
                  class="input bg-base-100/50 border-base-content/5 focus:border-primary/30 rounded-2xl h-14 px-6 font-bold"
                  placeholder="Assistenza tecnica / Account"
                />
              </div>

              <!-- Message -->
              <div class="form-control">
                <label class="label px-4 mb-1">
                  <span class="label-text text-[10px] font-black uppercase tracking-widest opacity-40">{{ $t('support.message') }}</span>
                </label>
                <textarea 
                  v-model="form.message"
                  required
                  minlength="10"
                  class="textarea bg-base-100/50 border-base-content/5 focus:border-primary/30 rounded-3xl h-32 px-6 py-4 font-bold leading-relaxed"
                  placeholder="Scrivi qui la tua richiesta..."
                ></textarea>
              </div>

              <!-- Error Alert -->
              <div v-if="error" class="alert alert-error bg-error/10 border-error/20 text-error rounded-2xl flex items-center gap-3">
                <i class="fi fi-sr-exclamation"></i>
                <span class="text-xs font-black uppercase tracking-widest">{{ error }}</span>
              </div>

              <!-- Submit -->
              <button 
                type="submit" 
                class="btn btn-primary btn-lg w-full rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/30 border-none mt-4 group"
                :disabled="loading"
              >
                <span v-if="loading" class="loading loading-spinner"></span>
                <template v-else>
                  {{ $t('support.send') }}
                  <i class="fi fi-sr-paper-plane ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                </template>
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>

    <footer class="footer footer-center py-12 px-4 bg-base-300/50 backdrop-blur-md rounded-t-[40px]">
      <div class="text-[9px] font-bold opacity-20 uppercase tracking-[0.4em]">
        © 2026 GliceChart Support System - Developed by Ghibiri
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import axios from 'axios'
import PublicNavbar from '../components/PublicNavbar.vue'

const loading = ref(false)
const submitted = ref(false)
const error = ref('')

const form = reactive({
  email: '',
  subject: '',
  message: ''
})

async function handleSubmit() {
  loading.value = true
  error.value = ''
  
  try {
    await axios.post('/api/support', form)
    submitted.value = true
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Errore durante l\'invio della richiesta'
  } finally {
    loading.value = false
  }
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
</style>
