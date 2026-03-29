<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import PublicNavbar from '../components/PublicNavbar.vue';

const auth = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const email = ref('');
const error = ref<string | null>('');
const loading = ref(false);
const showEmailWarning = ref(false);

async function handleRegister(skipWarning = false) {
  if (!username.value || !password.value || !confirmPassword.value) {
    error.value = 'Completa tutti i campi';
    return;
  }
  if (username.value.length < 3) {
    error.value = 'Username deve essere di almeno 3 caratteri';
    return;
  }
  if (password.value.length < 6) {
    error.value = 'Password deve essere di almeno 6 caratteri';
    return;
  }
  if (password.value !== confirmPassword.value) {
    error.value = 'Le password non coincidono';
    return;
  }

  if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    error.value = 'Email non valida';
    return;
  }

  if (!email.value && !skipWarning) {
    showEmailWarning.value = true;
    return;
  }

  loading.value = true;
  error.value = '';
  const success = await auth.register(username.value, password.value, email.value);
  if (success) {
    router.push('/login');
  } else {
    error.value = auth.error;
  }
  loading.value = false;
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-base-200 relative overflow-hidden pt-16">
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
        <p class="mt-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Registrazione Multiutente</p>
      </div>
      
      <div class="mt-8 space-y-4" @keyup.enter="handleRegister(false)">
        <div class="form-control">
          <label class="label py-1"><span class="label-text text-[10px] font-black uppercase opacity-40">Username</span></label>
          <input v-model="username" type="text" required class="input input-bordered w-full font-black" placeholder="Il tuo username" />
        </div>

        <div class="form-control">
          <label class="label py-1">
            <span class="label-text text-[10px] font-black uppercase opacity-40">Email (Consigliata)</span>
          </label>
          <input v-model="email" type="email" class="input input-bordered w-full font-black" placeholder="tua@email.it" />
          <p class="text-[9px] opacity-40 italic px-1">Necessaria per il recupero password</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label py-1"><span class="label-text text-[10px] font-black uppercase opacity-40">Password</span></label>
            <input v-model="password" type="password" required class="input input-bordered w-full font-black" placeholder="••••••••" />
          </div>
          <div class="form-control">
            <label class="label py-1"><span class="label-text text-[10px] font-black uppercase opacity-40">Conferma</span></label>
            <input v-model="confirmPassword" type="password" required class="input input-bordered w-full font-black" placeholder="••••••••" />
          </div>
        </div>

        <div v-if="error" class="alert alert-error text-[10px] font-black uppercase tracking-wider py-2">
          <i class="fi fi-sr-exclamation"></i>
          <span>{{ error }}</span>
        </div>

        <div class="pt-4">
          <button type="button" @click="handleRegister(false)" :disabled="loading" class="btn btn-primary w-full font-black uppercase tracking-widest shadow-lg shadow-primary/20">
            <span v-if="loading" class="loading loading-spinner"></span>
            Registrati
          </button>
        </div>

        <div class="text-center">
          <div class="text-[10px] font-bold">
            <span class="opacity-40 uppercase tracking-widest">Hai già un account? </span>
            <router-link to="/login" class="link link-primary font-black uppercase tracking-widest">Accedi</router-link>
          </div>
        </div>
      </div>

      <div v-if="showEmailWarning" class="absolute inset-0 bg-base-100/95 backdrop-blur-sm z-50 rounded-2xl flex items-center justify-center p-8 text-center">
        <div class="space-y-6">
          <div class="w-16 h-16 bg-warning/20 text-warning rounded-3xl flex items-center justify-center mx-auto">
            <i class="fi fi-sr-shield-exclamation text-3xl"></i>
          </div>
          <div class="space-y-2">
            <h3 class="text-xl font-black uppercase tracking-tight">Attenzione</h3>
            <p class="text-sm opacity-70">
              Senza l'inserimento della mail non potrai recuperare la password in caso di smarrimento.
            </p>
          </div>
          <div class="flex flex-col gap-2">
            <button @click="showEmailWarning = false" class="btn btn-primary font-black uppercase tracking-widest">
              Torna Indietro e Inserisci Mail
            </button>
            <button @click="handleRegister(true)" class="btn btn-ghost btn-xs opacity-50 font-black uppercase tracking-widest">
              Continua Comunque
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>
