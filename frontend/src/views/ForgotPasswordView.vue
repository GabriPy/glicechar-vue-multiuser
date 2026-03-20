<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const email = ref('');
const message = ref<string | null>(null);
const error = ref<string | null>(null);
const loading = ref(false);

async function handleSubmit() {
  if (!email.value) {
    error.value = 'Inserisci la tua email';
    return;
  }
  loading.value = true;
  error.value = null;
  message.value = null;
  
  const success = await auth.forgotPassword(email.value);
  if (success) {
    message.value = 'Se l\'email è presente nei nostri sistemi, riceverai le istruzioni tra poco.';
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
        <h2 class="mt-6 text-3xl font-extrabold text-primary italic uppercase tracking-tight">Recupero <span class="text-base-content">Password</span></h2>
        <p class="mt-2 text-sm text-base-content/70">Inserisci la tua email per ricevere il link di ripristino</p>
      </div>
      
      <form v-if="!message" class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-1">
          <label class="label py-1"><span class="label-text text-[10px] font-black uppercase opacity-40">Email dell'account</span></label>
          <input v-model="email" type="email" required class="input input-bordered w-full font-bold" placeholder="tua@email.it" />
        </div>

        <div v-if="error" class="alert alert-error text-xs py-2 font-bold">
          <i class="fi fi-sr-exclamation"></i>
          <span>{{ error }}</span>
        </div>

        <div>
          <button type="submit" :disabled="loading" class="btn btn-primary w-full font-black uppercase tracking-widest">
            <span v-if="loading" class="loading loading-spinner"></span>
            Invia Link di Recupero
          </button>
        </div>
        
        <div class="text-center text-xs">
          <router-link to="/login" class="link link-primary font-black uppercase tracking-tighter">Torna al Login</router-link>
        </div>
      </form>

      <div v-else class="text-center space-y-6 py-4">
        <div class="w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto">
          <i class="fi fi-sr-check-circle text-3xl"></i>
        </div>
        <p class="font-bold opacity-80">{{ message }}</p>
        <router-link to="/login" class="btn btn-ghost btn-sm font-black uppercase tracking-widest">Vai al Login</router-link>
      </div>
    </div>
  </div>
</template>
