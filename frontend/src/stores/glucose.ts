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
  speed?: 'fast' | 'normal' | 'slow';
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
      
      // Decadimento lineare per la visualizzazione semplice in header
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
      
      // Decadimento lineare per la visualizzazione semplice in header
      const factor = 1 - (elapsedMs / durationMs)
      return total + (Number(carb.amount) * factor)
    }, 0)
  })

  // ── Helper Attività (Curve Gaussiane) ───────────────────────────────────
  function gaussian(x: number, peak: number, width: number) {
    return Math.exp(-Math.pow(x - peak, 2) / (2 * width * width))
  }

  function getInsulinActivity(elapsedMinutes: number) {
    // Picco a 75 min, deviazione standard 35 min
    return gaussian(elapsedMinutes, 75, 35)
  }

  function getCarbActivity(elapsedMinutes: number, speed: 'fast' | 'normal' | 'slow' = 'normal') {
    if (speed === 'fast')   return gaussian(elapsedMinutes, 20, 15)
    if (speed === 'normal') return gaussian(elapsedMinutes, 50, 30)
    return gaussian(elapsedMinutes, 110, 50)
  }

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

  // ── Predizione Glicemia v3.0 (Simulazione Minuto per Minuto) ──────────────
  const prediction = computed(() => {
    if (!current.value || readings.value.length < 5) return null

    const nowTs = new Date().getTime()
    const recent5 = readings.value.slice(-5)
    const smoothedCurrent = Math.round(recent5.reduce((a, b) => a + b.glucose, 0) / recent5.length)

    // Calcolo Rate of Change (ROC)
    const firstReading = readings.value[readings.value.length - 5]
    const lastReading = readings.value[readings.value.length - 1]
    const dt = (new Date(lastReading.timestamp).getTime() - new Date(firstReading.timestamp).getTime()) / 60000
    const dg = lastReading.glucose - firstReading.glucose
    let roc = dg / dt

    // Correzione basata sulla freccia del sensore (Trend)
    const trend = current.value.trend
    if (trend === 'DoubleDown') roc -= 1.5
    if (trend === 'SingleDown') roc -= 0.7
    if (trend === 'SingleUp')   roc += 0.7
    if (trend === 'DoubleUp')   roc += 1.5

    const ISF = Number(settings.value.insulin_sensitivity) || 60
    const carbRatio = Number(settings.value.carb_ratio) || 15
    const CR = ISF / carbRatio

    // Simulazione minuto per minuto
    const simulate = (minutesAhead: number) => {
      let predicted = smoothedCurrent
      
      // Effetto "Pressione Insulina" (basato su IOB totale)
      const insulinPressure = iob.value * ISF
      const pressureImpact = (insulinPressure * 0.15) / 60 // Impatto spalmato su 60 min

      for (let m = 1; m <= minutesAhead; m++) {
        // 1. Smorzamento Trend (Damping esponenziale)
        const damping = Math.exp(-m / 45)
        const trendEffect = roc * damping

        // 2. Impatto Insulina Attiva (Integrale della curva gaussiana)
        let insulinEffect = 0
        allInsulin.value.forEach(ins => {
          if (ins.type !== 'rapid') return
          const elapsed = (nowTs - new Date(ins.timestamp).getTime()) / 60000 + m
          if (elapsed < 0 || elapsed > 360) return // Oltre 6 ore l'effetto è nullo
          
          // L'attività è normalizzata per unità. ISF determina l'abbassamento totale.
          // Approssimiamo l'area sotto la curva per questo minuto
          const activity = getInsulinActivity(elapsed)
          // Fattore di scala per far sì che l'integrale della gaussiana * ISF = abbassamento totale
          // La costante 0.011 è un'approssimazione per l'integrale della nostra specifica gaussiana
          insulinEffect += (Number(ins.units) * activity * ISF * 0.011)
        })

        // 3. Impatto Carboidrati Attivi
        let carbEffect = 0
        allCarbs.value.forEach(carb => {
          const elapsed = (nowTs - new Date(carb.timestamp).getTime()) / 60000 + m
          if (elapsed < 0 || elapsed > 360) return
          
          const activity = getCarbActivity(elapsed, carb.speed || 'normal')
          // Costante 0.013 approssimativa per l'integrale della curva carboidrati
          carbEffect += (Number(carb.amount) * activity * CR * 0.013)
        })

        // 4. Bias Notturno (00:00 - 06:00) basato sul fuso orario dell'utente
        const userTz = auth.user?.timezone || 'Europe/Rome'
        const hourStr = new Intl.DateTimeFormat('en-US', {
          timeZone: userTz,
          hour: 'numeric',
          hour12: false
        }).format(new Date(nowTs + m * 60000))
        const currentHour = parseInt(hourStr)
        
        let nightBias = 0
        if (currentHour >= 0 && currentHour <= 6) {
          nightBias = 0.08 // ~5 mg/dL all'ora
        }

        predicted += trendEffect - insulinEffect + carbEffect - pressureImpact - nightBias
      }

      return predicted
    }

    const p15 = Math.round(Math.max(40, Math.min(400, simulate(15))))
    const p30 = Math.round(Math.max(40, Math.min(400, simulate(30))))
    const p60 = Math.round(Math.max(40, Math.min(400, simulate(60))))

    // Calcolo intervallo di confidenza e probabilità
    const variability = Math.abs(roc) * 10 + 5
    const minExpected = Math.round(Math.max(40, p60 - variability))
    const maxExpected = Math.round(Math.min(400, p60 + variability))
    
    // Confidenza decresce col tempo e aumenta con la stabilità del trend
    const confidence = Math.round(Math.max(30, 95 - (Math.abs(roc) * 15)))

    let trendLabel = 'stable'
    if (roc > 2.0) trendLabel = 'fast_rising'
    else if (roc > 0.5) trendLabel = 'rising'
    else if (roc < -2.0) trendLabel = 'fast_falling'
    else if (roc < -0.5) trendLabel = 'falling'

    return {
      current: smoothedCurrent,
      t15: p15,
      t30: p30,
      t60: p60,
      minExpected,
      maxExpected,
      confidence,
      likelyHypo: p15 < 70 || p30 < 70 || p60 < 70,
      likelyHyper: p15 > 200 || p30 > 200 || p60 > 200,
      roc: roc.toFixed(2),
      trend: trendLabel
    }
  })

  // ── Analisi Pattern Intelligenti ───────────────────────────
  const patterns = computed(() => {
    const allHistoryReadings = historyReadings.value || []
    const allHistoryNotes = historyNotes.value || []
    if (allHistoryReadings.length < 288) return []

    const discoveredPatterns: any[] = []

    const userTz = auth.user?.timezone || 'Europe/Rome'
    const hourlyTrends = Array.from({ length: 24 }, () => ({ slopes: [] as number[], values: [] as number[] }))
    
    allHistoryReadings.forEach((r, idx) => {
      if (idx === 0) return
      const date = new Date(r.timestamp)
      const hourStr = new Intl.DateTimeFormat('en-US', {
        timeZone: userTz,
        hour: 'numeric',
        hour12: false
      }).format(date)
      const hour = parseInt(hourStr)
      
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
    // Se l'utente non è autenticato, non mostriamo errori di sync
    if (!auth.isAuthenticated) return false;

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
      if (e.response?.status === 404) {
        current.value = null;
      } else {
        error.value = e.response?.data?.error || 'Impossibile caricare dato attuale'
      }
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

  async function addCarb(amount: number, timestamp: string | null = null, speed: 'fast' | 'normal' | 'slow' = 'normal') {
    loading.value = true
    try {
      await api().post('/api/carbs', {
        timestamp: timestamp || new Date().toISOString(),
        amount,
        speed
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

  async function editCarb(id: number, { timestamp, amount, speed }: { timestamp: string, amount: number, speed?: 'fast' | 'normal' | 'slow' }) {
    loading.value = true
    try {
      await api().put(`/api/carbs/${id}`, { timestamp, amount, speed: speed || 'normal' })
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
      return true
    } catch (e: any) {
      error.value = e.response?.data?.error || 'Errore salvataggio impostazioni'
      return false
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

  function clearAll() {
    current.value = null
    readings.value = []
    allInsulin.value = []
    allCarbs.value = []
    notes.value = []
    error.value = null
    historyReadings.value = []
    historyInsulin.value = []
    historyCarbs.value = []
    historyNotes.value = []
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
    getDietFoods, addDietFood, clearAll
  }
})
