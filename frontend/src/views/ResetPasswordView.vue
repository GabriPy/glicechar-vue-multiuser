<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRoute, useRouter } from 'vue-router';
import PublicNavbar from '../components/PublicNavbar.vue';

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
        <p class="mt-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{{ $t('reset_password.title') }}</p>
      </div>
      
      <div v-if="!successMessage && token" class="mt-8 space-y-4" @keyup.enter="handleSubmit">
        <p class="text-[11px] font-bold opacity-50 mb-2 text-center leading-relaxed italic">
          {{ $t('reset_password.subtitle') }}
        </p>

        <div class="form-control">
          <label class="label py-1"><span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('reset_password.new_password') }}</span></label>
          <input v-model="password" type="password" required class="input input-bordered w-full font-black" placeholder="••••••••" />
        </div>

        <div class="form-control">
          <label class="label py-1"><span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('reset_password.confirm_password') }}</span></label>
          <input v-model="confirmPassword" type="password" required class="input input-bordered w-full font-black" placeholder="••••••••" />
        </div>

        <div v-if="error" class="alert alert-error text-[10px] font-black uppercase tracking-wider py-2">
          <i class="fi fi-sr-exclamation"></i>
          <span>{{ error }}</span>
        </div>

        <div class="pt-4">
          <button type="button" @click="handleSubmit" :disabled="loading" class="btn btn-primary w-full font-black uppercase tracking-widest shadow-lg shadow-primary/20">
            <span v-if="loading" class="loading loading-spinner"></span>
            {{ $t('reset_password.update_button') }}
          </button>
        </div>
      </div>

      <div v-else-if="successMessage" class="text-center space-y-6 py-4">
        <div class="w-20 h-20 bg-success/10 rounded-[2.5rem] flex items-center justify-center text-4xl text-success mx-auto shadow-inner">
          <i class="fi fi-sr-lock"></i>
        </div>
        <p class="text-sm font-bold opacity-80">{{ $t('reset_password.success_message') }}</p>
        <router-link to="/login" class="btn btn-primary btn-sm rounded-xl font-black uppercase tracking-widest px-8 shadow-lg shadow-primary/20">
          {{ $t('landing.login') }}
        </router-link>
      </div>

      <div v-else class="text-center py-8">
        <div class="alert alert-error font-black uppercase tracking-wider mb-6">
          <i class="fi fi-sr-ban"></i>
          <span>{{ error || 'Link non valido' }}</span>
        </div>
        <router-link to="/login" class="link link-primary text-[10px] font-black uppercase tracking-[0.2em]">
          <i class="fi fi-sr-arrow-left mr-2"></i> {{ $t('forgot_password.back_to_login') }}
        </router-link>
      </div>
    </div>
  </div>
</div>
</template>
