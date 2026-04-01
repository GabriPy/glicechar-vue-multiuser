<template>
  <div class="space-y-10 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div class="space-y-2">
        <div class="flex items-center gap-3">
          <div class="w-2 h-8 bg-secondary rounded-full"></div>
          <h1 class="text-4xl font-black uppercase tracking-tighter italic">{{ $t('support.admin_title') }}</h1>
        </div>
        <p class="text-sm font-bold opacity-40 uppercase tracking-widest ml-5">Gestione richieste assistenza</p>
      </div>
      
      <div class="badge badge-secondary badge-outline font-black uppercase tracking-widest px-4 py-3 h-auto">
        {{ messages.length }} Messaggi
      </div>
    </div>

    <!-- Messages List -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 opacity-20">
      <span class="loading loading-spinner loading-lg mb-4 text-primary"></span>
      <span class="text-[10px] font-black uppercase tracking-[0.4em]">Caricamento messaggi...</span>
    </div>

    <div v-else-if="messages.length === 0" class="card bg-base-200/30 border border-dashed border-base-content/10 rounded-[3rem] p-20 text-center">
      <div class="w-20 h-20 bg-base-100 rounded-full flex items-center justify-center text-base-content/10 text-4xl mx-auto mb-6">
        <i class="fi fi-sr-envelope-open"></i>
      </div>
      <p class="font-black uppercase tracking-widest opacity-20 text-sm">{{ $t('support.admin_no_messages') }}</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-6">
      <div v-for="msg in messages" :key="messages.id" class="card bg-base-200/50 backdrop-blur-xl border border-base-content/5 rounded-[2.5rem] overflow-hidden group hover:border-primary/20 transition-all duration-500">
        <div class="card-body p-8 md:p-10">
          <div class="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <!-- Content -->
            <div class="flex-1 space-y-6">
              <div class="flex flex-wrap items-center gap-4">
                <div class="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl">
                  <i class="fi fi-sr-user text-primary text-xs"></i>
                  <span class="text-[10px] font-black uppercase tracking-widest text-primary">{{ msg.email }}</span>
                </div>
                <div class="flex items-center gap-2 px-4 py-2 bg-base-100 rounded-xl border border-base-content/5">
                  <i class="fi fi-sr-calendar-clock opacity-30 text-xs"></i>
                  <span class="text-[10px] font-black uppercase tracking-widest opacity-40">{{ formatDate(msg.created_at) }}</span>
                </div>
              </div>

              <div class="space-y-3">
                <h3 class="text-xl font-black uppercase tracking-tight italic">{{ msg.subject }}</h3>
                <p class="font-bold opacity-60 leading-relaxed text-sm bg-base-100/50 p-6 rounded-3xl border border-base-content/5">
                  {{ msg.message }}
                </p>
              </div>
            </div>

            <!-- Actions -->
            <div class="shrink-0">
              <button 
                @click="confirmDelete(msg.id)" 
                class="btn btn-ghost btn-circle text-error hover:bg-error/10 transition-all group/del"
                :title="$t('common.delete')"
              >
                <i class="fi fi-sr-trash-x text-lg group-hover/del:scale-110 transition-transform"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <dialog id="delete_modal" class="modal modal-bottom sm:modal-middle backdrop-blur-md">
      <div class="modal-box bg-base-300/90 border border-white/5 rounded-[3rem] p-10">
        <div class="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center text-error text-2xl mx-auto mb-6">
          <i class="fi fi-sr-exclamation"></i>
        </div>
        <h3 class="text-2xl font-black uppercase tracking-tighter italic text-center mb-4">Conferma Eliminazione</h3>
        <p class="font-bold opacity-50 text-center mb-10 leading-relaxed">{{ $t('support.admin_delete_confirm') }}</p>
        
        <div class="flex flex-col sm:flex-row gap-4">
          <form method="dialog" class="flex-1">
            <button class="btn btn-ghost w-full rounded-2xl font-black uppercase tracking-widest text-[10px]">Annulla</button>
          </form>
          <button @click="handleDelete" class="btn btn-error flex-1 rounded-2xl font-black uppercase tracking-widest text-[10px] border-none shadow-lg shadow-error/20">Elimina Definitivamente</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop bg-black/40">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const messages = ref<any[]>([])
const loading = ref(true)
const selectedId = ref<number | null>(null)

async function fetchMessages() {
  loading.value = true
  try {
    const res = await axios.get('/api/admin/support-messages')
    messages.value = res.data
  } catch (e) {
    console.error('Errore caricamento messaggi:', e)
  } finally {
    loading.value = false
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function confirmDelete(id: number) {
  selectedId.value = id
  const modal = document.getElementById('delete_modal') as HTMLDialogElement
  modal?.showModal()
}

async function handleDelete() {
  if (!selectedId.value) return
  
  try {
    await axios.delete(`/api/admin/support-messages/${selectedId.value}`)
    messages.value = messages.value.filter(m => m.id !== selectedId.value)
    const modal = document.getElementById('delete_modal') as HTMLDialogElement
    modal?.close()
  } catch (e) {
    console.error('Errore eliminazione:', e)
  } finally {
    selectedId.value = null
  }
}

onMounted(fetchMessages)
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
