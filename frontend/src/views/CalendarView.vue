<template>
  <div class="flex flex-col gap-6">
    
    <!-- Header / Calendario -->
    <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden">
      <div class="card-body p-4 md:p-6 relative">
        <!-- Decor -->
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full"></div>
        
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-primary/10 rounded-3xl text-primary flex items-center justify-center text-2xl shadow-inner border border-primary/5">
              <i class="fi fi-sr-calendar-clock"></i>
            </div>
            <div>
              <h1 class="text-3xl font-black uppercase tracking-tight italic">{{ $t('calendar.title').split(' ')[0] }} <span class="text-primary">{{ $t('calendar.title').split(' ')[1] }}</span></h1>
              <p class="text-[10px] font-black opacity-40 uppercase tracking-[0.3em]">{{ $t('calendar.subtitle') }}</p>
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
              <span class="text-[10px] uppercase font-black tracking-widest opacity-60">{{ $t('calendar.insulin_short') }}</span>
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
                <i class="fi fi-sr-box-open text-3xl mb-2 block"></i>
                <span class="text-[10px] font-black uppercase tracking-widest">{{ $t('calendar.no_records') }}</span>
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
              <span class="text-[10px] uppercase font-black tracking-widest opacity-60">{{ $t('calendar.carbs_short') }}</span>
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
                <i class="fi fi-sr-box-open text-3xl mb-2 block"></i>
                <span class="text-[10px] font-black uppercase tracking-widest">{{ $t('calendar.no_records') }}</span>
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
              <span class="text-[10px] uppercase font-black tracking-widest opacity-60">{{ $t('calendar.notes_short') }}</span>
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
                <i class="fi fi-sr-box-open text-3xl mb-2 block"></i>
                <span class="text-[10px] font-black uppercase tracking-widest">{{ $t('calendar.no_records') }}</span>
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
      <div class="modal-box bg-base-100 border border-base-content/10 p-8 rounded-3xl shadow-2xl relative overflow-visible">
        <h3 class="text-xl font-black uppercase italic tracking-tight mb-8">
          {{ isEditing ? $t('calendar.edit_title') : $t('calendar.add_record') }}
        </h3>

        <div v-if="editingItem" class="space-y-6">
          <!-- Orario -->
          <div class="form-control">
            <label class="label py-1 flex justify-between items-end">
              <span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('calendar.time_label') }}</span>
              <span class="text-[10px] font-black text-base-content opacity-20 tracking-widest">FORMATO 24H</span>
            </label>
            <input type="time" v-model="editForm.time" class="input input-bordered w-full font-black text-2xl bg-base-200/30 focus:border-base-content/20 focus:ring-2 focus:ring-base-content/5 transition-all" />
          </div>

          <!-- Modifica Insulina -->
          <template v-if="editingItem.itemType === 'insulin'">
            <div class="form-control">
              <label class="label py-1 flex justify-between items-end">
                <span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('calendar.units_label') }}</span>
                <span class="text-[10px] font-black text-primary opacity-40 tracking-widest">UNITÀ (U)</span>
              </label>
              <input type="number" step="0.5" v-model.number="editForm.units" class="input input-bordered w-full font-black text-2xl bg-base-200/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
            <div class="form-control mt-4">
              <label class="label py-1"><span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('calendar.type_label') }}</span></label>
              <div class="grid grid-cols-2 gap-2">
                <button 
                  @click="editForm.insulinType = 'rapid'"
                  class="btn btn-sm h-12 rounded-xl font-black uppercase tracking-widest transition-all"
                  :class="editForm.insulinType === 'rapid' ? 'btn-primary border-2' : 'btn-ghost bg-base-200/50 opacity-40'"
                >
                  {{ $t('common.rapid') }}
                </button>
                <button 
                  @click="editForm.insulinType = 'slow'"
                  class="btn btn-sm h-12 rounded-xl font-black uppercase tracking-widest transition-all"
                  :class="editForm.insulinType === 'slow' ? 'btn-secondary border-2' : 'btn-ghost bg-base-200/50 opacity-40'"
                >
                  {{ $t('common.slow') }}
                </button>
              </div>
            </div>
          </template>

          <!-- Modifica Carboidrati -->
          <template v-else-if="editingItem.itemType === 'carb'">
            <div class="form-control">
              <label class="label py-1 flex justify-between items-end">
                <span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('calendar.amount_label') }}</span>
                <span class="text-[10px] font-black text-accent opacity-40 tracking-widest">GRAMMI (g)</span>
              </label>
              <input type="number" v-model.number="editForm.amount" class="input input-bordered w-full font-black text-2xl bg-base-200/30 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all" />
            </div>
            <div class="form-control mt-4">
              <label class="label py-1"><span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('calendar.absorption_label') }}</span></label>
              <div class="grid grid-cols-3 gap-2">
                <button 
                  v-for="s in ['fast', 'normal', 'slow']" 
                  :key="s"
                  @click="editForm.speed = s"
                  class="btn btn-xs h-10 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all"
                  :class="editForm.speed === s ? 'btn-accent border-2' : 'btn-ghost bg-base-200/50 opacity-40'"
                >
                  {{ $t(`calendar.${s}`) }}
                </button>
              </div>
            </div>
          </template>

          <!-- Modifica Nota -->
          <template v-else-if="editingItem.itemType === 'note'">
            <div class="form-control">
              <label class="label py-1 flex justify-between items-end">
                <span class="label-text text-[10px] font-black uppercase opacity-40">{{ $t('common.notes') }}</span>
                <span class="text-[10px] font-black text-secondary opacity-40 tracking-widest">TESTO LIBERO</span>
              </label>
              <textarea v-model="editForm.text" class="textarea textarea-bordered font-bold h-24 bg-base-200/30 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"></textarea>
            </div>
          </template>
        </div>

        <div class="modal-action flex justify-between mt-10">
          <button v-if="isEditing" @click="handleDelete(editingItem.itemType, editForm.id)" class="btn btn-error btn-ghost font-black uppercase tracking-widest px-6">
            {{ $t('calendar.delete_button') }}
          </button>
          <div v-else></div>
          
          <div class="flex gap-2">
            <form method="dialog">
              <button class="btn btn-ghost font-black uppercase tracking-widest">{{ $t('common.cancel') }}</button>
            </form>
            <button @click="handleSave" class="btn btn-primary font-black uppercase tracking-widest px-8 shadow-xl shadow-primary/20">
              {{ $t('calendar.save_button') }}
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import { useGlucoseStore } from '../stores/glucose'
import { useAuthStore } from '../stores/auth'
import GlucoseChart from '../components/GlucoseChart.vue'
import DailyStats from '../components/DailyStats.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useGlucoseStore()
const auth = useAuthStore()

const timezone = computed(() => auth.user?.timezone || 'Europe/Rome')



// ── Gestione Modifica / Aggiunta ───────────────────────────────────────────
const editingItem = ref<any>(null)
const isEditing = ref(false)
const editForm = reactive({
  id: null as number | null,
  units: 1,
  insulinType: 'rapid',
  amount: 10,
  speed: 'normal',
  text: '',
  time: '',
  originalTimestamp: ''
})

function startEdit(type: string, item: any) {
  isEditing.value = true
  editingItem.value = { itemType: type, ...item }
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
  
  const modal = document.getElementById('edit_modal') as HTMLDialogElement
  if (modal) modal.showModal()
}

function startAdd(type: string) {
  isEditing.value = false
  editingItem.value = { itemType: type }
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
  
  const modal = document.getElementById('edit_modal') as HTMLDialogElement
  if (modal) modal.showModal()
}

async function handleSave() {
  if (!editingItem.value) return
  
  const [hours, minutes] = editForm.time.split(':')
  const newDate = new Date(editForm.originalTimestamp)
  newDate.setHours(parseInt(hours), parseInt(minutes), 0)
  const timestamp = newDate.toISOString()
  
  try {
    if (editingItem.value.itemType === 'insulin') {
      if (isEditing.value) {
        await store.editInsulin(editForm.id!, { 
          timestamp, 
          type: editForm.insulinType, 
          units: parseFloat(editForm.units.toString()) 
        })
      } else {
        await store.addInsulin(editForm.insulinType, parseFloat(editForm.units.toString()), timestamp)
      }
    } else if (editingItem.value.itemType === 'carb') {
      if (isEditing.value) {
        await store.editCarb(editForm.id!, { 
          timestamp, 
          amount: parseInt(editForm.amount.toString()),
          speed: editForm.speed
        })
      } else {
        await store.addCarb(parseInt(editForm.amount.toString()), timestamp, editForm.speed)
      }
    } else if (editingItem.value.itemType === 'note') {
      if (isEditing.value) {
        await store.editNote(editForm.id!, { 
          timestamp, 
          text: editForm.text 
        })
      } else {
        await store.addNote(editForm.text, timestamp)
      }
    }
    
    const modal = document.getElementById('edit_modal') as HTMLDialogElement
    if (modal) modal.close()
    await fetchDayData() // Rinfresca il calendario
  } catch (err) {
    console.error('Errore durante il salvataggio:', err)
  }
}

async function handleDelete(type: string, id: number) {
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

function formatTime24h(iso: string) {
  return new Intl.DateTimeFormat('it-IT', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false,
    timeZone: timezone.value 
  }).format(new Date(iso))
}

function getLocalDateString(date = new Date()) {
  // Use user's timezone to get the current date string
  const d = new Intl.DateTimeFormat('en-CA', { 
    timeZone: timezone.value,
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(date)
  return d
}

const selectedDate = ref(getLocalDateString())

const sortedHistoryInsulin = computed(() => {
  return [...store.historyInsulin].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
})

const sortedHistoryCarbs = computed(() => {
  return [...store.historyCarbs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
})

const sortedHistoryNotes = computed(() => {
  return [...store.historyNotes].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
})

function formatTime(iso: string) {
  return new Intl.DateTimeFormat('it-IT', { 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: timezone.value
  }).format(new Date(iso))
}

function formatDate(dateStr: string) {
  // dateStr is "YYYY-MM-DD", we want to format it nicely.
  // We can create a date at noon in that timezone to avoid issues.
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })
}

function changeDate(days: number) {
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

// ── Funzioni ──────────────────────────────────────────────────────────
</script>
