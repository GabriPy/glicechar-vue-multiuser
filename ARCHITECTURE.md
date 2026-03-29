# 🏗️ Architettura GliceChart v1.3.0

Dettagli tecnici sul funzionamento interno, la sicurezza e la gestione dei dati nella versione multiutente basata su **TypeScript** e **ES Modules (ESM)**.

---

## 1. Modello dei Dati (Isolamento Multi-tenant)

Il cuore del sistema è l'isolamento totale dei dati tra gli utenti. Ogni tabella nel database MySQL contiene una colonna `user_id` che funge da chiave esterna obbligatoria.

### Schema Database:
- **`users`**: Gestione account, hash password (bcrypt), flag `isAdmin` e dati sincronizzazione Gluroo.
- **`readings`**: Letture glicemiche cronologiche, ciascuna legata a un `user_id`.
- **`insulin_records` / `carb_records` / `note_records`**: Storico terapie e note individuali.
- **`settings`**: Parametri clinici (TIR, soglie critiche `red_under`/`red_over`, ISF, CR) specifici per ogni account.
- **`refresh_tokens`**: Gestione sessioni persistenti per la sicurezza JWT.

---

## 2. Sicurezza e Amministrazione

Il sistema implementa standard di sicurezza moderni e meccanismi di auto-protezione:

### Autenticazione JWT (Two-Token System)
1.  **Access Token (`JWT_SECRET`)**: Breve durata (15 min) per l'identificazione di ogni richiesta.
2.  **Refresh Token (`REFRESH_TOKEN_SECRET`)**: Lunga durata (30 giorni) per mantenere l'utente loggato in modo sicuro.
    - **Invalidazione**: Tutte le sessioni attive vengono terminate (i refresh tokens vengono eliminati) quando la password viene cambiata o ripristinata, garantendo che eventuali account compromessi vengano disconnessi immediatamente.

### Auto-Protezione Amministrativa (v1.3.0)
Il sistema integra meccanismi di sicurezza per prevenire errori operativi critici:
- **Prevenzione Lock-out**: Le API e l'interfaccia impediscono agli amministratori di rimuovere il proprio flag `isAdmin` o eliminare il proprio account.
- **Validazione Identità**: Ogni operazione su account altrui viene validata incrociando l'ID della sessione con l'ID dell'utente target.
- **Integrità Password**: I link di ripristino vengono invalidati immediatamente dopo l'uso o in seguito a un cambio password manuale dalle impostazioni.
- **Integrità Query**: Le query amministrative sono ottimizzate per restituire sempre l'indirizzo email e i dati di registrazione corretti per il monitoraggio degli utenti.

### Algoritmo di Predizione GliceForecast v3.0
Il sistema utilizza un modello deterministico a simulazione discreta (minuto per minuto) per prevedere l'andamento glicemico a 60 minuti:

1.  **Damping Esponenziale del Trend**: Il Rate of Change (ROC) calcolato sulle ultime 5 letture viene smorzato nel tempo utilizzando un fattore $e^{-m/45}$, riflettendo la naturale tendenza della glicemia a stabilizzarsi.
2.  **Integrazione Trend Arrow**: La velocità iniziale viene corretta in base alla freccia del sensore (es. ±1.5 mg/dL per freccia doppia).
3.  **Curve di Attività Gaussiane**:
    - **Insulina**: Modello a campana con picco a 75 minuti, modellando la farmacocinetica reale dell'insulina rapida.
    - **Carboidrati**: Tre profili di assorbimento (Rapido, Medio, Lento) basati su differenti distribuzioni gaussiane.
4.  **Pressione Insulinica & Bias Notturno**:
    - Considera l'impatto dell'insulina ancora attiva (IOB) sulla tendenza futura.
    - Applica un bias correttivo durante le ore notturne (00:00 - 06:00) per compensare variazioni del metabolismo basale.
5.  **Intervallo di Confidenza**: Fornisce una fascia di probabilità (min/max) basata sulla volatilità del segnale recente.

---

## 3. Motore di Sincronizzazione Multi-utente

Il backend esegue un ciclo di polling parallelo ottimizzato per ogni utente registrato con credenziali Gluroo valide. Il sistema de-duplica i dati basandosi sul timestamp univoco di ogni lettura.

---

## 4. Frontend & Design System (Vue 3)

### Tipografia e Iconografia (v1.3.0)
Il design system è stato riprogettato per migliorare la leggibilità e l'esperienza utente:
- **Font Strategici**: **Plus Jakarta Sans** per l'interfaccia utente e **JetBrains Mono** per i dati numerici e tecnici.
- **Icon Engine**: Le icone sono ora racchiuse in contenitori quadrati con angoli arrotondati (`rounded-2xl/3xl`) per una coerenza visiva totale.
- **Pulsing Status Indicator**: Un indicatore circolare pulsante accanto alla glicemia attuale comunica lo stato (Verde, Giallo, Rosso) senza dipendere dal colore del testo numerico, che rimane nero per massima leggibilità.
- **Geometria & Centratura**: Tutte le card statistiche della homepage sono state riallineate con testi e icone perfettamente centrati.

### Pinia Stores (ESM)
- **`auth.ts`**: Gestisce lo stato dell'utente, i permessi, e intercetta le risposte 401 per l'auto-refresh.
- **`glucose.ts`**: Logica di calcolo clinico (GMI, eA1c, IOB, COB) e predizioni matematiche v2.2.

---

## 5. Deployment & Scalabilità

- **TypeScript Nativo**: Utilizzo di `tsx` nel backend per l'esecuzione diretta senza compilazione manuale.
- **Gestione Processi**: Supporto ufficiale per **PM2** per garantire il riavvio automatico e il monitoraggio.
- **Porta Default**: `3002`.
