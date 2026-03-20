<template>
  <div class="card bg-base-200 shadow-sm border border-base-content/10 h-full">
    <div class="card-body gap-4">

      <!-- Header -->
      <div class="flex items-center justify-between flex-wrap gap-2">
        <span class="text-xs uppercase tracking-widest opacity-50">{{ title }}</span>
        <div v-if="!isHistory" class="join">
          <button
            v-for="opt in ranges" :key="opt.v"
            class="join-item btn btn-xs"
            :class="store.selectedRange === opt.v ? 'btn-primary' : 'btn-ghost opacity-60'"
            @click="store.setRange(opt.v)"
          >{{ opt.l }}</button>
        </div>
      </div>

      <!-- Nessun dato (mostra solo se non siamo in fullDay/Calendario) -->
      <div v-if="!displayReadings.length && !loading && !fullDay" class="flex justify-center items-center py-16 opacity-30 text-sm">
        Nessun dato
      </div>

      <!-- Grafico (Sempre visibile se fullDay, altrimenti se ci sono dati o caricamento) -->
      <div v-else class="relative h-[300px] w-full">
        <!-- Overlay caricamento per evitare flicker -->
        <div v-if="loading" class="absolute inset-0 z-10 flex items-center justify-center bg-base-200/50 backdrop-blur-[1px] transition-all rounded-xl">
          <span class="loading loading-spinner loading-md text-primary"></span>
        </div>
        <Line :data="chartData" :options="chartOptions" />
      </div>

      <!-- Legenda Insuline e Carboidrati -->
      <div class="flex flex-wrap items-center justify-center gap-6 mt-2">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-sm bg-[#6366f1] opacity-30"></div>
          <span class="text-[9px] font-black uppercase tracking-widest opacity-40">Azione Rapida</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-sm bg-[#ec4899] opacity-30"></div>
          <span class="text-[9px] font-black uppercase tracking-widest opacity-40">Azione Lenta</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-[#d97706]"></div>
          <span class="text-[9px] font-black uppercase tracking-widest opacity-40">Carboidrati (CHO)</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-[#0ea5e9]"></div>
          <span class="text-[9px] font-black uppercase tracking-widest opacity-40">Note</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-sm bg-[#94a3b8] opacity-30"></div>
          <span class="text-[9px] font-black uppercase tracking-widest opacity-40">Gap Dati</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Tooltip, Filler,
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import { useGlucoseStore } from '../stores/glucose'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, annotationPlugin)

const props = defineProps({
  readings: { type: Array, default: null },
  insulin: { type: Array, default: null },
  carbs: { type: Array, default: null },
  notes: { type: Array, default: null },
  title: { type: String, default: 'Storico' },
  loading: { type: Boolean, default: false },
  fullDay: { type: Boolean, default: false },
  date: { type: String, default: null }
})

const store = useGlucoseStore()

const isHistory = computed(() => props.readings !== null)
const displayReadings = computed(() => props.readings || store.readings)
const displayInsulin = computed(() => props.insulin || store.insulinRecords)
const displayCarbs = computed(() => props.carbs || store.carbRecords)
const displayNotes = computed(() => props.notes || store.notes)
const loading = computed(() => props.loading || store.chartLoading)

const ranges = [
  { l: '1h',  v: 60 },
  { l: '3h',  v: 180 },
  { l: '6h',  v: 360 },
  { l: '24h', v: 1440 },
]

function fmtLabel(iso) {
  return new Date(iso).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
}

function ptColor(g) {
  const status = store.getStatusColor(g)
  if (status === 'text-error')   return '#ef4444' // Rosso
  if (status === 'text-warning') return '#f59e0b' // Giallo
  return '#22c55e' // Verde
}

const chartData = computed(() => ({
  datasets: [{
    data:               displayReadings.value.map(r => ({
      x: new Date(r.timestamp).getTime(),
      y: r.glucose
    })),
    borderColor:        'rgba(99,102,241,0.3)',
    backgroundColor:    'rgba(99,102,241,0.06)',
    pointBackgroundColor: displayReadings.value.map(r => ptColor(r.glucose)),
    pointBorderColor:   displayReadings.value.map(r => ptColor(r.glucose)),
    pointRadius:        displayReadings.value.length > 150 ? 2 : 3,
    pointHoverRadius:   6,
    tension:            0.35,
    fill:               true,
  }]
}))

const isToday = computed(() => {
    if (!props.date) return false
    const d = new Date()
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return props.date === `${year}-${month}-${day}`
  })

  const chartOptions = computed(() => {
    const maxReading = displayReadings.value.length > 0 
      ? Math.max(...displayReadings.value.map(r => r.glucose)) 
      : 300
    const yMax = Math.max(300, Math.ceil((maxReading + 10) / 10) * 10)

    // Calcolo min/max per asse X
    let xMin, xMax
    const nowTs = new Date().getTime()
    if (props.fullDay && props.date) {
      xMin = new Date(`${props.date}T00:00:00`).getTime()
      xMax = new Date(`${props.date}T23:59:59`).getTime()
    } else {
      // Homepage: ultimi N minuti fino ad ora
      xMax = nowTs
      xMin = xMax - (store.selectedRange * 60 * 1000)
    }

    const annotations = {
      // 1. Target Range (TIR) Background
      rangeBox: {
        type: 'box',
        yMin: store.settings.tir_min,
        yMax: store.settings.tir_max,
        backgroundColor: 'rgba(34, 197, 94, 0.04)',
        borderColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 1,
        drawTime: 'beforeDatasetsDraw',
      },
      // 2. Linee limite TIR
      tirMinLine: {
        type: 'line',
        yMin: store.settings.tir_min,
        yMax: store.settings.tir_min,
        borderColor: 'rgba(34, 197, 94, 0.2)',
        borderWidth: 1,
        borderDash: [5, 5],
      },
      tirMaxLine: {
        type: 'line',
        yMin: store.settings.tir_max,
        yMax: store.settings.tir_max,
        borderColor: 'rgba(34, 197, 94, 0.2)',
        borderWidth: 1,
        borderDash: [5, 5],
      }
    }

    // Linea ORA ATTUALE (solo se siamo in visualizzazione odierna nel CALENDARIO)
    const showNowLine = isToday.value && props.fullDay
    if (showNowLine && nowTs >= xMin && nowTs <= xMax) {
      annotations.nowLine = {
        type: 'line',
        xMin: nowTs,
        xMax: nowTs,
        borderColor: '#94a3b8',
        borderWidth: 2,
        borderDash: [2, 4],
        label: {
          display: true,
          content: 'ADESSO',
          position: 'start',
          backgroundColor: '#475569',
          color: 'white',
          font: { size: 8, weight: 'bold' },
          padding: 2,
          borderRadius: 4,
          yAdjust: -10
        }
      }
    }
    
    // Gaps (solo se ci sono letture)
     if (displayReadings.value.length > 0) {
       // 1. Gaps tra le letture
       for (let i = 1; i < displayReadings.value.length; i++) {
         const prevTs = new Date(displayReadings.value[i - 1].timestamp).getTime()
         const ts = new Date(displayReadings.value[i].timestamp).getTime()
         const diffMin = (ts - prevTs) / 60000
         if (diffMin >= 10) {
           annotations[`gap-${i}`] = {
             type: 'box',
             xMin: prevTs,
             xMax: ts,
             yMin: 40,
             yMax: yMax,
             backgroundColor: 'rgba(71, 85, 105, 0.35)',
             borderWidth: 0,
             drawTime: 'beforeDatasetsDraw',
           }
         }
       }

       // 2. Gap tra l'ultima lettura e "ORA" (se siamo oggi e l'ultima lettura è vecchia)
       const lastReadingTs = new Date(displayReadings.value[displayReadings.value.length - 1].timestamp).getTime()
       if (isToday.value && (nowTs - lastReadingTs) / 60000 >= 10) {
         annotations['gap-to-now'] = {
           type: 'box',
           xMin: lastReadingTs,
           xMax: Math.min(nowTs, xMax),
           yMin: 40,
           yMax: yMax,
           backgroundColor: 'rgba(71, 85, 105, 0.35)',
           borderWidth: 0,
           drawTime: 'beforeDatasetsDraw',
         }
       }
     }

    // Insuline (sempre se presenti)
    displayInsulin.value.forEach((ins, idx) => {
      const startTime = new Date(ins.timestamp).getTime()
      const durationHours = ins.type === 'rapid' 
        ? store.settings.rapid_duration 
        : store.settings.slow_duration
      const endTime = startTime + durationHours * 60 * 60 * 1000

      if (endTime < xMin || startTime > xMax) return

      const color = ins.type === 'rapid' ? '#6366f1' : '#ec4899'
      
      if (startTime >= xMin && startTime <= xMax) {
        annotations[`insulin-line-${idx}`] = {
          type: 'line',
          xMin: startTime,
          xMax: startTime,
          borderColor: color,
          borderWidth: 2,
          borderDash: [2, 2],
          label: {
            display: true,
            content: `${ins.units.toString().replace(',', '.')}U`,
            position: 'start',
            backgroundColor: color,
            color: 'white',
            font: { size: 9, weight: 'bold' },
            padding: 3,
            borderRadius: 4
          }
        }
      }

      annotations[`insulin-box-${idx}`] = {
        type: 'box',
        xMin: Math.max(xMin, startTime),
        xMax: Math.min(xMax, endTime),
        backgroundColor: ins.type === 'rapid' ? 'rgba(99, 102, 241, 0.12)' : 'rgba(236, 72, 153, 0.12)',
        borderWidth: 0,
      }
    })

    // Carboidrati (CHO)
    displayCarbs.value.forEach((carb, idx) => {
      const carbTime = new Date(carb.timestamp).getTime()
      if (carbTime < xMin || carbTime > xMax) return

      // Cerchiamo la lettura glicemica più vicina per posizionare il punto sull'asse Y
      // Se non ci sono letture, mettiamo il punto a 100 o in mezzo al TIR
      let yValue = 100
      if (displayReadings.value.length > 0) {
        let closestIdx = 0
        let minDiff = Infinity
        displayReadings.value.forEach((r, i) => {
          const diff = Math.abs(new Date(r.timestamp).getTime() - carbTime)
          if (diff < minDiff) {
            minDiff = diff
            closestIdx = i
          }
        })
        yValue = displayReadings.value[closestIdx].glucose
      }

      annotations[`carb-${idx}`] = {
        type: 'point',
        xValue: carbTime,
        yValue: yValue,
        backgroundColor: 'rgba(217, 119, 6, 0.8)',
        radius: 8,
        borderWidth: 2,
        borderColor: 'white',
        label: {
          display: true,
          content: `${carb.amount}g`,
          position: 'top',
          color: '#d97706',
          font: { size: 10, weight: 'bold' },
          yAdjust: -15
        }
      }
    })

    // Note
    displayNotes.value.forEach((note, idx) => {
      const noteTime = new Date(note.timestamp).getTime()
      if (noteTime < xMin || noteTime > xMax) return

      let yValue = 110 // Leggermente sopra i CHO se non ci sono letture
      if (displayReadings.value.length > 0) {
        let closestIdx = 0
        let minDiff = Infinity
        displayReadings.value.forEach((r, i) => {
          const diff = Math.abs(new Date(r.timestamp).getTime() - noteTime)
          if (diff < minDiff) {
            minDiff = diff
            closestIdx = i
          }
        })
        yValue = displayReadings.value[closestIdx].glucose
      }

      const label = String(note.text || '').trim()
      const shortLabel = label.length > 18 ? `${label.slice(0, 18)}…` : label

      annotations[`note-${idx}`] = {
        type: 'point',
        xValue: noteTime,
        yValue: yValue,
        backgroundColor: 'rgba(14, 165, 233, 0.85)',
        radius: 7,
        borderWidth: 2,
        borderColor: 'white',
        label: {
          display: !!shortLabel,
          content: shortLabel,
          position: 'top',
          color: '#0ea5e9',
          font: { size: 9, weight: 'bold' },
          yAdjust: -14
        }
      }
    })

    return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400 },
    interaction: { intersect: false, mode: 'nearest', axis: 'x' },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(10,10,10,0.9)',
        titleColor:      '#64748b',
        bodyColor:       '#f1f5f9',
        padding:         10,
        callbacks: { 
          title: (items) => {
            if (!items.length) return ''
            return new Date(items[0].parsed.x).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
          },
          label: ctx => ` ${ctx.parsed.y} mg/dL` 
        },
      },
      annotation: {
        annotations: annotations
      }
    },
    scales: {
      x: {
        type: 'linear',
        min: xMin,
        max: xMax,
        ticks: { 
          color: '#475569', 
          maxTicksLimit: 8, 
          font: { family: 'DM Mono', size: 10 },
          callback: (value) => {
            return new Date(value).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
          }
        },
        grid:  { color: 'rgba(255,255,255,0.04)' },
      },
      y: {
        min: 40, 
        max: yMax,
        ticks: { 
          color: '#475569', 
          stepSize: yMax > 300 ? Math.ceil((yMax - 40) / 5) : 54, 
          font: { family: 'DM Mono', size: 10 } 
        },
        grid:  { color: 'rgba(255,255,255,0.04)' },
      },
    },
  }
})
</script>
