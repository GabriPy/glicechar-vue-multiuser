# 🏗️ Architettura GliceChart v1.2.0

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

## 2. Sicurezza e Autenticazione

Il sistema implementa standard di sicurezza moderni per proteggere i dati clinici sensibili:

### Autenticazione JWT (Two-Token System)
1.  **Access Token (`JWT_SECRET`)**: Breve durata (15 min) per l'identificazione di ogni richiesta.
2.  **Refresh Token (`REFRESH_TOKEN_SECRET`)**: Lunga durata (30 giorni) per mantenere l'utente loggato in modo sicuro.

### Email Recovery (PHP Bridge)
Per garantire la massima compatibilità con i server web e superare i limiti di SMTP esterni, la v1.1 Premium utilizza un bridge PHP leggero (`mail.php`) per l'invio delle email di recupero password.

---

## 3. Motore di Sincronizzazione Multi-utente

Il backend esegue un ciclo di polling parallelo ottimizzato:
1.  **Recupero Utenti**: Seleziona dal DB tutti gli utenti con credenziali Gluroo valide.
2.  **Polling Parallelo**: Esegue chiamate asincrone simultanee alle API Gluroo per ogni utente.
3.  **Normalizzazione Dati**: I dati grezzi vengono puliti (es. correzione URL) e salvati solo se non già presenti.

---

## 4. Frontend & State Management (Vue 3)

### Pinia Stores (ESM)
- **`auth.ts`**: Gestisce lo stato dell'utente, i permessi, e intercetta le risposte 401 per eseguire l'auto-refresh del token JWT.
- **`glucose.ts`**: Contiene la logica di calcolo clinico (GMI, eA1c, IOB, COB) e le predizioni matematiche v2.1.

### UI Engine (Tailwind CSS 4 & DaisyUI 5)
L'interfaccia Premium è costruita con **Tailwind CSS 4** e **daisyUI 5**, utilizzando un sistema di temi unificato che garantisce un'esperienza visiva coerente, reattiva e moderna (Premium Aesthetic).

---

## 5. Deployment & Scalabilità

- **TypeScript Nativo**: Utilizzo di `tsx` nel backend per l'esecuzione diretta.
- **Gestione Processi**: Supporto ufficiale per **PM2**.
- **Porta Default**: `3002`.
