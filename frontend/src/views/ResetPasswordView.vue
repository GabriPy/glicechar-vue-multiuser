<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRoute, useRouter } from 'vue-router';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const token = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const loading = ref(false);

onMounted(() => {
  token.value = route.query.token as string || '';
  if (!token.value) {
    error.value = 'Token mancante o non valido';
  }
});

async function handleSubmit() {
  if (password.value !== confirmPassword.value) {
    error.value = 'Le password non coincidono';
    return;
  }
  if (password.value.length < 6) {
    error.value = 'La password deve essere di almeno 6 caratteri';
    return;
  }

  loading.value = true;
  error.value = null;
  
  const success = await auth.resetPassword(token.value, password.value);
  if (success) {
    successMessage.value = 'Password aggiornata con successo! Ora puoi accedere.';
    setTimeout(() => router.push('/login'), 3000);
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
        <h2 class="mt-6 text-3xl font-extrabold text-primary italic uppercase tracking-tight">Nuova <span class="text-base-content">Password</span></h2>
        <p class="mt-2 text-sm text-base-content/70">Imposta la tua nuova chiave d'accesso</p>
      </div>
      
      <form v-if="!successMessage && token" class="mt-8 space-y-4" @submit.prevent="handleSubmit">
        <div class="space-y-1">
          <label class="label py-1"><span class="label-text text-[10px] font-black uppercase opacity-40">Nuova Password</span></label>
          <input v-model="password" type="password" required class="input input-bordered w-full font-bold" placeholder="••••••••" />
        </div>

        <div class="space-y-1">
          <label class="label py-1"><span class="label-text text-[10px] font-black uppercase opacity-40">Conferma Nuova Password</span></label>
          <input v-model="confirmPassword" type="password" required class="input input-bordered w-full font-bold" placeholder="••••••••" />
        </div>

        <div v-if="error" class="alert alert-error text-xs py-2 font-bold">
          <i class="fi fi-sr-exclamation"></i>
          <span>{{ error }}</span>
        </div>

        <div class="pt-4">
          <button type="submit" :disabled="loading" class="btn btn-primary w-full font-black uppercase tracking-widest">
            <span v-if="loading" class="loading loading-spinner"></span>
            Reimposta Password
          </button>
        </div>
      </form>

      <div v-else-if="successMessage" class="text-center space-y-6 py-4">
        <div class="w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto">
          <i class="fi fi-sr-check-circle text-3xl"></i>
        </div>
        <p class="font-bold opacity-80">{{ successMessage }}</p>
        <p class="text-xs opacity-40 italic">Verrai reindirizzato al login tra pochi istanti...</p>
      </div>

      <div v-else class="text-center py-8">
        <div class="alert alert-error font-bold mb-6">
          <i class="fi fi-sr-ban"></i>
          <span>{{ error || 'Link non valido' }}</span>
        </div>
        <router-link to="/login" class="btn btn-ghost btn-sm font-black uppercase tracking-widest">Torna al Login</router-link>
      </div>
    </div>
  </div>
</template>
