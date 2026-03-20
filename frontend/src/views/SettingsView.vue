<template>
  <div class="flex flex-col gap-6">
    <!-- Header Impostazioni -->
    <div class="card bg-base-200 shadow-sm border border-base-content/10">
      <div class="card-body p-4 md:p-6">
        <div class="flex items-center gap-3">
          <div class="p-2.5 bg-primary/10 rounded-2xl">
            <i class="fi fi-sr-settings text-primary text-xl"></i>
          </div>
          <div>
            <h2 class="text-lg font-black uppercase tracking-tight leading-none">Impostazioni</h2>
            <span class="text-[9px] font-black opacity-30 uppercase tracking-[0.2em]">Configurazione Personalizzata</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Gestione Account -->
      <div class="card bg-base-200 shadow-xl border border-base-content/5 md:col-span-2">
        <div class="card-body p-6 gap-4">
          <div class="flex items-center gap-2 mb-2">
            <i class="fi fi-sr-user-gear text-primary"></i>
            <span class="text-xs font-black uppercase tracking-widest opacity-50">{{ $t('settings.account_data') }}</span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.username') }}</span>
              </label>
              <input type="text" v-model="accountForm.username" class="input font-black" />
            </div>
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.email') }}</span>
              </label>
              <input type="email" v-model="accountForm.email" class="input font-black" :placeholder="auth.user?.email || 'tua@email.it'" />
            </div>
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.old_password') }}</span>
              </label>
              <input type="password" v-model="accountForm.oldPassword" class="input font-black" placeholder="••••••••" />
            </div>
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.new_password') }}</span>
              </label>
              <input type="password" v-model="accountForm.password" class="input font-black" placeholder="••••••••" />
            </div>
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.confirm_new_password') }}</span>
              </label>
              <input type="password" v-model="accountForm.confirmPassword" class="input font-black" placeholder="••••••••" />
            </div>
          </div>
          
          <div class="flex justify-end mt-2">
            <button @click="saveAccount" :disabled="loading" class="btn btn-primary btn-sm px-8 font-black uppercase tracking-widest">
              {{ $t('settings.update_account') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Target Time In Range -->
      <div class="card bg-base-200 shadow-xl border border-base-content/5">
        <div class="card-body p-6 gap-4">
          <div class="flex items-center gap-2 mb-2">
            <i class="fi fi-sr-target text-success"></i>
            <span class="text-xs font-black uppercase tracking-widest opacity-50">{{ $t('settings.tir_title') }}</span>
          </div>
          
          <div class="flex flex-col gap-4">
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.tir_min') }}</span>
              </label>
              <input type="number" v-model.number="form.tir_min" class="input font-black" />
            </div>
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.tir_max') }}</span>
              </label>
              <input type="number" v-model.number="form.tir_max" class="input font-black" />
            </div>
          </div>
        </div>
      </div>

      <!-- Soglie Critiche (Rosse) -->
      <div class="card bg-base-200 shadow-sm border border-base-content/10">
        <div class="card-body p-6 gap-4">
          <div class="flex items-center gap-2 mb-2">
            <i class="fi fi-sr-shield-exclamation text-error"></i>
            <span class="text-xs font-black uppercase tracking-widest opacity-50">{{ $t('settings.critical_thresholds') }}</span>
          </div>
          
          <div class="flex flex-col gap-4">
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.critical_under') }}</span>
              </label>
              <input type="number" v-model.number="form.red_under" class="input font-black border-error/30" />
            </div>
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.critical_over') }}</span>
              </label>
              <input type="number" v-model.number="form.red_over" class="input font-black border-error/30" />
            </div>
          </div>
        </div>
      </div>

      <!-- Durata Azione Insulina e Carboidrati -->
      <div class="card bg-base-200 shadow-xl border border-base-content/5">
        <div class="card-body p-6 gap-4">
          <div class="flex items-center gap-2 mb-2">
            <i class="fi fi-sr-clock text-primary"></i>
            <span class="text-xs font-black uppercase tracking-widest opacity-50">{{ $t('settings.action_duration') }}</span>
          </div>
          
          <div class="flex flex-col gap-4">
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.rapid_insulin') }}</span>
              </label>
              <input type="number" v-model.number="form.rapid_duration" class="input font-black" />
            </div>
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.slow_insulin') }}</span>
              </label>
              <input type="number" v-model.number="form.slow_duration" class="input font-black" />
            </div>
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.carb_absorption') }}</span>
              </label>
              <input type="number" v-model.number="form.carb_duration" class="input font-black border-accent/30" />
            </div>
          </div>
        </div>
      </div>

      <!-- Parametri Predizione -->
      <div class="card bg-base-200 shadow-sm border border-base-content/10">
        <div class="card-body p-6 gap-4">
          <div class="flex items-center gap-2 mb-2">
            <i class="fi fi-sr-calculator text-secondary"></i>
            <span class="text-xs font-black uppercase tracking-widest opacity-50">{{ $t('settings.prediction_params') }}</span>
          </div>
          
          <div class="flex flex-col gap-4">
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.insulin_sensitivity') }}</span>
              </label>
              <div class="flex items-center gap-2">
                <input type="number" v-model.number="form.insulin_sensitivity" class="input font-black flex-1" />
                <span class="text-[10px] font-bold opacity-30">{{ $t('settings.isf_unit') }}</span>
              </div>
            </div>
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.carb_ratio') }}</span>
              </label>
              <div class="flex items-center gap-2">
                <input type="number" v-model.number="form.carb_ratio" class="input font-black flex-1" />
                <span class="text-[10px] font-bold opacity-30">{{ $t('settings.cr_unit') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Configurazione Gluroo -->
      <div class="card bg-base-200 shadow-xl border border-base-content/5 md:col-span-2">
        <div class="card-body p-6 gap-4">
          <div class="flex items-center gap-2 mb-2">
            <i class="fi fi-sr-cloud-share text-primary"></i>
            <span class="text-xs font-black uppercase tracking-widest opacity-50">{{ $t('settings.gluroo_config') }}</span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-[10px] font-black uppercase opacity-40">Gluroo Link</span>
              </label>
              <input type="text" v-model="form.gluroo_link" class="input font-black" placeholder="https://..." />
            </div>
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-[10px] font-black uppercase opacity-40">SHA Token</span>
              </label>
              <input type="password" v-model="form.gluroo_token" class="input font-black" placeholder="Il tuo token..." />
            </div>
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-[10px] font-black uppercase opacity-40">SHA Header</span>
              </label>
              <input type="password" v-model="form.gluroo_header" class="input font-black" placeholder="Il tuo header..." />
            </div>
          </div>
          
          <div class="flex justify-end mt-2">
            <button @click="saveSettings" :disabled="loading" class="btn btn-primary btn-sm px-8 font-black uppercase tracking-widest">
              {{ $t('settings.save_settings') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pulsanti Azione -->
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
      <button 
        @click="resetToDefaults" 
        class="btn btn-ghost btn-sm px-6 font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all"
        :disabled="store.loading"
      >
        <i class="fi fi-sr-refresh mr-2"></i>
        {{ $t('settings.reset_defaults') }}
      </button>

      <button 
        @click="saveSettings" 
        class="btn btn-primary px-12 shadow-lg shadow-primary/20 font-black uppercase tracking-widest w-full sm:w-auto"
        :disabled="loading"
      >
        <span v-if="loading" class="loading loading-spinner"></span>
        {{ $t('settings.save_settings') }}
      </button>
    </div>

    <div v-if="saved" class="fixed bottom-6 right-6 z-50 animate-bounce">
      <div class="alert alert-success shadow-2xl font-black uppercase tracking-widest text-xs py-3 px-8">
        <i class="fi fi-sr-check-circle"></i>
        <span>{{ successMessage || $t('settings.settings_saved') }}</span>
      </div>
    </div>

    <div v-if="errorMessage" class="fixed bottom-6 right-6 z-50">
      <div class="alert alert-error shadow-2xl font-black uppercase tracking-widest text-xs py-3 px-8">
        <i class="fi fi-sr-exclamation"></i>
        <span>{{ errorMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useGlucoseStore } from '../stores/glucose'
import { useAuthStore } from '../stores/auth'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useGlucoseStore()
const auth = useAuthStore()
const saved = ref(false)
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const form = ref({
  tir_min: 70,
  tir_max: 180,
  red_under: 55,
  red_over: 250,
  rapid_duration: 3,
  slow_duration: 24,
  carb_duration: 4,
  insulin_sensitivity: 60,
  carb_ratio: 15,
  gluroo_token: '',
  gluroo_header: '',
  gluroo_link: ''
})

const accountForm = ref({
  username: auth.user?.username || '',
  email: auth.user?.email || '',
  oldPassword: '',
  password: '',
  confirmPassword: ''
})

onMounted(async () => {
  await store.fetchSettings()
  updateFormFromStore()
})

async function saveAccount() {
  if (!accountForm.value.username) {
    errorMessage.value = t('settings.username_required')
    return
  }

  if (accountForm.value.password && accountForm.value.password !== accountForm.value.confirmPassword) {
     errorMessage.value = t('settings.passwords_dont_match')
     return
   }
 
   if (accountForm.value.password && !accountForm.value.oldPassword) {
     errorMessage.value = t('settings.old_password_required')
     return
   }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  const success = await auth.updateAccount({
    username: accountForm.value.username,
    email: accountForm.value.email,
    password: accountForm.value.password,
    oldPassword: accountForm.value.oldPassword
  })
  
  if (success) {
    successMessage.value = t('settings.account_updated')
    accountForm.value.oldPassword = ''
    accountForm.value.password = ''
    accountForm.value.confirmPassword = ''
    saved.value = true
    setTimeout(() => saved.value = false, 3000)
  } else {
    errorMessage.value = auth.error || 'Errore durante l\'aggiornamento account'
  }
  loading.value = false
}

function updateFormFromStore() {
  form.value.tir_min = store.settings.tir_min
  form.value.tir_max = store.settings.tir_max
  form.value.red_under = store.settings.red_under
  form.value.red_over = store.settings.red_over
  form.value.rapid_duration = store.settings.rapid_duration
  form.value.slow_duration = store.settings.slow_duration
  form.value.carb_duration = store.settings.carb_duration
  form.value.insulin_sensitivity = store.settings.insulin_sensitivity
  form.value.carb_ratio = store.settings.carb_ratio
  
  // Dati Gluroo dall'auth store
  form.value.gluroo_token = auth.user?.gluroo?.token || ''
  form.value.gluroo_header = auth.user?.gluroo?.header || ''
  form.value.gluroo_link = auth.user?.gluroo?.link || ''

  // Dati Account
  accountForm.value.username = auth.user?.username || ''
  accountForm.value.email = auth.user?.email || ''
}

async function resetToDefaults() {
  if (confirm(t('settings.confirm_reset'))) {
    await store.resetSettings()
    updateFormFromStore()
    saved.value = true
    setTimeout(() => saved.value = false, 3000)
  }
}

async function saveSettings() {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const success = await store.updateSettings({
      tir_min: form.value.tir_min,
      tir_max: form.value.tir_max,
      red_under: form.value.red_under,
      red_over: form.value.red_over,
      rapid_duration: form.value.rapid_duration,
      slow_duration: form.value.slow_duration,
      carb_duration: form.value.carb_duration,
      insulin_sensitivity: form.value.insulin_sensitivity,
      carb_ratio: form.value.carb_ratio
    })
    if (success) {
      await auth.updateGluroo({
        link: form.value.gluroo_link,
        token: form.value.gluroo_token,
        header: form.value.gluroo_header
      })
      successMessage.value = t('settings.settings_saved')
      updateFormFromStore()
      saved.value = true
      setTimeout(() => saved.value = false, 3000)
    }
  } catch (e) {
    errorMessage.value = t('settings.save_error')
  } finally {
    loading.value = false
  }
}
</script>
