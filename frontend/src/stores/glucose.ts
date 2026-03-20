// stores/glucose.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from './auth'

export interface Reading {
  id: number;
  glucose: number;
  timestamp: string;
  trend?: string;
}

export interface InsulinRecord {
  id: number;
  units: number;
  type: 'rapid' | 'slow';
  timestamp: string;
}

export interface CarbRecord {
  id: number;
  amount: number;
  timestamp: string;
}

export interface NoteRecord {
  id: number;
  text: string;
  timestamp: string;
}

export interface Settings {
  tir_min: number;
  tir_max: number;
  red_under: number;
  red_over: number;
  rapid_duration: number;
  slow_duration: number;
  carb_duration: number;
  insulin_sensitivity: number;
  carb_ratio: number;
}

export const useGlucoseStore = defineStore('glucose', () => {
  const auth = useAuthStore()

  // Helper per configurazione axios con token
  const api = () => {
    return axios.create({
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
  }

  const current      = ref<Reading | null>(null)
  const readings     = ref<Reading[]>([])
  const allInsulin   = ref<InsulinRecord[]>([])
  const allCarbs     = ref<CarbRecord[]>([])
  const notes        = ref<NoteRecord[]>([])
  const selectedRange = ref(180)
  const carbDraftAmount = ref(0)
  const loading      = ref(false)
  const chartLoading = ref(false)
  const error        = ref<string | null>(null)
  const lastUpdated  = ref<Date | null>(null)

  // Record filtrati per il range selezionato (UI)
  const insulinRecords = computed(() => {
    const now = new Date().getTime()
    const rangeMs = selectedRange.value * 60 * 1000
    return allInsulin.value.filter(ins => (now - new Date(ins.timestamp).getTime()) <= rangeMs)
  })

  const carbRecords = computed(() => {
    const now = new Date().getTime()
    const rangeMs = selectedRange.value * 60 * 1000
    return allCarbs.value.filter(c => (now - new Date(c.timestamp).getTime()) <= rangeMs)
  })

  // Impostazioni (Settings)
  const settings = ref<Settings>({
    tir_min: 70,
    tir_max: 180,
    red_under: 55,
    red_over: 250,
    rapid_duration: 3,
    slow_duration: 24,
    carb_duration: 4,
    insulin_sensitivity: 60,
    carb_ratio: 15
  })

  const DEFAULT_SETTINGS: Settings = {
    tir_min: 70,
    tir_max: 180,
    red_under: 55,
    red_over: 250,
    rapid_duration: 3,
    slow_duration: 24,
    carb_duration: 4,
    insulin_sensitivity: 60,
    carb_ratio: 15
  }

  async function resetSettings() {
    settings.value = { ...DEFAULT_SETTINGS }
    await updateSettings(settings.value)
  }

  // Dati storici (Calendario)
  const historyReadings = ref<Reading[]>([])
  const historyInsulin  = ref<InsulinRecord[]>([])
  const historyCarbs    = ref<CarbRecord[]>([])
  const historyNotes    = ref<NoteRecord[]>([])
  const historyLoading  = ref(false)

  // ── Helper Statistiche ──────────────────────────────────────────────────────
  function calculateStats(data: Reading[]) {
    if (!data || !data.length) return null
    
    const values = data.map(r => r.glucose)
    const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length)
    const min = Math.min(...values)
    const max = Math.max(...values)
    
    // Time in Range (TIR) usando i limiti delle impostazioni
    const inRange = data.filter(r => r.glucose >= settings.value.tir_min && r.glucose <= settings.value.tir_max).length
    const tir = Math.round((inRange / data.length) * 100)

    // GMI (Glucose Management Indicator) - Formula: 12.71 + 4.705 * (mean glucose [mmol/L])
    // In mg/dL: 3.31 + 0.02392 * (mean glucose [mg/dL])
    const gmi = (3.31 + (0.02392 * avg)).toFixed(1)

    // HbA1c stimata (eA1c) - Formula: (Mean Glucose + 46.7) / 28.7
    const eA1c = ((avg + 46.7) / 28.7).toFixed(1)
    
    return { avg, min, max, tir, gmi, eA1c }
  }

  // Statistiche correnti (Homepage)
  const stats = computed(() => calculateStats(readings.value))
  
  // Statistiche storiche (Calendario)
  const historyStats = computed(() => calculateStats(historyReadings.value))

  // ── IOB / COB (Calcolo dinamico con decadimento lineare) ─────────────────
  const iob = computed(() => {
    const now = new Date().getTime()
    const durationHr = Number(settings.value.rapid_duration) || 3
    const durationMs = durationHr * 60 * 60 * 1000

    return allInsulin.value.reduce((total, ins) => {
      if (ins.type !== 'rapid') return total
      
      const elapsedMs = now - new Date(ins.timestamp).getTime()
      if (elapsedMs < 0 || elapsedMs >= durationMs) return total
      
      const factor = 1 - (elapsedMs / durationMs)
      return total + (Number(ins.units) * factor)
    }, 0)
  })

  const cob = computed(() => {
    const now = new Date().getTime()
    const durationHr = Number(settings.value.carb_duration) || 4
    const durationMs = durationHr * 60 * 60 * 1000

    return allCarbs.value.reduce((total, carb) => {
      const elapsedMs = now - new Date(carb.timestamp).getTime()
      if (elapsedMs < 0 || elapsedMs >= durationMs) return total
      
      const factor = 1 - (elapsedMs / durationMs)
      return total + (Number(carb.amount) * factor)
    }, 0)
  })

  // ── Helper Colore ──────────────────────────────────────────────────────────
  function getStatusColor(value: number | null | undefined) {
    if (value === null || value === undefined) return 'text-base-content'
    const g = Number(value)
    const min = Number(settings.value.tir_min)
    const max = Number(settings.value.tir_max)
    const redUnder = Number(settings.value.red_under)
    const redOver = Number(settings.value.red_over)

    if (g <= redUnder || g >= redOver) return 'text-error'
    if (g < min || g > max) return 'text-warning'
    return 'text-success'
  }

  // ── Predizione Glicemia ──────────────────────
  const prediction = computed(() => {
    if (!current.value || readings.value.length < 5) return null

    const nowTs = new Date().getTime()
    const recent5 = readings.value.slice(-5)
    const smoothedCurrent = Math.round(recent5.reduce((a, b) => a + b.glucose, 0) / recent5.length)

    const firstReading = readings.value[readings.value.length - 5]
    const lastReading = readings.value[readings.value.length - 1]
    const dt = (new Date(lastReading.timestamp).getTime() - new Date(firstReading.timestamp).getTime()) / 60000
    const dg = lastReading.glucose - firstReading.glucose
    let roc = dg / dt

    let correctionFactor = 1.0
    if (roc > 2.0 || roc < -2.0) correctionFactor = 1.15
    const adjustedRoc = roc * correctionFactor

    const ISF = Number(settings.value.insulin_sensitivity) || 60
    const carbRatio = Number(settings.value.carb_ratio) || 15
    const CR = ISF / carbRatio
    
    const insulinDurationMs = (Number(settings.value.rapid_duration) || 3) * 60 * 60 * 1000
    const carbDurationMs = (Number(settings.value.carb_duration) || 4) * 60 * 60 * 1000

    const predictAt = (minutes: number) => {
      let basePred = smoothedCurrent + (adjustedRoc * minutes)
      let insulinEffect = 0
      allInsulin.value.forEach(ins => {
        if (ins.type !== 'rapid') return
        const elapsed = nowTs - new Date(ins.timestamp).getTime()
        if (elapsed < 0 || elapsed >= insulinDurationMs) return
        
        const currentFactor = 1 - (elapsed / insulinDurationMs)
        const futureFactor = 1 - ((elapsed + minutes * 60 * 1000) / insulinDurationMs)
        const consumed = currentFactor - Math.max(0, futureFactor)
        insulinEffect += (Number(ins.units) * consumed * ISF)
      })

      let carbEffect = 0
      allCarbs.value.forEach(carb => {
        const elapsed = nowTs - new Date(carb.timestamp).getTime()
        if (elapsed < 0 || elapsed >= carbDurationMs) return
        
        const currentFactor = 1 - (elapsed / carbDurationMs)
        const futureFactor = 1 - ((elapsed + minutes * 60 * 1000) / carbDurationMs)
        const consumed = currentFactor - Math.max(0, futureFactor)
        carbEffect += (Number(carb.amount) * consumed * CR)
      })

      const finalVal = Math.round(basePred - insulinEffect + carbEffect)
      return Math.max(40, Math.min(400, finalVal))
    }

    const p15 = predictAt(15)
    const p30 = predictAt(30)
    const p60 = predictAt(60)

    let trendLabel = 'stable'
    if (roc > 2.0) trendLabel = 'fast_rising'
    else if (roc > 0.5) trendLabel = 'rising'
    else if (roc < -2.0) trendLabel = 'fast_falling'
    else if (roc < -0.5) trendLabel = 'falling'

    let riskLevel = 'normal'
    if (p15 < 70 || p30 < 70 || p60 < 70) riskLevel = 'high'
    else if (p15 > 180 || p30 > 180 || p60 > 180) riskLevel = 'high'
    else if (roc > 1.5 || roc < -1.5) riskLevel = 'normal'
    else riskLevel = 'low'

    return {
      current: smoothedCurrent,
      t15: p15,
      t30: p30,
      t60: p60,
      roc: roc.toFixed(2),
      trend: trendLabel,
      risk: riskLevel
    }
  })

  // ── Analisi Pattern Intelligenti ───────────────────────────
  const patterns = computed(() => {
    const allHistoryReadings = historyReadings.value || []
    const allHistoryNotes = historyNotes.value || []
    if (allHistoryReadings.length < 288) return []

    const discoveredPatterns: any[] = []

    const hourlyTrends = Array.from({ length: 24 }, () => ({ slopes: [] as number[], values: [] as number[] }))
    
    allHistoryReadings.forEach((r, idx) => {
      if (idx === 0) return
      const date = new Date(r.timestamp)
      const hour = date.getHours()
      const prevG = allHistoryReadings[idx-1].glucose
      const currentG = r.glucose
      const dt = (date.getTime() - new Date(allHistoryReadings[idx-1].timestamp).getTime()) / 60000
      if (dt > 0 && dt < 15) {
        const slope = (currentG - prevG) / dt
        hourlyTrends[hour].slopes.push(slope)
        hourlyTrends[hour].values.push(currentG)
      }
    })

    hourlyTrends.forEach((data, hour) => {
      if (data.slopes.length < 10) return
      const avgSlope = data.slopes.reduce((a, b) => a + b, 0) / data.slopes.length
      const consistency = data.slopes.filter(s => (avgSlope > 0 ? s > 0 : s < 0)).length / data.slopes.length

      if (Math.abs(avgSlope) > 0.3 && consistency > 0.6) {
        const type = avgSlope > 0 ? 'Salita Ricorrente' : 'Discesa Ricorrente'
        const timeStr = `${hour.toString().padStart(2, '0')}:00`
        discoveredPatterns.push({
          id: `hour-${hour}`,
          title: `${type} alle ${timeStr}`,
          description: `Ogni giorno intorno alle ${timeStr}, la tua glicemia tende a ${avgSlope > 0 ? 'salire' : 'scendere'} con una velocità media di ${Math.abs(avgSlope).toFixed(2)} mg/dL al minuto.`,
          icon: avgSlope > 0 ? 'fi-sr-trending-up' : 'fi-sr-trending-down',
          color: avgSlope > 0 ? 'warning' : 'info',
          intensity: Math.min(100, Math.abs(avgSlope) * 50),
          confidence: Math.round(consistency * 100)
        })
      }
    })

    const uniqueNotes = [...new Set(allHistoryNotes.map(n => n.text?.toLowerCase().trim()))]
    
    uniqueNotes.forEach(noteText => {
      if (!noteText || noteText.length < 3) return
      const occurrences = allHistoryNotes.filter(n => n.text?.toLowerCase().trim() === noteText)
      if (occurrences.length < 2) return

      let totalRise = 0
      let validOccurrences = 0

      occurrences.forEach(occ => {
        const startTime = new Date(occ.timestamp).getTime()
        const endTime = startTime + 3 * 60 * 60 * 1000
        const postReadings = allHistoryReadings.filter(r => {
          const t = new Date(r.timestamp).getTime()
          return t >= startTime && t <= endTime
        })

        if (postReadings.length > 5) {
          const startG = postReadings[0].glucose
          const peakG = Math.max(...postReadings.map(r => r.glucose))
          const dropG = Math.min(...postReadings.map(r => r.glucose))
          
          if (Math.abs(peakG - startG) > 30 || Math.abs(startG - dropG) > 30) {
            totalRise += (peakG - startG) - (startG - dropG)
            validOccurrences++
          }
        }
      })

      if (validOccurrences >= 2) {
        const avgImpact = totalRise / validOccurrences
        if (Math.abs(avgImpact) > 20) {
          discoveredPatterns.push({
            id: `note-${noteText.replace(/\s+/g, '-')}`,
            title: `Effetto "${noteText.toUpperCase()}"`,
            description: `Dopo la nota "${noteText}", la glicemia ha mostrato una variazione media di ${avgImpact > 0 ? '+' : ''}${Math.round(avgImpact)} mg/dL nelle 3 ore successive.`,
            icon: 'fi-sr-assessment',
            color: avgImpact > 0 ? 'error' : 'success',
            intensity: Math.min(100, Math.abs(avgImpact)),
            confidence: Math.round((validOccurrences / occurrences.length) * 100)
          })
        }
      }
    })

    return discoveredPatterns.sort((a, b) => b.confidence - a.confidence)
  })

  const glucoseColor = computed(() => {
    if (!current.value) return 'text-base-content'
    return getStatusColor(current.value.glucose)
  })

  const minutesAgo = computed(() => {
    if (!current.value) return null
    return Math.floor((Date.now() - new Date(current.value.timestamp).getTime()) / 60000)
  })

  const hasSyncError = computed(() => {
    // Se non ci sono credenziali impostate
    const noCreds = !auth.user?.gluroo?.link || !auth.user?.gluroo?.token || !auth.user?.gluroo?.header;
    // Se c'è un errore nell'ultimo sync riportato dal backend
    const syncFailed = !!auth.user?.last_sync_error;
    // Se non abbiamo letture e l'ultima chiamata API è fallita
    const noData = readings.value.length === 0 && !!error.value;

    return noCreds || syncFailed || noData;
  })

  async function fetchCurrent() {
    try {
      const { data } = await api().get('/api/current')
      current.value = data
      error.value = null
    } catch (e: any) {
      error.value = e.response?.data?.error || 'Impossibile caricare dato attuale'
    }
  }

  async function fetchReadings() {
    chartLoading.value = true
    try {
      const [{ data: rData }, { data: iData }, { data: cData }, { data: nData }] = await Promise.all([
        api().get('/api/readings', { params: { range: selectedRange.value } }),
        api().get('/api/insulin', { params: { range: 1440 } }),
        api().get('/api/carbs', { params: { range: 1440 } }),
        api().get('/api/notes', { params: { range: selectedRange.value } })
      ])
      readings.value = rData
      allInsulin.value = iData
      allCarbs.value = cData
      notes.value = nData
      lastUpdated.value = new Date()
      error.value = null
    } catch {
      error.value = 'Errore caricamento dati'
    } finally {
      chartLoading.value = false
    }
  }

  async function addNote(text: string, timestamp: string | null = null) {
    loading.value = true
    try {
      await api().post('/api/notes', {
        timestamp: timestamp || new Date().toISOString(),
        text
      })
      await fetchReadings()
    } catch {
      error.value = 'Errore aggiunta nota'
    } finally {
      loading.value = false
    }
  }

  async function removeNote(id: number) {
    loading.value = true
    try {
      await api().delete(`/api/notes/${id}`)
      await fetchReadings()
    } catch {
      error.value = 'Errore eliminazione nota'
    } finally {
      loading.value = false
    }
  }

  async function editNote(id: number, { timestamp, text }: { timestamp: string, text: string }) {
    loading.value = true
    try {
      await api().put(`/api/notes/${id}`, { timestamp, text })
      await fetchReadings()
    } catch {
      error.value = 'Errore modifica nota'
    } finally {
      loading.value = false
    }
  }

  async function addCarb(amount: number, timestamp: string | null = null) {
    loading.value = true
    try {
      await api().post('/api/carbs', {
        timestamp: timestamp || new Date().toISOString(),
        amount
      })
      await fetchReadings()
    } catch {
      error.value = 'Errore aggiunta carboidrati'
    } finally {
      loading.value = false
    }
  }

  async function removeCarb(id: number) {
    loading.value = true
    try {
      await api().delete(`/api/carbs/${id}`)
      await fetchReadings()
    } catch {
      error.value = 'Errore eliminazione carboidrati'
    } finally {
      loading.value = false
    }
  }

  async function editCarb(id: number, { timestamp, amount }: { timestamp: string, amount: number }) {
    loading.value = true
    try {
      await api().put(`/api/carbs/${id}`, { timestamp, amount })
      await fetchReadings()
    } catch {
      error.value = 'Errore modifica carboidrati'
    } finally {
      loading.value = false
    }
  }

  async function fetchSettings() {
    try {
      const { data } = await api().get('/api/settings')
      if (data) settings.value = data
    } catch {
      error.value = 'Errore caricamento impostazioni'
    }
  }

  async function updateSettings(newSettings: Settings) {
    loading.value = true
    try {
      await api().put('/api/settings', newSettings)
      settings.value = { ...newSettings }
      error.value = null
    } catch {
      error.value = 'Errore salvataggio impostazioni'
    } finally {
      loading.value = false
    }
  }

  async function fetchAll() {
    loading.value = true
    try {
      await Promise.all([fetchCurrent(), fetchReadings(), fetchSettings()])
    } finally {
      loading.value = false
    }
  }

  async function setRange(minutes: number) {
    selectedRange.value = minutes
    await fetchReadings()
  }

  async function addInsulin(type: 'rapid' | 'slow', units: number, timestamp: string | null = null) {
    loading.value = true
    try {
      await api().post('/api/insulin', {
        timestamp: timestamp || new Date().toISOString(),
        type,
        units
      })
      await fetchReadings()
    } catch {
      error.value = 'Errore aggiunta insulina'
    } finally {
      loading.value = false
    }
  }

  async function removeInsulin(id: number) {
    loading.value = true
    try {
      await api().delete(`/api/insulin/${id}`)
      await fetchReadings()
    } catch {
      error.value = 'Errore eliminazione insulina'
    } finally {
      loading.value = false
    }
  }

  async function editInsulin(id: number, { timestamp, type, units }: { timestamp: string, type: string, units: number }) {
    loading.value = true
    try {
      await api().put(`/api/insulin/${id}`, { timestamp, type, units })
      await fetchReadings()
    } catch {
      error.value = 'Errore modifica insulina'
    } finally {
      loading.value = false
    }
  }

  async function syncNow() {
    loading.value = true
    try {
      await api().post('/api/sync')
      await fetchAll()
    } catch {
      error.value = 'Errore sync'
    } finally {
      loading.value = false
    }
  }

  async function fetchLongHistory(minutes = 4320) {
    historyLoading.value = true
    try {
      const [{ data: rData }, { data: iData }, { data: cData }, { data: nData }] = await Promise.all([
        api().get('/api/readings', { params: { range: minutes } }),
        api().get('/api/insulin', { params: { range: minutes } }),
        api().get('/api/carbs', { params: { range: minutes } }),
        api().get('/api/notes', { params: { range: minutes } })
      ])
      historyReadings.value = rData
      historyInsulin.value = iData
      historyCarbs.value = cData
      historyNotes.value = nData
      error.value = null
    } catch {
      error.value = 'Errore caricamento analisi'
    } finally {
      historyLoading.value = false
    }
  }

  async function fetchHistory(date: string) {
    historyLoading.value = true
    try {
      const [{ data: rData }, { data: iData }, { data: cData }, { data: nData }] = await Promise.all([
        api().get('/api/history/readings', { params: { date } }),
        api().get('/api/history/insulin', { params: { date } }),
        api().get('/api/history/carbs', { params: { date } }),
        api().get('/api/history/notes', { params: { date } })
      ])
      historyReadings.value = rData
      historyInsulin.value = iData
      historyCarbs.value = cData
      historyNotes.value = nData
      error.value = null
    } catch {
      error.value = 'Errore caricamento storico'
    } finally {
      historyLoading.value = false
    }
  }

  async function getDietFoods() {
    try {
      const { data } = await api().get('/api/diet/foods')
      return data
    } catch {
      error.value = 'Errore caricamento alimenti'
      return []
    }
  }

  async function addDietFood(food: any) {
    try {
      await api().post('/api/diet/foods', food)
      return true
    } catch {
      error.value = 'Errore aggiunta alimento'
      return false
    }
  }

  return {
    current, readings, insulinRecords, carbRecords, notes, selectedRange, carbDraftAmount, loading, chartLoading, error, lastUpdated,
    settings,
    historyReadings, historyInsulin, historyCarbs, historyNotes, historyLoading,
    glucoseColor, minutesAgo, stats, historyStats, iob, cob, prediction, patterns,
    hasSyncError,
    fetchCurrent, fetchReadings, fetchAll, setRange, syncNow, 
    addInsulin, removeInsulin, editInsulin,
    addCarb, removeCarb, editCarb,
    addNote, removeNote, editNote,
    fetchHistory, fetchLongHistory, fetchSettings, updateSettings, resetSettings, getStatusColor,
    getDietFoods, addDietFood
  }
})
