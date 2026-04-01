<template>
  <div class="flex flex-col gap-6">
    <!-- Header Card -->
    <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden">
      <div class="card-body p-4 md:p-6 relative">
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full"></div>
        
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-primary/10 rounded-3xl text-primary flex items-center justify-center text-2xl shadow-inner border border-primary/5">
              <i class="fi fi-sr-document-signed"></i>
            </div>
            <div>
              <h1 class="text-3xl font-black uppercase tracking-tight italic">{{ $t('summary.title').split(' ')[0] }} <span class="text-primary">{{ $t('summary.title').split(' ')[1] }}</span></h1>
              <p class="text-[10px] font-black opacity-40 uppercase tracking-[0.3em]">{{ $t('summary.subtitle', { n: days }) }}</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- Range Selector -->
            <div class="flex items-center gap-2 bg-base-200 p-1.5 rounded-2xl border border-base-content/5">
              <button
                v-for="d in ranges"
                :key="d"
                class="btn btn-ghost btn-xs px-3 font-black uppercase text-[9px] tracking-widest rounded-xl"
                :class="days === d ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'opacity-60 hover:opacity-100'"
                @click="setDays(d)"
              >
                {{ d }}g
              </button>
            </div>

            <!-- Export Buttons -->
            <div class="flex items-center gap-1 ml-2">
              <button 
                class="btn btn-square btn-sm btn-ghost hover:bg-success/10 hover:text-success"
                @click="exportCSV"
                :title="$t('common.export') + ' CSV'"
                :disabled="!hasData || loading"
              >
                <i class="fi fi-sr-file-csv text-lg"></i>
              </button>
              <button 
                class="btn btn-square btn-sm btn-ghost hover:bg-error/10 hover:text-error"
                @click="exportPDF"
                :title="$t('common.export') + ' PDF'"
                :disabled="!hasData || loading"
              >
                <i class="fi fi-sr-file-pdf text-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="relative">
      <!-- Loading Overlay -->
      <div v-if="loading" class="absolute inset-0 z-10 bg-base-100/40 backdrop-blur-[2px] rounded-2xl flex items-center justify-center">
        <span class="loading loading-dots loading-md text-primary"></span>
      </div>

      <!-- Trend Chart -->
      <div class="mb-6">
        <GlucoseChart 
          ref="chartRef"
          :readings="readings"
          :title="$t('summary.glucose_summary')"
          :loading="loading"
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        <!-- Sintesi Glicemica Card -->
        <div class="card bg-base-100 shadow-xl border border-base-content/5 overflow-hidden">
          <div class="card-body p-6 gap-5 relative">
            <div class="absolute -top-10 -left-10 w-24 h-24 bg-success/5 blur-3xl rounded-full"></div>
            
            <div class="flex items-center gap-2 relative z-10">
              <i class="fi fi-sr-stats text-success"></i>
              <span class="text-[10px] font-black uppercase tracking-widest opacity-50">{{ $t('summary.glucose_summary') }}</span>
            </div>

            <div v-if="!hasData && !loading" class="py-10 text-center opacity-30 relative z-10">
              <div class="text-[10px] font-black uppercase tracking-widest">{{ $t('summary.no_data') }}</div>
            </div>

            <template v-else>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                <div class="bg-base-200/50 rounded-2xl p-4 border border-base-content/5">
                  <div class="text-[9px] font-black uppercase tracking-widest opacity-40">{{ $t('summary.avg_glucose') }}</div>
                  <div class="mt-1 flex items-end gap-2">
                    <div class="text-3xl font-black tracking-tight">{{ avg }}</div>
                    <div class="text-[10px] font-black opacity-30 uppercase tracking-widest mb-1">{{ $t('common.mgdl') }}</div>
                  </div>
                </div>

                <div class="bg-base-200/50 rounded-2xl p-4 border border-base-content/5">
                  <div class="text-[9px] font-black uppercase tracking-widest opacity-40">{{ $t('summary.variability') }}</div>
                  <div class="mt-1 flex items-end justify-between gap-2">
                    <div class="flex items-end gap-2">
                      <div class="text-3xl font-black tracking-tight">{{ sd }}</div>
                      <div class="text-[10px] font-black opacity-30 uppercase tracking-widest mb-1">{{ $t('common.mgdl') }}</div>
                    </div>
                    <div class="px-2 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest"
                      :class="sdBadgeClass"
                    >
                      {{ sdLabel }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Distribuzione TIR -->
              <div class="bg-base-300/30 rounded-2xl p-4 border border-base-content/5">
                <div class="flex items-center justify-between">
                  <div class="text-[9px] font-black uppercase tracking-widest opacity-40">{{ $t('summary.distribution') }}</div>
                  <div class="text-[9px] font-black opacity-30 uppercase tracking-widest">{{ $t('summary.target') }} {{ store.settings.tir_min }}-{{ store.settings.tir_max }}</div>
                </div>

                <div class="mt-3 w-full h-3 rounded-full overflow-hidden bg-base-300 border border-base-content/5 flex">
                  <div class="h-full bg-warning" :style="{ width: `${belowPct}%` }"></div>
                  <div class="h-full bg-success" :style="{ width: `${inRangePct}%` }"></div>
                  <div class="h-full bg-error" :style="{ width: `${abovePct}%` }"></div>
                </div>

                <div class="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[9px] font-black uppercase tracking-widest opacity-50">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-warning"></span>
                    <span>{{ $t('summary.below') }} {{ belowPct }}%</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-success"></span>
                    <span>{{ $t('summary.in_range') }} {{ inRangePct }}%</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-error"></span>
                    <span>{{ $t('summary.above') }} {{ abovePct }}%</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- Stima HbA1c Card -->
        <div class="card bg-base-200 shadow-xl border border-base-content/5">
          <div class="card-body p-6 gap-5">
            <div class="flex items-center gap-2">
              <i class="fi fi-sr-test text-primary"></i>
              <span class="text-xs font-black uppercase tracking-widest opacity-50">{{ $t('summary.hba1c_estimate') }}</span>
            </div>

            <div v-if="!hasData && !loading" class="py-10 text-center opacity-30">
              <div class="text-[10px] font-black uppercase tracking-widest">{{ $t('summary.no_data') }}</div>
            </div>

            <template v-else>
              <div class="bg-base-300/30 rounded-2xl p-4 border border-base-content/5">
                <div class="text-[9px] font-black uppercase tracking-widest opacity-40">{{ $t('summary.gmi_estimated') }}</div>
                <div class="mt-1 flex items-end justify-between gap-3">
                  <div class="flex items-end gap-2">
                    <div class="text-3xl font-black tracking-tight">{{ gmi.toFixed(1) }}</div>
                    <div class="text-[10px] font-black opacity-30 uppercase tracking-widest mb-1">%</div>
                  </div>
                  <div class="px-2 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest"
                    :class="gmiBadgeClass"
                  >
                    {{ gmiLabel }}
                  </div>
                </div>

                <div class="mt-4">
                  <div class="relative w-full h-3 rounded-full overflow-hidden bg-base-300 border border-base-content/5">
                    <div class="absolute inset-0 flex">
                      <div class="h-full bg-success" :style="{ width: `${gmiGreenWidth}%` }"></div>
                      <div class="h-full bg-warning" :style="{ width: `${gmiYellowWidth}%` }"></div>
                      <div class="h-full bg-error" :style="{ width: `${gmiRedWidth}%` }"></div>
                    </div>
                    <div
                      class="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-base-100 bg-base-content"
                      :style="{ left: `calc(${gmiMarkerLeft}% - 6px)` }"
                      :title="$t('summary.gmi_estimated')"
                    ></div>
                  </div>
                  <div class="mt-2 flex justify-between text-[9px] font-black uppercase tracking-widest opacity-40">
                    <span>{{ gmiMin }}%</span>
                    <span>{{ gmiMax }}%</span>
                  </div>
                </div>
              </div>

              <!-- Qualità Dati Info -->
              <div class="bg-base-300/30 rounded-2xl p-4 border border-base-content/5">
                <div class="flex items-center justify-between">
                  <div class="text-[9px] font-black uppercase tracking-widest opacity-40">{{ $t('summary.data_quality') }}</div>
                  <div class="text-[9px] font-black uppercase tracking-widest opacity-30">{{ daysUsed }} / {{ days }} {{ $t('summary.days') }}</div>
                </div>
                <div class="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-[9px] font-black uppercase tracking-widest opacity-40">
                  <span>{{ $t('summary.samples') }}: {{ sampleCount }}</span>
                  <span>{{ $t('summary.gaps') }}: {{ gapCount }}</span>
                  <span v-if="avgIntervalMin">{{ $t('summary.avg_interval') }}: {{ avgIntervalMin }}m</span>
                </div>
                <div v-if="daysUsed < 14" class="mt-2 text-[10px] font-black text-warning uppercase tracking-widest opacity-80">
                  {{ $t('summary.insufficient_data_warning') }}
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <div v-if="error" class="mt-4 alert alert-error shadow-lg">
        <span class="text-xs font-black uppercase tracking-widest">{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import { useGlucoseStore, type Reading } from '../stores/glucose'
import { useAuthStore } from '../stores/auth'
import { useI18n } from 'vue-i18n'
import { reportService } from '../services/reportService'
import GlucoseChart from '../components/GlucoseChart.vue'

const { t } = useI18n()
const store = useGlucoseStore()
const auth = useAuthStore()

const chartRef = ref(null)
const ranges = [7, 14, 30, 90]
const days = ref(14)
const readings = ref<Reading[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

function localDateKey(iso: string) {
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const hasData = computed(() => readings.value.length > 0)

const values = computed(() => readings.value.map(r => Number(r.glucose)).filter(v => Number.isFinite(v)))
const avg = computed(() => {
  if (!values.value.length) return 0
  return Math.round(values.value.reduce((a, b) => a + b, 0) / values.value.length)
})

const sd = computed(() => {
  if (!values.value.length) return 0
  const mean = values.value.reduce((a, b) => a + b, 0) / values.value.length
  const variance = values.value.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.value.length
  return Math.round(Math.sqrt(variance))
})

const sdLabel = computed(() => {
  const v = sd.value
  if (v <= 36) return t('common.excellent')
  if (v <= 50) return t('common.intermediate')
  return t('common.high')
})

const sdBadgeClass = computed(() => {
  if (sd.value <= 36) return 'bg-success/15 text-success border border-success/20'
  if (sd.value <= 50) return 'bg-warning/15 text-warning border border-warning/20'
  return 'bg-error/15 text-error border border-error/20'
})

const belowCount = computed(() => readings.value.filter(r => Number(r.glucose) < Number(store.settings.tir_min)).length)
const aboveCount = computed(() => readings.value.filter(r => Number(r.glucose) > Number(store.settings.tir_max)).length)
const inRangeCount = computed(() => readings.value.filter(r => {
  const g = Number(r.glucose)
  return g >= Number(store.settings.tir_min) && g <= Number(store.settings.tir_max)
}).length)

const belowPct = computed(() => hasData.value ? Math.round((belowCount.value / readings.value.length) * 100) : 0)
const abovePct = computed(() => hasData.value ? Math.round((aboveCount.value / readings.value.length) * 100) : 0)
const inRangePct = computed(() => {
  if (!hasData.value) return 0
  const fixed = 100 - belowPct.value - abovePct.value
  return Math.max(0, fixed)
})

const gmi = computed(() => 3.31 + (0.02392 * avg.value))
const gmiLabel = computed(() => {
  const v = gmi.value
  if (v < 7) return t('common.good')
  if (v < 8) return t('common.intermediate')
  return t('common.high')
})
const gmiBadgeClass = computed(() => {
  const v = gmi.value
  if (v < 7) return 'bg-success/15 text-success border border-success/20'
  if (v < 8) return 'bg-warning/15 text-warning border border-warning/20'
  return 'bg-error/15 text-error border border-error/20'
})

const gmiMin = 5
const gmiMax = 12
const gmiRange = gmiMax - gmiMin
const gmiGreenWidth = ((7 - gmiMin) / gmiRange) * 100
const gmiYellowWidth = ((8 - 7) / gmiRange) * 100
const gmiRedWidth = 100 - gmiGreenWidth - gmiYellowWidth
const gmiMarkerLeft = computed(() => {
  const v = Math.min(gmiMax, Math.max(gmiMin, gmi.value))
  return ((v - gmiMin) / gmiRange) * 100
})

const daysUsed = computed(() => {
  const set = new Set(readings.value.map(r => localDateKey(r.timestamp)))
  return set.size
})

const sampleCount = computed(() => readings.value.length)

const gapCount = computed(() => {
  if (readings.value.length < 2) return 0
  let gaps = 0
  for (let i = 1; i < readings.value.length; i++) {
    const prev = new Date(readings.value[i - 1].timestamp).getTime()
    const cur = new Date(readings.value[i].timestamp).getTime()
    const diffMin = (cur - prev) / 60000
    if (diffMin >= 15) gaps++
  }
  return gaps
})

const avgIntervalMin = computed(() => {
  if (readings.value.length < 2) return 0
  const diffs = []
  for (let i = 1; i < readings.value.length; i++) {
    const prev = new Date(readings.value[i - 1].timestamp).getTime()
    const cur = new Date(readings.value[i].timestamp).getTime()
    const diffMin = (cur - prev) / 60000
    if (Number.isFinite(diffMin) && diffMin > 0 && diffMin < 240) diffs.push(diffMin)
  }
  if (!diffs.length) return 0
  const avgVal = diffs.reduce((a, b) => a + b, 0) / diffs.length
  return Math.round(avgVal)
})

async function fetchPeriod() {
  loading.value = true
  error.value = null
  try {
    await store.fetchSettings()
    const minutes = days.value * 24 * 60
    const { data } = await axios.get('/api/readings', { 
      params: { range: minutes },
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    readings.value = Array.isArray(data) ? data : []
  } catch (e: any) {
    error.value = e?.response?.data?.error || 'Errore caricamento resoconto'
    readings.value = []
  } finally {
    loading.value = false
  }
}

function setDays(d: number) {
  days.value = d
  fetchPeriod()
}

// ── Esportazione CSV ─────────────────────────────────────────────────────────
function exportCSV() {
  if (!readings.value.length) return
  
  const headers = ['Data Ora', 'Glicemia (mg/dL)', 'Trend']
  const rows = readings.value.map(r => [
    new Date(r.timestamp).toLocaleString('it-IT'),
    r.glucose,
    r.trend || 'N/A'
  ])
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `glicechart_export_${days.value}d.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// ── Esportazione PDF ─────────────────────────────────────────────────────────
function exportPDF() {
  if (!readings.value.length) return
  
  const currentLocale = t('common.mgdl').includes('mg/dL') ? 'it' : 'en'
  const filename = `glicechart-summary-${days.value}d-${new Date().toISOString().split('T')[0]}.pdf`

  const chartImage = chartRef.value?.getImage()

  reportService.generateReport({
    title: t('summary.export.report_title', { n: days.value }),
    subtitle: t('summary.subtitle', { n: days.value }),
    username: auth.user?.username || 'N/A',
    lang: currentLocale,
    avg: avg.value,
    tir: inRangePct.value,
    sd: sd.value,
    gmi: gmi.value,
    chartImage,
    tirDetails: {
      below: belowPct.value,
      inRange: inRangePct.value,
      above: abovePct.value,
      min: store.settings.tir_min,
      max: store.settings.tir_max
    },
    quality: {
      daysUsed: daysUsed.value,
      totalDays: days.value,
      samples: sampleCount.value,
      gaps: gapCount.value,
      avgInterval: avgIntervalMin.value
    }
  }, filename)
}

onMounted(() => {
  fetchPeriod()
})
</script>

<style scoped>
.fi {
  display: inline-block;
  vertical-align: middle;
}
</style>
