<template>
  <div class="flex flex-col gap-6">
    
    <!-- Header / Calendario -->
    <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden">
      <div class="card-body p-4 md:p-6 relative">
        <!-- Decor -->
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full"></div>
        
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-primary/10 rounded-2xl text-primary flex items-center justify-center text-xl">
              <i class="fi fi-sr-calendar"></i>
            </div>
            <div>
              <h2 class="text-lg font-black uppercase tracking-tight leading-none">{{ $t('calendar.title') }}</h2>
              <span class="text-[9px] font-black opacity-30 uppercase tracking-[0.2em]">{{ $t('calendar.subtitle') }}</span>
            </div>
          </div>
          
          <div class="flex items-center gap-2 bg-base-200 p-1.5 rounded-2xl border border-base-content/5">
            <button @click="changeDate(-1)" class="btn btn-ghost btn-xs btn-circle font-black">
              <i class="fi fi-sr-angle-left"></i>
            </button>
            <input 
              type="date" 
              v-model="selectedDate" 
              class="bg-transparent border-none text-xs font-black uppercase tracking-widest focus:ring-0 cursor-pointer px-2"
              @change="fetchDayData"
            />
            <button @click="changeDate(1)" class="btn btn-ghost btn-xs btn-circle font-black">
              <i class="fi fi-sr-angle-right"></i>
            </button>
            <div class="divider divider-horizontal mx-0 opacity-20"></div>
            <button @click="setToday" class="btn btn-ghost btn-xs px-2 font-black uppercase text-[8px] tracking-widest">{{ $t('calendar.today') }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Grafico del Giorno -->
    <div class="grid grid-cols-1">
      <GlucoseChart 
        :readings="store.historyReadings" 
        :insulin="store.historyInsulin"
        :carbs="store.historyCarbs"
        :notes="store.historyNotes"
        :title="$t('calendar.daily_trend', { date: formatDate(selectedDate) })"
        :loading="store.historyLoading"
        fullDay
        :date="selectedDate"
      />
    </div>

    <!-- Lista Insuline, Carboidrati e Note del Giorno -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <!-- Card Insuline -->
      <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden">
        <div class="card-body p-0">
          <div class="p-4 border-b border-base-content/5 flex items-center justify-between bg-primary/5">
            <div class="flex items-center gap-2">
              <span class="text-[10px] uppercase font-black tracking-widest opacity-60">{{ $t('calendar.insulin') }}</span>
              <span class="px-2 py-0.5 rounded-md bg-primary/10 text-[9px] font-black text-primary">{{ store.historyInsulin.length }}</span>
            </div>
            <button @click="startAdd('insulin')" class="btn btn-ghost btn-xs btn-circle text-primary">
              <i class="fi fi-sr-plus-small text-lg"></i>
            </button>
          </div>
          
          <div class="p-4 max-h-[250px] overflow-y-auto scrollbar-hide">
            <div v-if="store.historyLoading" class="flex flex-col gap-3">
              <div v-for="n in 3" :key="n" class="h-16 bg-base-200/30 rounded-2xl animate-pulse"></div>
            </div>
            <div v-else class="space-y-2">
              <div v-if="!store.historyInsulin.length" class="py-8 text-center opacity-20">
                <span class="text-[10px] font-black uppercase tracking-widest">{{ $t('calendar.no_data') }}</span>
              </div>
              <div 
                v-for="ins in sortedHistoryInsulin" 
                :key="ins.id"
                class="bg-base-200/50 p-3 rounded-2xl flex items-center justify-between border border-transparent hover:border-base-content/5 transition-all group"
              >
                <div class="flex items-center gap-4">
                  <div 
                    class="w-1 h-8 rounded-full" 
                    :class="ins.type === 'rapid' ? 'bg-primary' : 'bg-secondary'"
                  ></div>
                  <div class="flex flex-col">
                    <div class="flex items-center gap-2 leading-none">
                      <span class="text-sm font-black tracking-tight">{{ ins.units.toString().replace(',', '.') }}{{ $t('common.units') }}</span>
                      <span class="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-base-200 opacity-60">
                        {{ ins.type === 'rapid' ? $t('calendar.rapid') : $t('calendar.slow') }}
                      </span>
                    </div>
                    <span class="text-[9px] font-black opacity-30 uppercase tracking-wider mt-1">{{ formatTime(ins.timestamp) }}</span>
                  </div>
                </div>
                
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="startEdit('insulin', ins)" class="btn btn-ghost btn-xs btn-circle text-info">
                    <i class="fi fi-sr-pencil text-[10px]"></i>
                  </button>
                  <button @click="handleDelete('insulin', ins.id)" class="btn btn-ghost btn-xs btn-circle text-error">
                    <i class="fi fi-sr-trash text-[10px]"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card Carboidrati -->
      <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden">
        <div class="card-body p-0">
          <div class="p-4 border-b border-base-content/5 flex items-center justify-between bg-accent/5">
            <div class="flex items-center gap-2">
              <span class="text-[10px] uppercase font-black tracking-widest opacity-60">{{ $t('calendar.carbs') }}</span>
              <span class="px-2 py-0.5 rounded-md bg-accent/10 text-[9px] font-black text-accent">{{ store.historyCarbs.length }}</span>
            </div>
            <button @click="startAdd('carb')" class="btn btn-ghost btn-xs btn-circle text-accent">
              <i class="fi fi-sr-plus-small text-lg"></i>
            </button>
          </div>
          
          <div class="p-4 max-h-[250px] overflow-y-auto scrollbar-hide">
            <div v-if="store.historyLoading" class="flex flex-col gap-3">
              <div v-for="n in 3" :key="n" class="h-16 bg-base-200/30 rounded-2xl animate-pulse"></div>
            </div>
            <div v-else class="space-y-2">
              <div v-if="!store.historyCarbs.length" class="py-8 text-center opacity-20">
                <span class="text-[10px] font-black uppercase tracking-widest">{{ $t('calendar.no_data') }}</span>
              </div>
              <div 
                v-for="c in sortedHistoryCarbs" 
                :key="c.id"
                class="bg-base-200/50 p-3 rounded-2xl flex items-center justify-between border border-transparent hover:border-base-content/5 transition-all group"
              >
                <div class="flex items-center gap-4">
                  <div class="w-1 h-8 rounded-full bg-accent"></div>
                  <div class="flex flex-col">
                    <div class="flex items-center gap-2 leading-none">
                      <span class="text-sm font-black tracking-tight">{{ c.amount }}g</span>
                      <span class="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-base-200 opacity-60">
                        {{ $t('calendar.carbs_short') }}
                      </span>
                    </div>
                    <span class="text-[9px] font-black opacity-30 uppercase tracking-wider mt-1">{{ formatTime(c.timestamp) }}</span>
                  </div>
                </div>
                
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="startEdit('carb', c)" class="btn btn-ghost btn-xs btn-circle text-info">
                    <i class="fi fi-sr-pencil text-[10px]"></i>
                  </button>
                  <button @click="handleDelete('carb', c.id)" class="btn btn-ghost btn-xs btn-circle text-error">
                    <i class="fi fi-sr-trash text-[10px]"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card Note -->
      <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden">
        <div class="card-body p-0">
          <div class="p-4 border-b border-base-content/5 flex items-center justify-between bg-secondary/5">
            <div class="flex items-center gap-2">
              <span class="text-[10px] uppercase font-black tracking-widest opacity-60">{{ $t('calendar.notes') }}</span>
              <span class="px-2 py-0.5 rounded-md bg-secondary/10 text-[9px] font-black text-secondary">{{ store.historyNotes.length }}</span>
            </div>
            <button @click="startAdd('note')" class="btn btn-ghost btn-xs btn-circle text-secondary">
              <i class="fi fi-sr-plus-small text-lg"></i>
            </button>
          </div>
          
          <div class="p-4 max-h-[250px] overflow-y-auto scrollbar-hide">
            <div v-if="store.historyLoading" class="flex flex-col gap-3">
              <div v-for="n in 3" :key="n" class="h-16 bg-base-200/30 rounded-2xl animate-pulse"></div>
            </div>
            <div v-else class="space-y-2">
              <div v-if="!store.historyNotes.length" class="py-8 text-center opacity-20">
                <span class="text-[10px] font-black uppercase tracking-widest">{{ $t('calendar.no_data') }}</span>
              </div>
              <div 
                v-for="n in sortedHistoryNotes" 
                :key="n.id"
                class="bg-base-200/50 p-3 rounded-2xl flex flex-col gap-2 border border-transparent hover:border-base-content/5 transition-all group"
              >
                <div class="flex items-center justify-between">
                  <span class="text-[9px] font-black opacity-30 uppercase tracking-wider">{{ formatTime(n.timestamp) }}</span>
                  <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="startEdit('note', n)" class="btn btn-ghost btn-xs btn-circle text-info">
                      <i class="fi fi-sr-pencil text-[10px]"></i>
                    </button>
                    <button @click="handleDelete('note', n.id)" class="btn btn-ghost btn-xs btn-circle text-error">
                      <i class="fi fi-sr-trash text-[10px]"></i>
                    </button>
                  </div>
                </div>
                <p class="text-xs font-bold leading-relaxed opacity-80">{{ n.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistiche (come homepage) -->
    <div class="w-full relative">
      <div v-if="store.historyLoading" class="absolute inset-0 z-10 bg-base-200/50 backdrop-blur-[2px] rounded-2xl flex items-center justify-center">
        <span class="loading loading-dots loading-md text-primary"></span>
      </div>
      <DailyStats :stats="store.historyStats" />
    </div>

    <!-- Modal Modifica / Aggiunta -->
    <dialog id="edit_modal" class="modal">
      <div class="modal-box bg-base-200 border border-base-content/10 shadow-2xl rounded-3xl p-6">
        <h3 class="font-black text-lg uppercase italic tracking-tight mb-4 flex items-center gap-2">
          <i class="fi" :class="isEditing ? 'fi-sr-pencil text-primary' : 'fi-sr-plus text-success'"></i> 
          {{ isEditing ? $t('common.edit') : $t('common.add') }} {{ $t('calendar.record') }}
        </h3>
        
        <div v-if="editingItem" class="space-y-4">
          <!-- Modifica Insulina -->
          <template v-if="editingItem.type === 'insulin'">
            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-black uppercase opacity-40">{{ $t('calendar.units_label') }}</label>
              <input 
                type="number" 
                step="0.5" 
                v-model="editForm.units" 
                class="input bg-base-300/50 font-black text-xl"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-black uppercase opacity-40">{{ $t('calendar.type_label') }}</label>
              <select v-model="editForm.insulinType" class="select bg-base-300/50 font-black">
                <option value="rapid">{{ $t('calendar.rapid') }}</option>
                <option value="slow">{{ $t('calendar.slow') }}</option>
              </select>
            </div>
          </template>

          <!-- Modifica Carboidrati -->
          <template v-else-if="editingItem.type === 'carb'">
            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-black uppercase opacity-40">{{ $t('calendar.amount_label') }}</label>
              <input 
                type="number" 
                v-model="editForm.amount" 
                class="input bg-base-300/50 font-black text-xl"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-black uppercase opacity-40">{{ $t('calendar.absorption_speed') }}</label>
              <div class="flex items-center gap-1 bg-base-300 p-1 rounded-xl">
                <button 
                  v-for="s in ['fast', 'normal', 'slow']" 
                  :key="s"
                  @click="editForm.speed = s"
                  class="btn btn-xs flex-1 rounded-lg border-none font-black text-[9px] uppercase tracking-tighter h-8 transition-all"
                  :class="editForm.speed === s ? 'bg-accent text-accent-content shadow-md' : 'btn-ghost opacity-40 hover:opacity-100'"
                >
                  {{ s === 'fast' ? $t('calendar.fast') : s === 'normal' ? $t('calendar.medium') : $t('calendar.slow') }}
                </button>
              </div>
            </div>
          </template>

          <!-- Modifica Nota -->
          <template v-else-if="editingItem.type === 'note'">
            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-black uppercase opacity-40">{{ $t('calendar.note_text_label') }}</label>
              <textarea 
                v-model="editForm.text" 
                class="textarea bg-base-300/50 font-bold h-24"
              ></textarea>
            </div>
          </template>

          <!-- Modifica Ora (comune) -->
          <div class="flex flex-col gap-2">
            <label class="text-[10px] font-black uppercase opacity-40">{{ $t('calendar.time_label') }}</label>
            <input 
              type="time" 
              v-model="editForm.time" 
              class="input bg-base-300/50 font-black"
            />
          </div>
        </div>

        <div class="modal-action gap-2">
          <form method="dialog">
            <button class="btn btn-ghost uppercase font-black text-xs">{{ $t('common.cancel') }}</button>
          </form>
          <button 
            @click="handleSave" 
            class="btn btn-primary uppercase font-black text-xs px-8"
            :disabled="store.loading"
          >
            {{ $t('common.save') }}
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { useGlucoseStore } from '../stores/glucose'
import GlucoseChart from '../components/GlucoseChart.vue'
import DailyStats from '../components/DailyStats.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useGlucoseStore()

// ── Gestione Modifica / Aggiunta ───────────────────────────────────────────
const editingItem = ref(null)
const isEditing = ref(false)
const editForm = reactive({
  id: null,
  units: 1,
  insulinType: 'rapid',
  amount: 10,
  speed: 'normal',
  text: '',
  time: '',
  originalTimestamp: ''
})

function startEdit(type, item) {
  isEditing.value = true
  editingItem.value = { type, ...item }
  editForm.id = item.id
  editForm.time = formatTime24h(item.timestamp)
  editForm.originalTimestamp = item.timestamp
  
  if (type === 'insulin') {
    editForm.units = item.units
    editForm.insulinType = item.type
  } else if (type === 'carb') {
    editForm.amount = item.amount
    editForm.speed = item.speed || 'normal'
  } else if (type === 'note') {
    editForm.text = item.text
  }
  
  document.getElementById('edit_modal').showModal()
}

function startAdd(type) {
  isEditing.value = false
  editingItem.value = { type }
  editForm.id = null
  
  // Imposta l'orario attuale se è oggi, altrimenti le 12:00 del giorno selezionato
  const now = new Date()
  const isToday = selectedDate.value === getLocalDateString(now)
  editForm.time = isToday ? formatTime24h(now.toISOString()) : '12:00'
  
  // Usa il giorno selezionato nel calendario
  const baseDate = new Date(selectedDate.value)
  editForm.originalTimestamp = baseDate.toISOString()
  
  if (type === 'insulin') {
    editForm.units = 1
    editForm.insulinType = 'rapid'
  } else if (type === 'carb') {
    editForm.amount = 10
    editForm.speed = 'normal'
  } else if (type === 'note') {
    editForm.text = ''
  }
  
  document.getElementById('edit_modal').showModal()
}

async function handleSave() {
  if (!editingItem.value) return
  
  const [hours, minutes] = editForm.time.split(':')
  const newDate = new Date(editForm.originalTimestamp)
  newDate.setHours(parseInt(hours), parseInt(minutes), 0)
  const timestamp = newDate.toISOString()
  
  try {
    if (editingItem.value.type === 'insulin') {
      if (isEditing.value) {
        await store.editInsulin(editForm.id, { 
          timestamp, 
          type: editForm.insulinType, 
          units: parseFloat(editForm.units) 
        })
      } else {
        await store.addInsulin(editForm.insulinType, parseFloat(editForm.units), timestamp)
      }
    } else if (editingItem.value.type === 'carb') {
      if (isEditing.value) {
        await store.editCarb(editForm.id, { 
          timestamp, 
          amount: parseInt(editForm.amount),
          speed: editForm.speed
        })
      } else {
        await store.addCarb(parseInt(editForm.amount), timestamp, editForm.speed)
      }
    } else if (editingItem.value.type === 'note') {
      if (isEditing.value) {
        await store.editNote(editForm.id, { 
          timestamp, 
          text: editForm.text 
        })
      } else {
        await store.addNote(editForm.text, timestamp)
      }
    }
    
    document.getElementById('edit_modal').close()
    await fetchDayData() // Rinfresca il calendario
  } catch (err) {
    console.error('Errore durante il salvataggio:', err)
  }
}

async function handleDelete(type, id) {
  if (!confirm(t('common.confirm_delete'))) return
  
  try {
    if (type === 'insulin') await store.removeInsulin(id)
    else if (type === 'carb') await store.removeCarb(id)
    else if (type === 'note') await store.removeNote(id)
    
    await fetchDayData() // Rinfresca il calendario
  } catch (err) {
    console.error('Errore durante l\'eliminazione:', err)
  }
}

function formatTime24h(iso) {
  const d = new Date(iso)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const selectedDate = ref(getLocalDateString())

const sortedHistoryInsulin = computed(() => {
  return [...store.historyInsulin].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
})

const sortedHistoryCarbs = computed(() => {
  return [...store.historyCarbs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
})

const sortedHistoryNotes = computed(() => {
  return [...store.historyNotes].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
})

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })
}

function changeDate(days) {
  const d = new Date(selectedDate.value)
  d.setDate(d.getDate() + days)
  selectedDate.value = getLocalDateString(d)
  fetchDayData()
}

function setToday() {
  selectedDate.value = getLocalDateString()
  fetchDayData()
}

async function fetchDayData() {
  await store.fetchHistory(selectedDate.value)
}

onMounted(() => {
  fetchDayData()
})
</script>
