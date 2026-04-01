<template>
  <div class="max-w-6xl mx-auto">
    <!-- Header Page -->
    <div class="mb-8 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 bg-primary/10 rounded-3xl text-primary flex items-center justify-center text-2xl shadow-inner border border-primary/5">
          <i class="fi fi-sr-settings-sliders"></i>
        </div>
        <div>
          <h1 class="text-3xl font-black uppercase tracking-tight italic">{{ $t('settings.profile_config').split(' ')[0] }} <span class="text-primary">{{ $t('settings.profile_config').split(' ')[1] }}</span></h1>
          <p class="text-[10px] font-black opacity-40 uppercase tracking-[0.3em]">{{ $t('settings.profile_subtitle') }}</p>
        </div>
      </div>
      
      <div class="hidden md:flex items-center gap-2 px-4 py-2 bg-base-200/50 rounded-2xl border border-base-content/5">
        <div class="w-2 h-2 rounded-full bg-success animate-pulse"></div>
        <span class="text-[10px] font-black uppercase tracking-widest opacity-60">{{ $t('settings.online_system') }}</span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Sidebar Navigation -->
      <div class="lg:col-span-3 flex flex-col gap-2 sticky top-24">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-left group border border-transparent"
          :class="activeTab === tab.id 
            ? 'bg-primary text-primary-content shadow-xl shadow-primary/20 scale-[1.02] border-primary/10' 
            : 'hover:bg-base-200 text-base-content/60 hover:text-base-content hover:border-base-content/10'"
        >
          <i :class="[tab.icon, 'text-lg group-hover:scale-110 transition-transform']"></i>
          <span class="text-xs font-black uppercase tracking-widest">{{ tab.label }}</span>
          <i v-if="activeTab === tab.id" class="fi fi-sr-angle-small-right ml-auto text-xl"></i>
        </button>
        
        <div class="mt-8 p-6 bg-base-200/50 rounded-3xl border border-base-content/5 relative overflow-hidden">
          <div class="absolute -top-10 -right-10 w-24 h-24 bg-primary/5 blur-3xl rounded-full"></div>
          <p class="text-[9px] font-black uppercase tracking-[0.1em] opacity-40 leading-relaxed relative z-10">
            {{ $t('settings.therapy_impact_note') }}
          </p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="lg:col-span-9 space-y-6">
        
        <!-- Tab: Account -->
        <div v-if="activeTab === 'account'" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="card bg-base-100 shadow-2xl border border-base-content/5 overflow-visible">
            <div class="card-body p-8 gap-8">
              <div class="flex items-center gap-3 border-b border-base-content/5 pb-4">
                <i class="fi fi-sr-user-gear text-primary text-xl"></i>
                <h3 class="text-sm font-black uppercase tracking-widest opacity-80">{{ $t('settings.personal_info') }}</h3>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1">
                  <label class="label py-1"><span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.username') }}</span></label>
                  <input type="text" v-model="accountForm.username" class="input input-bordered w-full font-black bg-base-200/30" />
                </div>
                <div class="space-y-1">
                  <label class="label py-1"><span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.email') }}</span></label>
                  <input type="email" v-model="accountForm.email" class="input input-bordered w-full font-black bg-base-200/30" :placeholder="auth.user?.email || 'tua@email.it'" />
                </div>
                <div class="md:col-span-2 space-y-1">
                  <label class="label py-1"><span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.timezone') }}</span></label>
                  <TimezoneSelector v-model="accountForm.timezone" />
                </div>
              </div>

              <div class="flex items-center gap-3 border-b border-base-content/5 pb-4 mt-4">
                <i class="fi fi-sr-lock text-primary text-xl"></i>
                <h3 class="text-sm font-black uppercase tracking-widest opacity-80">{{ $t('settings.security_password') }}</h3>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="space-y-1">
                  <label class="label py-1"><span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.current_password') }}</span></label>
                  <input type="password" v-model="accountForm.oldPassword" class="input input-bordered w-full font-black bg-base-200/30" placeholder="••••••••" />
                </div>
                <div class="space-y-1">
                  <label class="label py-1"><span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.new_password') }}</span></label>
                  <input type="password" v-model="accountForm.password" class="input input-bordered w-full font-black bg-base-200/30" placeholder="••••••••" />
                </div>
                <div class="space-y-1">
                  <label class="label py-1"><span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.confirm_new_password') }}</span></label>
                  <input type="password" v-model="accountForm.confirmPassword" class="input input-bordered w-full font-black bg-base-200/30" placeholder="••••••••" />
                </div>
              </div>
              
              <div class="flex justify-end pt-4 border-t border-base-content/5">
                <button @click="saveAccount" :disabled="loading" class="btn btn-primary font-black uppercase tracking-widest px-12 shadow-xl shadow-primary/20">
                  <span v-if="loading" class="loading loading-spinner"></span>
                  {{ $t('settings.save_account_changes') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Terapia -->
        <div v-if="activeTab === 'therapy'" class="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Target TIR -->
            <div class="card bg-base-100 shadow-2xl border border-base-content/5">
              <div class="card-body p-8 gap-6">
                <div class="flex items-center gap-3 border-b border-base-content/5 pb-4">
                  <i class="fi fi-sr-target text-success text-xl"></i>
                  <h3 class="text-sm font-black uppercase tracking-widest opacity-80">{{ $t('settings.tir_title') }}</h3>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="label py-1"><span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.tir_min') }}</span></label>
                    <input type="number" v-model.number="form.tir_min" class="input input-bordered w-full font-black bg-base-200/30 text-center text-lg" />
                  </div>
                  <div class="space-y-1">
                    <label class="label py-1"><span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.tir_max') }}</span></label>
                    <input type="number" v-model.number="form.tir_max" class="input input-bordered w-full font-black bg-base-200/30 text-center text-lg" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Soglie Critiche -->
            <div class="card bg-base-100 shadow-2xl border border-base-content/5">
              <div class="card-body p-8 gap-6">
                <div class="flex items-center gap-3 border-b border-base-content/5 pb-4">
                  <i class="fi fi-sr-shield-exclamation text-error text-xl"></i>
                  <h3 class="text-sm font-black uppercase tracking-widest opacity-80">{{ $t('settings.critical_thresholds') }}</h3>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="label py-1"><span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.critical_under') }}</span></label>
                    <input type="number" v-model.number="form.red_under" class="input input-bordered w-full font-black bg-base-200/30 text-center text-lg border-error/20" />
                  </div>
                  <div class="space-y-1">
                    <label class="label py-1"><span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.critical_over') }}</span></label>
                    <input type="number" v-model.number="form.red_over" class="input input-bordered w-full font-black bg-base-200/30 text-center text-lg border-error/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Farmacocinetica -->
          <div class="card bg-base-100 shadow-2xl border border-base-content/5">
            <div class="card-body p-8 gap-6">
              <div class="flex items-center gap-3 border-b border-base-content/5 pb-4">
                <i class="fi fi-sr-clock text-primary text-xl"></i>
                <h3 class="text-sm font-black uppercase tracking-widest opacity-80">{{ $t('settings.action_duration') }}</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="space-y-1">
                  <label class="label py-1"><span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.rapid_insulin') }}</span></label>
                  <input type="number" v-model.number="form.rapid_duration" class="input input-bordered w-full font-black bg-base-200/30" />
                </div>
                <div class="space-y-1">
                  <label class="label py-1"><span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.slow_insulin') }}</span></label>
                  <input type="number" v-model.number="form.slow_duration" class="input input-bordered w-full font-black bg-base-200/30" />
                </div>
                <div class="space-y-1">
                  <label class="label py-1"><span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.carb_absorption') }}</span></label>
                  <input type="number" v-model.number="form.carb_duration" class="input input-bordered w-full font-black bg-base-200/30 border-accent/20" />
                </div>
              </div>
            </div>
          </div>

          <!-- Rapporti -->
          <div class="card bg-base-100 shadow-2xl border border-base-content/5">
            <div class="card-body p-8 gap-6">
              <div class="flex items-center gap-3 border-b border-base-content/5 pb-4">
                <i class="fi fi-sr-calculator text-secondary text-xl"></i>
                <h3 class="text-sm font-black uppercase tracking-widest opacity-80">{{ $t('settings.ratios_sensitivity') }}</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-1">
                  <label class="label py-1 flex justify-between">
                    <span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.insulin_sensitivity') }}</span>
                    <span class="text-[9px] font-bold opacity-30 tracking-widest">{{ $t('settings.isf_unit') }}</span>
                  </label>
                  <input type="number" v-model.number="form.insulin_sensitivity" class="input input-bordered w-full font-black bg-base-200/30" />
                </div>
                <div class="space-y-1">
                  <label class="label py-1 flex justify-between">
                    <span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.carb_ratio') }}</span>
                    <span class="text-[9px] font-bold opacity-30 tracking-widest">{{ $t('settings.cr_unit') }}</span>
                  </label>
                  <input type="number" v-model.number="form.carb_ratio" class="input input-bordered w-full font-black bg-base-200/30" />
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-between items-center pt-4">
            <button @click="resetToDefaults" class="btn btn-ghost btn-sm font-black uppercase tracking-widest opacity-40 hover:opacity-100">
              <i class="fi fi-sr-refresh mr-2"></i> {{ $t('settings.reset_defaults') }}
            </button>
            <button @click="saveSettings" :disabled="loading" class="btn btn-primary font-black uppercase tracking-widest px-12 shadow-xl shadow-primary/20">
              <span v-if="loading" class="loading loading-spinner"></span>
              {{ $t('settings.save_therapy_params') }}
            </button>
          </div>
        </div>

        <!-- Tab: Gluroo -->
        <div v-if="activeTab === 'gluroo'" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="card bg-base-100 shadow-2xl border border-base-content/5">
            <div class="card-body p-8 gap-8">
              <div class="flex flex-col items-center text-center gap-4 mb-4">
                <div class="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-4xl text-primary shadow-inner">
                  <i class="fi fi-sr-cloud-share"></i>
                </div>
                <div>
                  <h3 class="text-xl font-black uppercase italic tracking-tight">{{ $t('settings.gluroo_sync') }}</h3>
                  <p class="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mt-1">{{ $t('settings.gluroo_sync_subtitle') }}</p>
                </div>
              </div>

              <div class="space-y-6 max-w-2xl mx-auto w-full">
                <div class="space-y-1">
                  <label class="label py-1"><span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.gluroo_link') }}</span></label>
                  <input type="text" v-model="form.gluroo_link" class="input input-bordered w-full font-black bg-base-200/30" :placeholder="$t('settings.gluroo_link_placeholder')" />
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-1">
                    <label class="label py-1"><span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.gluroo_token') }}</span></label>
                    <input type="password" v-model="form.gluroo_token" class="input input-bordered w-full font-black bg-base-200/30" :placeholder="$t('settings.gluroo_token_placeholder')" />
                  </div>
                  <div class="space-y-1">
                    <label class="label py-1"><span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('settings.gluroo_header') }}</span></label>
                    <input type="password" v-model="form.gluroo_header" class="input input-bordered w-full font-black bg-base-200/30" :placeholder="$t('settings.gluroo_header_placeholder')" />
                  </div>
                </div>
                
                <div class="p-6 bg-primary/5 rounded-3xl border border-primary/10 flex gap-4 items-start">
                  <i class="fi fi-sr-info text-primary mt-1"></i>
                  <p class="text-[10px] font-bold opacity-60 leading-relaxed uppercase tracking-wide">
                    {{ $t('settings.gluroo_info_box') }}
                  </p>
                </div>
              </div>

              <div class="flex justify-center pt-8 border-t border-base-content/5 mt-4">
                <button @click="saveSettings" :disabled="loading" class="btn btn-primary font-black uppercase tracking-widest px-16 shadow-xl shadow-primary/20">
                  <span v-if="loading" class="loading loading-spinner"></span>
                  {{ $t('settings.save_sync') }}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Notifiche Feedback -->
    <div v-if="saved" class="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] animate-in fade-in zoom-in slide-in-from-bottom-10 duration-500">
      <div class="alert alert-success shadow-2xl font-black uppercase tracking-widest text-[10px] py-4 px-10 border-none bg-success text-success-content flex items-center gap-3">
        <i class="fi fi-sr-check-circle text-xl"></i>
        <span>{{ successMessage || $t('settings.settings_saved') }}</span>
      </div>
    </div>

    <div v-if="errorMessage" class="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] animate-in fade-in zoom-in slide-in-from-bottom-10 duration-500">
      <div class="alert alert-error shadow-2xl font-black uppercase tracking-widest text-[10px] py-4 px-10 border-none bg-error text-error-content flex items-center gap-3">
        <i class="fi fi-sr-exclamation text-xl"></i>
        <span>{{ errorMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useGlucoseStore } from '../stores/glucose'
import { useAuthStore } from '../stores/auth'
import { useI18n } from 'vue-i18n'
import TimezoneSelector from '../components/TimezoneSelector.vue'

const { t } = useI18n()
const store = useGlucoseStore()
const auth = useAuthStore()
const saved = ref(false)
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const activeTab = ref('account')
const tabs = computed(() => {
  const baseTabs = [
    { id: 'account', label: t('settings.profile_tab'), icon: 'fi-sr-user' },
    { id: 'gluroo', label: t('settings.sync_tab'), icon: 'fi-sr-cloud-share' }
  ]
  
  // Mostra Terapia solo se Gluroo è configurato
  if (auth.user?.gluroo?.link) {
    baseTabs.splice(1, 0, { id: 'therapy', label: t('settings.therapy_tab'), icon: 'fi-sr-pulse' })
  }
  
  return baseTabs
})

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
  timezone: auth.user?.timezone || 'Europe/Rome',
  oldPassword: '',
  password: '',
  confirmPassword: ''
})

onMounted(async () => {
  await Promise.all([
    store.fetchSettings(),
    auth.fetchMe()
  ])
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
    oldPassword: accountForm.value.oldPassword,
    timezone: accountForm.value.timezone
  })
  
  if (success) {
    successMessage.value = t('settings.account_updated')
    accountForm.value.oldPassword = ''
    accountForm.value.password = ''
    accountForm.value.confirmPassword = ''
    updateFormFromStore()
    saved.value = true
    setTimeout(() => saved.value = false, 3000)
  } else {
    errorMessage.value = auth.error || 'Errore durante l\'aggiornamento account'
  }
  loading.value = false
}

function updateFormFromStore() {
  if (store.settings) {
    form.value.tir_min = store.settings.tir_min
    form.value.tir_max = store.settings.tir_max
    form.value.red_under = store.settings.red_under
    form.value.red_over = store.settings.red_over
    form.value.rapid_duration = store.settings.rapid_duration
    form.value.slow_duration = store.settings.slow_duration
    form.value.carb_duration = store.settings.carb_duration
    form.value.insulin_sensitivity = store.settings.insulin_sensitivity
    form.value.carb_ratio = store.settings.carb_ratio
  }
  
  if (auth.user?.gluroo) {
    form.value.gluroo_token = auth.user.gluroo.token || ''
    form.value.gluroo_header = auth.user.gluroo.header || ''
    form.value.gluroo_link = auth.user.gluroo.link || ''
  }

  if (auth.user) {
    accountForm.value.username = auth.user.username || ''
    accountForm.value.email = auth.user.email || ''
    accountForm.value.timezone = auth.user.timezone || 'Europe/Rome'
  }
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
    
    if (!success) {
      errorMessage.value = store.error || 'Errore salvataggio impostazioni'
      loading.value = false
      return
    }

    const glurooSuccess = await auth.updateGluroo({
      link: form.value.gluroo_link,
      token: form.value.gluroo_token,
      header: form.value.gluroo_header
    })
    
    if (glurooSuccess) {
      successMessage.value = t('settings.settings_saved')
      await store.fetchSettings() 
      await auth.fetchMe()
      updateFormFromStore()
      saved.value = true
      setTimeout(() => saved.value = false, 3000)
    } else {
      errorMessage.value = auth.error || 'Errore salvataggio credenziali Gluroo'
    }
  } catch (e) {
    errorMessage.value = 'Errore imprevisto durante il salvataggio'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.animate-in {
  animation-duration: 0.3s;
}
</style>
