// gluroo.ts - Chiamate alle API Gluroo
import axios from 'axios';

function normalizeTrend(raw: any): string {
  if (raw === undefined || raw === null) return 'FLAT';
  
  if (typeof raw === 'number') {
    const numMap: Record<number, string> = {
      1: 'RISING_FAST',
      2: 'RISING',
      3: 'RISING_SLOW',
      4: 'FLAT',
      5: 'FALLING_SLOW',
      6: 'FALLING',
      7: 'FALLING_FAST',
    };
    return numMap[raw] || 'FLAT';
  }

  const t = String(raw).toUpperCase().replace(/[\s_]/g, '');
  const strMap: Record<string, string> = {
    'DOUBLEUP':        'RISING_FAST',
    'SINGLEUP':        'RISING',
    'FORTYFIVEUP':     'RISING_SLOW',
    'FLAT':            'FLAT',
    'FORTYFIVEDOWN':   'FALLING_SLOW',
    'SINGLEDOWN':      'FALLING',
    'DOUBLEDOWN':      'FALLING_FAST',
    'UP':              'RISING',
    'DOWN':            'FALLING',
    'NONE':            'FLAT',
    'NOTCOMPUTABLE':   'FLAT',
  };
  return strMap[t] || 'FLAT';
}

export async function fetchLatestReadings(token: string, secret: string, baseUrl: string) {
  if (!token || !secret || !baseUrl) throw new Error('Credenziali Gluroo mancanti');

  const normalizedUrl = baseUrl.replace(/\/+$/, '');

  const { data } = await axios.get(`${normalizedUrl}/api/v1/entries/sgv.json`, {
    params:  { count: 288 },
    headers: {
      'api-secret':    secret,
      'Authorization': `Bearer ${token}`,
      'Accept':        'application/json',
    },
    timeout: 10000,
  });

  if (!Array.isArray(data)) throw new Error('Risposta API non valida');

  return data.map(e => {
    const rawTrend = e.trend !== undefined ? e.trend : e.direction;
    return {
      timestamp: e.dateString
        ? new Date(e.dateString).toISOString()
        : new Date(e.date).toISOString(),
      glucose:   Math.round(e.sgv || e.glucose || 0),
      trend:     normalizeTrend(rawTrend),
      raw_trend: String(rawTrend !== undefined ? rawTrend : ''),
    };
  });
}
