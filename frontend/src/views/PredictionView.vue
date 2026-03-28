<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden">
      <div class="card-body p-4 md:p-6 relative">
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-secondary/5 blur-3xl rounded-full"></div>
        
        <div class="flex items-center gap-4 relative z-10">
          <div class="w-12 h-12 bg-secondary/10 rounded-2xl text-secondary flex items-center justify-center text-2xl">
            <i class="fi fi-sr-chart-line-up"></i>
          </div>
          <div>
            <h1 class="text-3xl font-black uppercase tracking-tight leading-none italic text-primary">Glice<span class="text-base-content">Forecast</span></h1>
            <p class="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] mt-2">{{ $t('prediction.subtitle') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Nessun dato -->
    <div v-if="!store.readings.length && !store.loading" class="flex flex-col items-center justify-center py-20 opacity-30 gap-4">
      <i class="fi fi-sr-database text-4xl"></i>
      <span class="text-base font-black uppercase tracking-widest">{{ $t('prediction.insufficient_data') }}</span>
    </div>

    <!-- Main Chart -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
      <div class="lg:col-span-2">
        <div class="card bg-base-100 shadow-xl border border-base-content/5 h-[450px] overflow-hidden">
          <div class="card-body p-6 relative">
            <div class="absolute -top-10 -left-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full"></div>
            
            <div class="flex items-center justify-between mb-4 relative z-10">
              <span class="text-[10px] font-black uppercase tracking-widest opacity-40">{{ $t('prediction.chart_title') }}</span>
              <div class="badge badge-secondary badge-outline font-black text-[10px] uppercase tracking-widest">{{ $t('prediction.live_forecast') }}</div>
            </div>
            <div class="relative flex-1 h-full z-10">
              <Line v-if="chartData" :data="chartData" :options="chartOptions" />
            </div>
          </div>
        </div>
      </div>

      <!-- Info Panel -->
      <div class="flex flex-col gap-6">
        <!-- Target Prediction -->
        <div class="card shadow-xl border border-base-content/5 overflow-hidden" :class="riskColorClass">
          <div class="card-body p-6 items-center text-center relative">
            <div class="absolute inset-0 bg-base-content/10 opacity-10"></div>
            
            <span class="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 relative z-10">{{ $t('prediction.estimate_60m') }}</span>
            <div class="flex items-baseline gap-2 mt-2 relative z-10">
              <span class="text-7xl font-black tracking-tighter italic">
                {{ store.prediction?.t60 || '--' }}
              </span>
              <span class="text-base font-bold opacity-60 uppercase">{{ $t('common.mgdl') }}</span>
            </div>

            <div class="mt-4 grid grid-cols-3 gap-2 w-full border-t border-current/10 pt-4 relative z-10">
              <div class="flex flex-col">
                <span class="text-[10px] font-black uppercase opacity-50 text-current">15m</span>
                <span class="text-xl font-black italic leading-none">{{ store.prediction?.t15 || '--' }}</span>
              </div>
              <div class="flex flex-col border-x border-current/10">
                <span class="text-[10px] font-black uppercase opacity-50 text-current">30m</span>
                <span class="text-xl font-black italic leading-none">{{ store.prediction?.t30 || '--' }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] font-black uppercase opacity-50 text-current">{{ $t('prediction.trend') }}</span>
                <span class="text-xl font-black italic leading-none">{{ store.prediction?.roc > 0 ? '+' : '' }}{{ store.prediction?.roc || '0.00' }}</span>
              </div>
            </div>

            <div class="mt-4 w-full relative z-10">
              <div class="badge w-full py-4 font-black text-[10px] uppercase tracking-widest border-none shadow-lg shadow-black/10" :class="riskBadgeClass">
                {{ $t('prediction.risk') }}: {{ riskLabelText }}
              </div>
            </div>
          </div>
        </div>

        <!-- How it works -->
        <div class="card bg-base-100 shadow-xl border border-base-content/5 flex-1 overflow-hidden">
          <div class="card-body p-6 gap-4 relative flex flex-col h-full">
            <div class="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/5 blur-3xl rounded-full"></div>
            
            <span class="text-[10px] font-black uppercase tracking-widest opacity-40 relative z-10">{{ $t('prediction.current_state') }}</span>
            <div class="space-y-3 relative z-10">
              <div class="flex items-center justify-between bg-base-200/50 p-3 rounded-2xl border border-base-content/5">
                <div class="flex items-center gap-3">
                  <div class="w-2.5 h-2.5 rounded-full bg-secondary"></div>
                  <span class="text-[10px] font-black uppercase opacity-60">{{ $t('prediction.avg_5m') }}</span>
                </div>
                <span class="text-sm font-black uppercase tracking-tighter">{{ store.prediction?.current }} {{ $t('common.mgdl') }}</span>
              </div>
              <div class="flex items-center justify-between bg-base-200/50 p-3 rounded-2xl border border-base-content/5">
                <div class="flex items-center gap-3">
                  <div class="w-2.5 h-2.5 rounded-full" :class="trendIconColor"></div>
                  <span class="text-[10px] font-black uppercase opacity-60">{{ $t('prediction.speed_roc') }}</span>
                </div>
                <span class="text-sm font-black uppercase tracking-tighter">{{ store.prediction?.roc }} mg/m</span>
              </div>
              <div class="flex items-center justify-between bg-base-200/50 p-3 rounded-2xl border border-base-content/5">
                <div class="flex items-center gap-3">
                  <div class="w-2.5 h-2.5 rounded-full bg-primary"></div>
                  <span class="text-[10px] font-black uppercase opacity-60">{{ $t('prediction.active_iob') }}</span>
                </div>
                <span class="text-sm font-black uppercase tracking-tighter">{{ store.iob.toFixed(1) }} {{ $t('common.units') }}</span>
              </div>
              <div class="flex items-center justify-between bg-base-200/50 p-3 rounded-2xl border border-base-content/5">
                <div class="flex items-center gap-3">
                  <div class="w-2.5 h-2.5 rounded-full bg-accent"></div>
                  <span class="text-[10px] font-black uppercase opacity-60">{{ $t('prediction.active_cob') }}</span>
                </div>
                <span class="text-sm font-black uppercase tracking-tighter">{{ Math.round(store.cob) }} g</span>
              </div>
            </div>
            <p class="text-[11px] opacity-40 italic mt-auto leading-relaxed relative z-10">
              {{ $t('prediction.disclaimer') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Spiegazione Algoritmo -->
    <div class="card bg-base-200 shadow-sm border border-base-content/10">
      <div class="card-body p-6 gap-6">
        <div class="flex items-center gap-3">
          <i class="fi fi-sr-info text-primary text-lg"></i>
          <span class="text-sm font-black uppercase tracking-widest opacity-50">{{ $t('prediction.how_it_works') }}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="flex flex-col gap-2">
            <span class="text-xs font-black uppercase text-secondary italic">{{ $t('prediction.step1_title') }}</span>
            <p class="text-sm opacity-70 leading-relaxed">
              {{ $t('prediction.step1_desc') }}
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-xs font-black uppercase text-secondary italic">{{ $t('prediction.step2_title') }}</span>
            <p class="text-sm opacity-70 leading-relaxed">
              {{ $t('prediction.step2_desc') }}
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-xs font-black uppercase text-secondary italic">{{ $t('prediction.step3_title') }}</span>
            <p class="text-sm opacity-70 leading-relaxed">
              {{ $t('prediction.step3_desc') }}
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-xs font-black uppercase text-secondary italic">{{ $t('prediction.step4_title') }}</span>
            <p class="text-sm opacity-70 leading-relaxed">
              {{ $t('prediction.step4_desc') }}
            </p>
          </div>
        </div>

        <div class="divider opacity-5 my-0"></div>

        <div class="bg-base-300/30 p-5 rounded-2xl border border-base-content/5">
          <p class="text-xs font-bold opacity-40 uppercase tracking-widest text-center italic">
            {{ $t('prediction.formula') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, computed } from 'vue'
import { useGlucoseStore } from '../stores/glucose'
import { useI18n } from 'vue-i18n'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Tooltip, Filler
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, annotationPlugin)

const { t } = useI18n()
const store = useGlucoseStore()

// ── Auto-refresh ogni 60s ─────────────────────────────────────────────────────
let interval = null
onMounted(async () => {
  await store.fetchAll()
  interval = setInterval(() => store.fetchAll(), 60_000)
})
onUnmounted(() => clearInterval(interval))

const riskColorClass = computed(() => {
  if (store.prediction?.risk === 'high') return 'bg-error text-error-content'
  if (store.prediction?.risk === 'normal') return 'bg-warning text-warning-content'
  return 'bg-success text-success-content'
})

const riskBadgeClass = computed(() => {
  if (store.prediction?.risk === 'high') return 'bg-black/20 text-white'
  if (store.prediction?.risk === 'normal') return 'bg-black/10 text-black/60'
  return 'bg-black/10 text-black/60'
})

const riskLabelText = computed(() => {
  const labels = { 
    high: t('prediction.risk_levels.high'), 
    normal: t('prediction.risk_levels.normal'), 
    low: t('prediction.risk_levels.low') 
  }
  return labels[store.prediction?.risk] || 'N/A'
})

const trendIconColor = computed(() => {
  const t = store.prediction?.trend
  if (t?.includes('fast')) return 'bg-error'
  if (t?.includes('rising') || t?.includes('falling')) return 'bg-warning'
  return 'bg-success'
})

const chartData = computed(() => {
  if (!store.readings.length) return null

  // Dati passati (ultimi 120 min)
  const pastData = store.readings.map(r => ({
    x: new Date(r.timestamp).getTime(),
    y: r.glucose
  }))

  // Punti predizione (15, 30, 60 min)
  const nowTs = new Date().getTime()
  const predictionData = [
    { x: nowTs, y: store.prediction?.current },
    { x: nowTs + 15 * 60000, y: store.prediction?.t15 },
    { x: nowTs + 30 * 60000, y: store.prediction?.t30 },
    { x: nowTs + 60 * 60000, y: store.prediction?.t60 }
  ]

  return {
    datasets: [
      {
        label: 'Glicemia Reale',
        data: pastData,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
        fill: true,
        tension: 0.3,
        pointRadius: 1
      },
      {
        label: 'Predizione',
        data: predictionData,
        borderColor: '#f43f5e',
        borderWidth: 3,
        borderDash: [5, 5],
        pointBackgroundColor: '#f43f5e',
        pointRadius: 5,
        pointHoverRadius: 8,
        tension: 0.4
      }
    ]
  }
})

const chartOptions = computed(() => {
  const nowTs = new Date().getTime()
  const xMin = nowTs - 90 * 60000 // Mostriamo 90 min di storia
  const xMax = nowTs + 70 * 60000 // E 70 min di futuro

  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    scales: {
      x: {
        type: 'linear',
        min: xMin,
        max: xMax,
        ticks: {
          callback: (val) => new Date(val).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
          font: { size: 9, family: 'DM Mono' },
          maxTicksLimit: 10
        },
        grid: { color: 'rgba(255,255,255,0.03)' }
      },
      y: {
        min: 40,
        max: Math.max(250, store.prediction?.t60 + 50 || 250),
        ticks: { font: { size: 9, family: 'DM Mono' } },
        grid: { color: 'rgba(255,255,255,0.03)' }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 12,
        titleFont: { size: 12, weight: 'bold' },
        callbacks: {
          title: (items) => new Date(items[0].parsed.x).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
          label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y} mg/dL`
        }
      },
      annotation: {
        annotations: {
          nowLine: {
            type: 'line',
            xMin: nowTs,
            xMax: nowTs,
            borderColor: '#94a3b8',
            borderWidth: 2,
            borderDash: [2, 2],
            label: {
              display: true,
              content: 'ADESSO',
              position: 'start',
              backgroundColor: '#475569',
              font: { size: 8, weight: 'bold' }
            }
          },
          targetRange: {
            type: 'box',
            yMin: store.settings.tir_min,
            yMax: store.settings.tir_max,
            backgroundColor: 'rgba(34, 197, 94, 0.02)',
            borderWidth: 0
          }
        }
      }
    }
  }
})
</script>
