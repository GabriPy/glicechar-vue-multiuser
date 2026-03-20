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
  <div class="min-h-screen flex items-center justify-center bg-base-200 px-4">
    <div class="max-w-md w-full space-y-8 bg-base-100 p-8 rounded-2xl shadow-xl">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-primary">GliceChart-multiuser</h2>
        <p class="mt-2 text-sm text-base-content/70">Accedi al tuo profilo multiutente</p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label class="label"><span class="label-text">Username</span></label>
            <input v-model="username" type="text" required class="input w-full" placeholder="Il tuo username" />
          </div>
          <div>
            <label class="label"><span class="label-text">Password</span></label>
            <input v-model="password" type="password" required class="input w-full" placeholder="••••••••" />
          </div>
        </div>

        <div v-if="error" class="alert alert-error text-sm py-2">
          <span>{{ error }}</span>
        </div>

        <div>
          <button type="submit" :disabled="loading" class="btn btn-primary w-full">
            <span v-if="loading" class="loading loading-spinner"></span>
            Accedi
          </button>
        </div>
        
        <div class="flex flex-col gap-2 text-center text-sm">
          <div>
            <router-link to="/forgot-password" class="link link-primary opacity-70 hover:opacity-100">Hai dimenticato la password?</router-link>
          </div>
          <div>
            <span>Non hai un account? </span>
            <router-link to="/register" class="link link-primary font-medium">Registrati</router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
