<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden">
      <div class="card-body p-4 md:p-6 relative">
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-secondary/5 blur-3xl rounded-full"></div>
        
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-secondary/10 rounded-2xl text-secondary flex items-center justify-center text-xl">
              <i class="fi fi-sr-apps-sort"></i>
            </div>
            <div>
              <h2 class="text-lg font-black uppercase tracking-tight leading-none">{{ $t('comparison.title') }}</h2>
              <span class="text-[9px] font-black opacity-30 uppercase tracking-[0.2em]">{{ $t('comparison.subtitle') }}</span>
            </div>
          </div>

          <!-- Selector -->
          <div class="flex items-center gap-2 bg-base-200 p-1.5 rounded-2xl border border-base-content/5">
            <button
              v-for="opt in periods"
              :key="opt.value"
              class="btn btn-ghost btn-xs px-3 font-black uppercase text-[9px] tracking-widest rounded-xl"
              :class="selectedPeriod === opt.value ? 'bg-secondary text-secondary-content shadow-lg shadow-secondary/20' : 'opacity-60 hover:opacity-100'"
              @click="setPeriod(opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Stats Comparison -->
      <div class="lg:col-span-1 flex flex-col gap-6">
        <!-- Period A (Current) -->
        <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden">
          <div class="card-body p-5 gap-4 relative">
            <div class="absolute -top-10 -left-10 w-24 h-24 bg-primary/5 blur-3xl rounded-full"></div>
            
            <div class="flex items-center justify-between relative z-10">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-primary"></div>
                <span class="text-[10px] font-black uppercase tracking-widest opacity-50">{{ $t('comparison.current_period') }}</span>
              </div>
              <span class="text-[9px] font-bold opacity-30 italic">{{ periodALabel }}</span>
            </div>
            
            <div v-if="statsA" class="grid grid-cols-2 gap-3 relative z-10">
              <div class="bg-base-200/50 p-3 rounded-xl border border-base-content/5">
                <div class="text-[8px] font-black uppercase opacity-40">{{ $t('home.avg') }}</div>
                <div class="text-xl font-black">{{ statsA.avg }} <span class="text-[8px] opacity-30">{{ $t('common.mgdl') }}</span></div>
              </div>
              <div class="bg-base-200/50 p-3 rounded-xl border border-base-content/5">
                <div class="text-[8px] font-black uppercase opacity-40">{{ $t('home.tir') }}</div>
                <div class="text-xl font-black text-success">{{ statsA.tir }}%</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Period B (Previous) -->
        <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden">
          <div class="card-body p-5 gap-4 relative">
            <div class="absolute -top-10 -right-10 w-24 h-24 bg-base-content/5 blur-3xl rounded-full"></div>
            
            <div class="flex items-center justify-between relative z-10">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-base-content/20"></div>
                <span class="text-[10px] font-black uppercase tracking-widest opacity-50">{{ $t('comparison.previous_period') }}</span>
              </div>
              <span class="text-[9px] font-bold opacity-30 italic">{{ periodBLabel }}</span>
            </div>
            
            <div v-if="statsB" class="grid grid-cols-2 gap-3 relative z-10">
              <div class="bg-base-200/50 p-3 rounded-xl border border-base-content/5">
                <div class="text-[8px] font-black uppercase opacity-40">{{ $t('home.avg') }}</div>
                <div class="text-xl font-black">{{ statsB.avg }} <span class="text-[8px] opacity-30">{{ $t('common.mgdl') }}</span></div>
              </div>
              <div class="bg-base-200/50 p-3 rounded-xl border border-base-content/5">
                <div class="text-[8px] font-black uppercase opacity-40">{{ $t('home.tir') }}</div>
                <div class="text-xl font-black text-success">{{ statsB.tir }}%</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Delta Card -->
        <div v-if="statsA && statsB" class="card bg-primary text-primary-content shadow-xl overflow-hidden">
          <div class="card-body p-5">
            <h3 class="text-[10px] font-black uppercase tracking-widest opacity-70">{{ $t('comparison.avg_variation') }}</h3>
            <div class="flex items-center gap-3 mt-1">
              <div class="text-4xl font-black tracking-tighter">
                {{ avgDelta > 0 ? '+' : '' }}{{ avgDelta }}
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] font-black uppercase">{{ $t('common.mgdl') }}</span>
                <i :class="avgDelta <= 0 ? 'fi fi-sr-caret-down text-success' : 'fi fi-sr-caret-up text-error'" class="text-xl leading-none"></i>
              </div>
            </div>
            <p class="text-[9px] font-bold opacity-70 mt-2 italic">
              {{ avgDelta <= 0 ? $t('comparison.improvement') : $t('comparison.worsening') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Chart Overlay -->
      <div class="lg:col-span-2 card bg-base-200 shadow-xl border border-base-content/5">
        <div class="card-body p-4 md:p-6 gap-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="fi fi-sr-chart-histogram text-secondary"></i>
              <span class="text-xs font-black uppercase tracking-widest opacity-50">{{ $t('comparison.distribution') }}</span>
            </div>
            <div class="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest">
              <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-primary"></span> Attuale</div>
              <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-base-content/20"></span> Precedente</div>
            </div>
          </div>

          <div class="h-[400px] w-full relative">
            <div v-if="loading" class="absolute inset-0 z-10 bg-base-100/40 backdrop-blur-[2px] rounded-2xl flex items-center justify-center">
              <span class="loading loading-dots loading-md text-secondary"></span>
            </div>
            <canvas id="overlayChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import { useGlucoseStore } from '../stores/glucose'
import type { Reading } from '../stores/glucose'
import Chart from 'chart.js/auto'

const auth = useAuthStore()
const store = useGlucoseStore()

const periods = [
  { label: '7 Giorni', value: 7 },
  { label: '14 Giorni', value: 14 },
  { label: '30 Giorni', value: 30 }
]

const selectedPeriod = ref(7)
const loading = ref(false)
const readingsA = ref<Reading[]>([])
const readingsB = ref<Reading[]>([])
let chart: Chart | null = null

const periodALabel = computed(() => `Ultimi ${selectedPeriod.value} giorni`)
const periodBLabel = computed(() => `${selectedPeriod.value} giorni precedenti`)

function calculateStats(data: Reading[]) {
  if (!data.length) return null
  const values = data.map(r => r.glucose)
  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length)
  const inRange = data.filter(r => r.glucose >= store.settings.tir_min && r.glucose <= store.settings.tir_max).length
  const tir = Math.round((inRange / data.length) * 100)
  return { avg, tir }
}

const statsA = computed(() => calculateStats(readingsA.value))
const statsB = computed(() => calculateStats(readingsB.value))
const avgDelta = computed(() => (statsA.value?.avg || 0) - (statsB.value?.avg || 0))

async function fetchData() {
  loading.value = true
  try {
    const days = selectedPeriod.value
    const rangeMin = days * 24 * 60
    
    // Period A: Now to -days
    const resA = await axios.get('/api/readings', {
      params: { range: rangeMin },
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    readingsA.value = resA.data

    // Period B: -days to -2*days
    // We need a custom endpoint or a way to get history. For now, let's use a simpler approach:
    // fetch -2*days and split.
    const resAll = await axios.get('/api/readings', {
      params: { range: rangeMin * 2 },
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    
    const allData = resAll.data as Reading[]
    const splitTs = new Date(Date.now() - days * 24 * 60 * 60 * 1000).getTime()
    
    readingsA.value = allData.filter(r => new Date(r.timestamp).getTime() >= splitTs)
    readingsB.value = allData.filter(r => new Date(r.timestamp).getTime() < splitTs)
    
    updateChart()
  } catch (e) {
    console.error('Errore caricamento dati confronto', e)
  } finally {
    loading.value = false
  }
}

function getHourlyAverages(data: Reading[]) {
  const hourly = Array.from({ length: 24 }, () => [] as number[])
  data.forEach(r => {
    const hour = new Date(r.timestamp).getHours()
    hourly[hour].push(r.glucose)
  })
  return hourly.map(vals => vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null)
}

function updateChart() {
  const ctx = document.getElementById('overlayChart') as HTMLCanvasElement
  if (!ctx) return

  const avgA = getHourlyAverages(readingsA.value)
  const avgB = getHourlyAverages(readingsB.value)
  const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`)

  if (chart) chart.destroy()

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Attuale',
          data: avgA,
          borderColor: '#4F46E5',
          backgroundColor: '#4F46E520',
          borderWidth: 4,
          fill: true,
          tension: 0.4,
          pointRadius: 0
        },
        {
          label: 'Precedente',
          data: avgB,
          borderColor: 'rgba(150, 150, 150, 0.3)',
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          tension: 0.4,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          min: 40,
          max: 300,
          grid: { color: 'rgba(150, 150, 150, 0.05)' },
          ticks: { font: { size: 10, weight: 'bold' } }
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 9, weight: 'bold' } }
        }
      }
    }
  })
}

function setPeriod(p: number) {
  selectedPeriod.value = p
  fetchData()
}

onMounted(() => {
  fetchData()
})

onUnmounted(() => {
  if (chart) chart.destroy()
})
</script>
