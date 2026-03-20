<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const error = ref<string | null>('');
const loading = ref(false);

async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = 'Inserisci username e password';
    return;
  }
  loading.value = true;
  error.value = '';
  const success = await auth.login(username.value, password.value);
  if (success) {
    router.push('/');
  } else {
    error.value = auth.error;
  }
  loading.value = false;
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200 px-4 relative overflow-hidden">
    <!-- Background Decor (subtle gradient/glow) -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
      <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full"></div>
      <div class="absolute top-[40%] -right-[10%] w-[30%] h-[50%] bg-secondary/10 blur-[100px] rounded-full"></div>
    </div>

    <div class="max-w-md w-full space-y-8 bg-base-100 p-8 rounded-2xl shadow-xl relative z-10 border border-base-content/5">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-black uppercase tracking-tight text-primary italic">Glice<span class="text-base-content">Chart</span></h2>
        <p class="mt-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{{ $t('login.subtitle') || 'Accedi al tuo profilo multiutente' }}</p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div class="form-control">
            <label class="label py-1">
              <span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('login.username') || 'Username' }}</span>
            </label>
            <input v-model="username" type="text" required class="input input-bordered w-full font-black" :placeholder="$t('login.username_placeholder') || 'Il tuo username'" />
          </div>
          <div class="form-control">
            <label class="label py-1">
              <span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('login.password') || 'Password' }}</span>
            </label>
            <input v-model="password" type="password" required class="input input-bordered w-full font-black" placeholder="••••••••" />
          </div>
        </div>

        <div v-if="error" class="alert alert-error text-[10px] font-black uppercase tracking-wider py-2">
          <i class="fi fi-sr-exclamation"></i>
          <span>{{ error }}</span>
        </div>

        <div class="pt-2">
          <button type="submit" :disabled="loading" class="btn btn-primary w-full font-black uppercase tracking-widest shadow-lg shadow-primary/20">
            <span v-if="loading" class="loading loading-spinner"></span>
            {{ $t('login.submit') || 'Accedi' }}
          </button>
        </div>
        
        <div class="flex flex-col gap-4 text-center">
          <router-link to="/forgot-password" class="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all">
            {{ $t('login.forgot_password') || 'Hai dimenticato la password?' }}
          </router-link>
          
          <div class="divider text-[9px] font-black uppercase tracking-[0.2em] opacity-20">OR</div>

          <div class="text-[10px] font-bold">
            <span class="opacity-40 uppercase tracking-widest">{{ $t('login.no_account') || 'Non hai un account?' }} </span>
            <router-link to="/register" class="link link-primary font-black uppercase tracking-widest">{{ $t('login.register') || 'Registrati' }}</router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
