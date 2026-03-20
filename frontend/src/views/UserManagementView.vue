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
    <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden">
      <div class="card-body p-6 relative">
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full"></div>
        
        <div class="flex items-center justify-between relative z-10">
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
        class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden group hover:border-primary/30 transition-all duration-300">
        <div class="card-body p-5 md:flex-row md:items-center justify-between gap-6 relative">
          <!-- Decor interno hover -->
          <div class="absolute inset-0 bg-primary/0 group-hover:bg-primary/[0.02] transition-colors pointer-events-none"></div>
          
          <!-- Info Base -->
          <div class="flex items-center gap-4 flex-1 min-w-0 relative z-10">
            <div class="avatar avatar-placeholder">
              <div class="bg-base-200 text-base-content rounded-xl w-12 border border-base-content/10 group-hover:border-primary/30 transition-all">
                <span class="text-lg font-black uppercase">{{ user.username.substring(0, 2) }}</span>
              </div>
            </div>
            <div class="flex flex-col min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="font-black text-sm uppercase tracking-tight truncate">{{ user.username }}</h3>
                <div v-if="user.isAdmin" class="badge badge-primary badge-xs font-black uppercase tracking-tighter py-2">Admin</div>
              </div>
              <span class="text-[10px] font-bold opacity-40 truncate">{{ user.email || 'Nessuna Email' }}</span>
            </div>
          </div>

          <!-- Dati Tecnici -->
          <div class="grid grid-cols-2 md:flex items-center gap-4 md:gap-8 relative z-10">
            <div class="flex flex-col">
              <span class="text-[8px] font-black uppercase opacity-30 tracking-widest mb-0.5">Registrato il</span>
              <span class="text-[10px] font-bold">{{ new Date(user.created_at).toLocaleDateString() }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-[8px] font-black uppercase opacity-30 tracking-widest mb-0.5">Gluroo Sync</span>
              <div class="flex items-center gap-1.5">
                <div class="w-1.5 h-1.5 rounded-full" :class="user.gluroo_token ? 'bg-success' : 'bg-base-300'"></div>
                <span class="text-[10px] font-bold" :class="user.gluroo_token ? 'text-success' : 'opacity-30'">
                  {{ user.gluroo_token ? 'Attiva' : 'Off' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Azioni -->
          <div class="flex items-center gap-2 relative z-10 border-t md:border-t-0 border-base-content/5 pt-4 md:pt-0">
            <button @click="handleToggleAdmin(user)" 
              class="btn btn-ghost btn-sm font-black uppercase text-[9px] tracking-widest hover:bg-primary/10 hover:text-primary">
              {{ user.isAdmin ? 'Rimuovi Admin' : 'Rendi Admin' }}
            </button>
            <div class="divider divider-horizontal mx-0 opacity-10 hidden md:flex"></div>
            <button @click="handleDeleteUser(user)" 
              class="btn btn-ghost btn-sm btn-circle text-error/40 hover:text-error hover:bg-error/10"
              title="Elimina Utente">
              <i class="fi fi-sr-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
