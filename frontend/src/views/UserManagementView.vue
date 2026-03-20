<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

const auth = useAuthStore()
const users = ref([])
const loading = ref(false)
const error = ref(null)

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
  if (!confirm(`ATTENZIONE: Stai per eliminare DEFINITIVAMENTE l'utente ${user.username} e TUTTI i suoi dati (glicemie, insuline, ecc.). Procedere?`)) return
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
    <div class="card bg-base-200 shadow-xl border border-base-content/5">
      <div class="card-body p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-primary/10 rounded-2xl">
              <i class="fi fi-sr-users-gear text-primary text-xl"></i>
            </div>
            <div>
              <h2 class="text-lg font-black uppercase tracking-tight leading-none">Gestione Utenti</h2>
              <span class="text-[9px] font-black opacity-30 uppercase tracking-[0.2em]">Amministrazione Piattaforma</span>
            </div>
          </div>
          <button @click="fetchUsers" :disabled="loading" class="btn btn-ghost btn-sm btn-circle">
            <i class="fi fi-sr-refresh text-xs" :class="{ 'animate-spin': loading }"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Lista Utenti -->
    <div v-if="error" class="alert alert-error shadow-lg">
      <i class="fi fi-sr-exclamation text-sm"></i>
      <span class="text-xs font-black uppercase tracking-widest">{{ error }}</span>
    </div>

    <div class="grid grid-cols-1 gap-4">
      <div v-if="loading && !users.length" class="flex justify-center p-12">
        <span class="loading loading-dots loading-lg text-primary"></span>
      </div>

      <div v-else-if="!users.length" class="card bg-base-200 p-12 text-center opacity-30">
        <div class="text-xs font-black uppercase tracking-widest">Nessun utente registrato</div>
      </div>

      <div v-else v-for="user in users" :key="user.id" 
        class="card bg-base-200 shadow-lg border border-base-content/5 overflow-hidden group hover:border-primary/30 transition-all duration-300">
        <div class="card-body p-5 md:flex-row md:items-center justify-between gap-6">
          <!-- Info Base -->
          <div class="flex items-center gap-4 flex-1 min-w-0">
            <div class="avatar avatar-placeholder">
              <div class="bg-primary/10 text-primary rounded-xl w-12 h-12 border border-primary/20">
                <span class="text-lg font-black uppercase">{{ user.username.charAt(0) }}</span>
              </div>
            </div>
            <div class="flex flex-col min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-base font-black uppercase tracking-tight truncate">{{ user.username }}</span>
                <div v-if="user.isAdmin" class="badge badge-primary badge-xs font-black uppercase text-[7px] tracking-widest">Admin</div>
                <div v-if="user.id === auth.user.id" class="badge badge-ghost badge-xs font-black uppercase text-[7px] tracking-widest opacity-50">Tu</div>
              </div>
              <span class="text-[9px] font-bold opacity-30 uppercase tracking-widest">ID: {{ user.id }} • Creato il: {{ new Date(user.created_at).toLocaleDateString() }}</span>
            </div>
          </div>

          <!-- Status Gluroo -->
          <div class="flex flex-col gap-1 px-4 border-l border-base-content/5">
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full" 
                :class="user.gluroo_token ? 'bg-success' : 'bg-error'"></div>
              <span class="text-[9px] font-black uppercase tracking-widest opacity-50">Configurazione Gluroo</span>
            </div>
            <div v-if="user.last_sync_error" class="text-[8px] font-bold text-warning uppercase truncate max-w-[200px]">
              {{ user.last_sync_error }}
            </div>
            <div v-else-if="user.gluroo_token" class="text-[8px] font-bold text-success uppercase">
              Sincronizzazione OK
            </div>
            <div v-else class="text-[8px] font-bold opacity-30 uppercase italic">
              Non configurato
            </div>
          </div>

          <!-- Azioni -->
          <div class="flex items-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-base-content/5">
            <button 
              @click="handleToggleAdmin(user)"
              :disabled="user.id === auth.user.id"
              class="btn btn-sm flex-1 md:flex-none btn-ghost hover:bg-primary/10 hover:text-primary rounded-xl font-black uppercase tracking-widest text-[9px]"
              :title="user.isAdmin ? 'Rimuovi Admin' : 'Rendi Admin'"
            >
              <i class="fi" :class="user.isAdmin ? 'fi-sr-user' : 'fi-sr-shield-check'"></i>
              {{ user.isAdmin ? 'Rendi Utente' : 'Rendi Admin' }}
            </button>
            <button 
              @click="handleDeleteUser(user)"
              :disabled="user.id === auth.user.id"
              class="btn btn-sm btn-ghost hover:bg-error/10 hover:text-error rounded-xl font-black uppercase tracking-widest text-[9px]"
              title="Elimina Utente"
            >
              <i class="fi fi-sr-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
