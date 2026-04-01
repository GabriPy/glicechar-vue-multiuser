<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useI18n } from 'vue-i18n'
import axios from 'axios'

const { t } = useI18n()
const auth = useAuthStore()
const users = ref([])
const loading = ref(false)
const error = ref(null)

// Lista dei fusi orari per mappare il codice bandiera
const timezoneToCode = {
  'Europe/Rome': { code: 'it', label: 'Italia' },
  'Europe/London': { code: 'gb', label: 'Regno Unito' },
  'Europe/Paris': { code: 'fr', label: 'Francia' },
  'Europe/Berlin': { code: 'de', label: 'Germania' },
  'Europe/Madrid': { code: 'es', label: 'Spagna' },
  'Europe/Zurich': { code: 'ch', label: 'Svizzera' },
  'Europe/Brussels': { code: 'be', label: 'Belgio' },
  'Europe/Amsterdam': { code: 'nl', label: 'Paesi Bassi' },
  'Europe/Lisbon': { code: 'pt', label: 'Portogallo' },
  'Europe/Vienna': { code: 'at', label: 'Austria' },
  'Europe/Athens': { code: 'gr', label: 'Grecia' },
  'Europe/Moscow': { code: 'ru', label: 'Russia' },
  'America/New_York': { code: 'us', label: 'USA' },
  'America/Chicago': { code: 'us', label: 'USA' },
  'America/Denver': { code: 'us', label: 'USA' },
  'America/Los_Angeles': { code: 'us', label: 'USA' },
  'America/Sao_Paulo': { code: 'br', label: 'Brasile' },
  'America/Argentina/Buenos_Aires': { code: 'ar', label: 'Argentina' },
  'America/Mexico_City': { code: 'mx', label: 'Messico' },
  'America/Toronto': { code: 'ca', label: 'Canada' },
  'Asia/Tokyo': { code: 'jp', label: 'Giappone' },
  'Asia/Shanghai': { code: 'cn', label: 'Cina' },
  'Asia/Dubai': { code: 'ae', label: 'Emirati Arabi' },
  'Asia/Singapore': { code: 'sg', label: 'Singapore' },
  'Asia/Kolkata': { code: 'in', label: 'India' },
  'Australia/Sydney': { code: 'au', label: 'Australia' },
  'Australia/Perth': { code: 'au', label: 'Australia' },
  'Pacific/Auckland': { code: 'nz', label: 'Nuova Zelanda' },
  'Africa/Cairo': { code: 'eg', label: 'Egitto' },
  'Africa/Johannesburg': { code: 'za', label: 'Sudafrica' },
  'Africa/Lagos': { code: 'ng', label: 'Nigeria' },
  'Africa/Nairobi': { code: 'ke', label: 'Kenya' }
}

const getFlagData = (tz) => {
  return timezoneToCode[tz] || { code: '', label: tz || 'UTC' }
}

// Helper per configurazione axios con token
const api = () => {
  return axios.create({
    headers: {
      Authorization: `Bearer ${auth.token}`
    }
  })
}

async function fetchUsers() {
  loading.value = true
  error.value = null
  try {
    const { data } = await api().get('/api/admin/users')
    users.value = data
  } catch (e) {
    error.value = e.response?.data?.error || 'Errore nel caricamento utenti'
  } finally {
    loading.value = false
  }
}

async function handleToggleAdmin(user) {
  if (!confirm(`Vuoi davvero cambiare i permessi di ${user.username}?`)) return
  try {
    await api().patch(`/api/admin/users/${user.id}/admin`, {
      isAdmin: !user.isAdmin
    })
    await fetchUsers()
  } catch (e) {
    alert(e.response?.data?.error || 'Errore nella modifica permessi')
  }
}

async function handleDeleteUser(user) {
  if (!confirm(t('admin.delete_confirm'))) return
  try {
    await api().delete(`/api/admin/users/${user.id}`)
    await fetchUsers()
  } catch (e) {
    alert(e.response?.data?.error || 'Errore nell\'eliminazione utente')
  }
}

onMounted(fetchUsers)
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden">
      <div class="card-body p-6 relative">
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full"></div>
        
        <div class="flex items-center justify-between relative z-10">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-primary/10 rounded-3xl text-primary flex items-center justify-center text-2xl shadow-inner border border-primary/5">
              <i class="fi fi-sr-users-gear"></i>
            </div>
            <div>
              <h1 class="text-3xl font-black uppercase tracking-tight italic">{{ $t('admin.users_title').split(' ')[0] }} <span class="text-primary">{{ $t('admin.users_title').split(' ')[1] }}</span></h1>
              <p class="text-[10px] font-black opacity-40 uppercase tracking-[0.3em]">{{ $t('admin.users_subtitle') }}</p>
            </div>
          </div>
          <button @click="fetchUsers" :disabled="loading" class="btn btn-ghost btn-sm btn-circle">
            <i class="fi fi-sr-refresh text-xs" :class="{ 'animate-spin': loading }"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Lista Utenti -->
    <div v-if="error" class="alert alert-error shadow-lg border border-error/20 text-[10px] font-black uppercase tracking-widest py-3">
      <i class="fi fi-sr-exclamation"></i>
      <span>{{ error }}</span>
    </div>

    <div class="grid grid-cols-1 gap-4">
      <div v-if="loading && !users.length" class="flex justify-center p-12">
        <span class="loading loading-dots loading-lg text-primary"></span>
      </div>

      <div v-else-if="!users.length" class="card bg-base-100 p-12 text-center border border-base-content/5 opacity-30">
        <div class="text-[10px] font-black uppercase tracking-[0.2em]">Nessun utente registrato</div>
      </div>

      <div v-else v-for="user in users" :key="user.id" 
        class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden group hover:border-primary/30 transition-all duration-300"
        :class="{ 'ring-2 ring-primary ring-inset': user.id === auth.user?.id }">
        <div class="card-body p-5 md:flex-row md:items-center justify-between gap-6 relative">
          <!-- Decor interno hover -->
          <div class="absolute inset-0 bg-primary/0 group-hover:bg-primary/[0.02] transition-colors pointer-events-none"></div>
          
          <!-- Info Base -->
          <div class="flex items-center gap-4 flex-1 min-w-0 relative z-10">
            <div class="avatar avatar-placeholder relative">
              <div class="bg-base-200 text-base-content rounded-xl w-12 border border-base-content/10 group-hover:border-primary/30 transition-all">
                <span class="text-lg font-black uppercase">{{ user.username.substring(0, 2) }}</span>
              </div>
              <!-- Badge TU -->
              <div v-if="user.id === auth.user?.id" class="absolute -top-2 -left-2 badge badge-primary badge-xs font-black uppercase tracking-tighter py-2 border-2 border-base-100 scale-90">{{ $t('admin.current_user_badge') }}</div>
            </div>
            <div class="flex flex-col min-w-0">
              <div class="flex items-center gap-3">
                <span v-if="user.id === auth.user?.id" class="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest rounded-full border border-primary/20">TU</span>
                <span class="font-bold text-base-content/90">{{ user.username }}</span>
                <div v-if="user.isAdmin" class="badge badge-primary badge-xs font-black uppercase tracking-tighter py-2">{{ $t('admin.role_admin') }}</div>
                
                <!-- Bandiera con Tooltip -->
                <div class="tooltip tooltip-right" :data-tip="getFlagData(user.timezone).label">
                  <div v-if="getFlagData(user.timezone).code" class="w-6 h-4 overflow-hidden rounded-md shadow-sm border border-base-content/10 transition-all">
                    <img :src="`https://flagcdn.com/w40/${getFlagData(user.timezone).code}.png`" class="w-full h-full object-cover" />
                  </div>
                  <span v-else class="text-xs opacity-40">🌐</span>
                </div>
              </div>
              <span class="text-[10px] font-bold opacity-40 truncate">{{ user.email || $t('admin.no_email') }}</span>
            </div>
          </div>

          <!-- Dati Tecnici -->
          <div class="grid grid-cols-2 md:flex items-center gap-4 md:gap-8 relative z-10">
            <div class="flex flex-col">
              <span class="text-[8px] font-black uppercase opacity-30 tracking-widest mb-0.5">{{ $t('admin.registered_on') }}</span>
              <span class="text-[10px] font-bold">{{ new Date(user.created_at).toLocaleDateString() }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-[8px] font-black uppercase opacity-30 tracking-widest mb-0.5">Gluroo Sync</span>
              <div class="flex items-center gap-1.5">
                <div class="w-1.5 h-1.5 rounded-full" :class="user.gluroo_token ? 'bg-success' : 'bg-base-300'"></div>
                <span class="text-[10px] font-bold" :class="user.gluroo_token ? 'text-success' : 'opacity-30'">
                  {{ user.gluroo_token ? $t('admin.sync_active') : $t('admin.sync_off') }}
                </span>
              </div>
            </div>
          </div>

          <!-- Azioni -->
          <div class="flex items-center gap-2 relative z-10 border-t md:border-t-0 border-base-content/5 pt-4 md:pt-0 min-w-[160px] justify-end">
            <div class="w-28 flex justify-center">
              <button 
                @click="handleToggleAdmin(user)" 
                :disabled="user.id === auth.user?.id"
                class="btn btn-ghost btn-sm font-black uppercase text-[9px] tracking-widest hover:bg-primary/10 hover:text-primary disabled:opacity-20 w-full"
                :title="user.id === auth.user?.id ? 'Non puoi rimuovere i tuoi privilegi admin' : ''">
                {{ user.isAdmin ? $t('admin.remove_admin') : $t('admin.make_admin') }}
              </button>
            </div>
            <div class="divider divider-horizontal mx-0 opacity-10 hidden md:flex"></div>
            <button 
              @click="handleDeleteUser(user)" 
              :disabled="user.id === auth.user?.id"
              class="btn btn-ghost btn-sm btn-circle text-error/40 hover:text-error hover:bg-error/10 disabled:opacity-10"
              :title="user.id === auth.user?.id ? 'Non puoi eliminare il tuo account da qui' : $t('admin.delete_user')">
              <i class="fi fi-sr-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
