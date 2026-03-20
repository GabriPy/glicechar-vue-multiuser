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
  <div class="min-h-screen flex items-center justify-center bg-base-200 px-4 relative overflow-hidden">
    <!-- Background Decor -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
      <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full"></div>
      <div class="absolute top-[40%] -right-[10%] w-[30%] h-[50%] bg-secondary/10 blur-[100px] rounded-full"></div>
    </div>

    <div class="max-w-md w-full space-y-8 bg-base-100 p-8 rounded-2xl shadow-xl relative z-10 border border-base-content/5">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-black uppercase tracking-tight text-primary italic">Recupero <span class="text-base-content">Password</span></h2>
        <p class="mt-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Inserisci la tua email per ricevere il link di ripristino</p>
      </div>
      
      <form v-if="!message" class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="form-control">
          <label class="label py-1"><span class="label-text text-[10px] font-black uppercase opacity-40">Email dell'account</span></label>
          <input v-model="email" type="email" required class="input input-bordered w-full font-black" placeholder="tua@email.it" />
        </div>

        <div v-if="error" class="alert alert-error text-[10px] font-black uppercase tracking-wider py-2">
          <i class="fi fi-sr-exclamation"></i>
          <span>{{ error }}</span>
        </div>

        <div>
          <button type="submit" :disabled="loading" class="btn btn-primary w-full font-black uppercase tracking-widest shadow-lg shadow-primary/20">
            <span v-if="loading" class="loading loading-spinner"></span>
            Invia Link di Recupero
          </button>
        </div>
        
        <div class="text-center">
          <router-link to="/login" class="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all">
            Torna al Login
          </router-link>
        </div>
      </form>

      <div v-else class="text-center space-y-6 py-4">
        <div class="w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto">
          <i class="fi fi-sr-check-circle text-3xl"></i>
        </div>
        <p class="text-sm font-black uppercase tracking-tight opacity-70">{{ message }}</p>
        <router-link to="/login" class="btn btn-ghost btn-sm font-black uppercase tracking-widest opacity-50">Vai al Login</router-link>
      </div>
    </div>
  </div>
</template>
