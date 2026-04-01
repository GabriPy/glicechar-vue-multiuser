<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import PublicNavbar from '../components/PublicNavbar.vue';

const auth = useAuthStore();
const email = ref('');
const success = ref(false);
const error = ref<string | null>(null);
const loading = ref(false);

async function handleReset() {
  if (!email.value) {
    error.value = 'Inserisci la tua email';
    return;
  }
  loading.value = true;
  error.value = null;
  success.value = false;
  
  const res = await auth.forgotPassword(email.value);
  if (res) {
    success.value = true;
  } else {
    error.value = auth.error;
  }
  loading.value = false;
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-base-200 relative overflow-hidden">
    <PublicNavbar />
    
    <div class="flex-1 flex items-center justify-center px-4">
      <!-- Background Decor -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
      <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full"></div>
      <div class="absolute top-[40%] -right-[10%] w-[30%] h-[50%] bg-secondary/10 blur-[100px] rounded-full"></div>
    </div>

    <div class="max-w-md w-full space-y-8 bg-base-100 p-8 rounded-2xl shadow-xl relative z-10 border border-base-content/5">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-black uppercase tracking-tight text-primary italic">Glice<span class="text-base-content">Chart</span></h2>
        <p class="mt-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{{ $t('forgot_password.title') }}</p>
      </div>
      
      <div class="mt-8 space-y-6">
        <div v-if="!success">
          <p class="text-[11px] font-bold opacity-50 mb-6 text-center leading-relaxed">
            {{ $t('forgot_password.subtitle') }}
          </p>
          
          <div class="form-control">
            <label class="label py-1"><span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.email') }}</span></label>
            <input v-model="email" type="email" required class="input input-bordered w-full font-black" :placeholder="$t('forgot_password.email_placeholder')" />
          </div>

          <div v-if="error" class="alert alert-error text-[10px] font-black uppercase tracking-wider py-2 mt-4">
            <i class="fi fi-sr-exclamation"></i>
            <span>{{ error }}</span>
          </div>

          <div class="pt-6">
            <button @click="handleReset" :disabled="loading" class="btn btn-primary w-full font-black uppercase tracking-widest shadow-lg shadow-primary/20">
              <span v-if="loading" class="loading loading-spinner"></span>
              {{ $t('forgot_password.send_link') }}
            </button>
          </div>
        </div>

        <div v-else class="text-center space-y-6 py-4 animate-in fade-in zoom-in duration-500">
          <div class="w-20 h-20 bg-success/10 rounded-[2.5rem] flex items-center justify-center text-4xl text-success mx-auto shadow-inner">
            <i class="fi fi-sr-envelope-dot"></i>
          </div>
          <p class="text-sm font-bold opacity-80">
            {{ $t('forgot_password.success_message') }}
          </p>
        </div>

        <div class="text-center pt-2">
          <router-link to="/login" class="link link-primary text-[10px] font-black uppercase tracking-[0.2em]">
            <i class="fi fi-sr-arrow-left mr-2"></i> {{ $t('forgot_password.back_to_login') }}
          </router-link>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>
