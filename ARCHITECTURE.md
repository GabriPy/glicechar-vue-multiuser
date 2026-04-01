# 🏗️ Architettura Tecnica - GliceChart v1.4.4

Panoramica dettagliata della struttura, delle tecnologie e delle logiche core del sistema GliceChart Multiuser.

---

## 1. Stack Tecnologico

Il progetto segue una filosofia **Full-Stack TypeScript** per garantire coerenza e robustezza del codice.

- **Frontend**: Vue 3 (Composition API) + Vite + Tailwind CSS + DaisyUI 5.
- **State Management**: Pinia (Store modulari).
- **Backend**: Node.js + Express + TypeScript.
- **Database**: MySQL 8.0 con pool di connessioni ottimizzato.
- **Validazione**: Zod (Schema validation per API e DB).
- **Comunicazione**: Axios con intercettori per la gestione automatica dei token.

---

## 2. Sicurezza e Multi-utenza

L'architettura è nativamente multi-tenant, garantendo l'isolamento dei dati a livello applicativo.

### Isolamento dei Dati
Ogni record (glicemia, insulina, carboidrati, note) è associato a un `user_id` univoco. Le query al database includono sempre il filtro sull'ID dell'utente autenticato, impedendo fughe di dati tra account.

### Sistema di Autenticazione (JWT)
Utilizziamo un sistema a doppio token per massimizzare la sicurezza:
- **Access Token**: Memorizzato in memoria (stato Pinia), scade ogni 15 minuti.
- **Refresh Token**: Memorizzato in modo sicuro nel database, permette di ottenere nuovi access token senza richiedere il login.
- **Auto-Logout**: Al cambio password, tutti i refresh token attivi vengono invalidati, disconnettendo l'account da ogni dispositivo.

---

## 3. GliceForecast™ v3.1

L'algoritmo di predizione è il cuore tecnologico di GliceChart. Simula l'andamento glicemico futuro basandosi su:

1. **Damping Esponenziale**: Il trend attuale viene proiettato nel futuro ma smorzato gradualmente per riflettere la stabilità metabolica.
2. **Curve di Assorbimento Gaussiane**: L'impatto di insulina e carboidrati non è lineare, ma segue modelli fisiologici a campana (PK/PD).
3. **Sensor Trend Bias**: Integra i dati di tendenza provenienti dal CGM (Nightscout/Gluroo) per correggere la traiettoria iniziale.
4. **Fattore Notturno**: Applica correzioni specifiche durante le ore di sonno per compensare il fenomeno dell'alba o variazioni basali.

---

## 4. Design System

Abbiamo adottato un linguaggio visivo moderno basato su:
- **Tipografia**: *Plus Jakarta Sans* per l'interfaccia, *JetBrains Mono* per i dati numerici.
- **Componenti**: Basati su DaisyUI 5, personalizzati per un look "Glassmorphism" con ombre profonde e bordi arrotondati (`2xl`, `3xl`).
- **Feedback Visivo**: Indicatori di stato pulsanti per migliorare la percezione di reattività.

---

## 5. Sincronizzazione Dati

Il backend gestisce un motore di sincronizzazione asincrono:
- Effettua il polling delle API di Gluroo/Nightscout per ogni utente attivo.
- Gestisce la de-duplicazione dei dati basandosi sui timestamp originali del sensore.
- Notifica l'utente in caso di errori persistenti di sincronizzazione tramite l'interfaccia.

---

© 2026 GliceChart Team - Sviluppato per la precisione.
