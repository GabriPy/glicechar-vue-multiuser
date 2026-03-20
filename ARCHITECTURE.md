# 🏗️ Architettura GliceChart multiuser-v1.0

Dettagli tecnici sul funzionamento interno, la sicurezza e la gestione dei dati nella versione multiutente basata su **TypeScript** e **ES Modules (ESM)**.

---

## 1. Modello dei Dati (Isolamento Multi-tenant)

Il cuore del sistema è l'isolamento totale dei dati tra gli utenti. Ogni tabella nel database MySQL contiene una colonna `user_id` che funge da chiave esterna obbligatoria.

### Schema Database:
- **`users`**: Gestione account, hash password (bcrypt), flag `isAdmin` e dati sincronizzazione Gluroo.
- **`readings`**: Letture glicemiche cronologiche, ciascuna legata a un `user_id`.
- **`insulin_records` / `carb_records` / `note_records`**: Storico terapie e note individuali.
- **`settings`**: Parametri clinici (TIR, soglie critiche, ISF, CR) specifici per ogni account.
- **`refresh_tokens`**: Gestione sessioni persistenti per la sicurezza JWT.

---

## 2. Sicurezza e Autenticazione

Il sistema implementa standard di sicurezza moderni per proteggere i dati clinici sensibili:

### Autenticazione JWT (Two-Token System)
1.  **Access Token**: Breve durata (15 min), richiesto per ogni operazione API.
2.  **Refresh Token**: Lunga durata (7 giorni), salvato in modo sicuro per rinnovare l'accesso senza rifare il login.
3.  **Password Hashing**: Implementazione di `bcryptjs` con 10 salt rounds.

### Validazione Input (Zod)
Tutte le richieste API (POST/PUT) passano attraverso schemi di validazione **Zod** (`backend/validators.ts`). Questo garantisce che i dati siano correttamente formattati, prevenendo injection e errori di runtime.

---

## 3. Motore di Sincronizzazione Multi-utente

Il backend esegue un ciclo di polling parallelo ottimizzato:
1.  **Recupero Utenti**: Seleziona dal DB tutti gli utenti con credenziali Gluroo valide.
2.  **Polling Parallelo**: Esegue chiamate asincrone simultanee alle API Gluroo per ogni utente.
3.  **Normalizzazione Dati**: I dati grezzi vengono puliti (es. correzione URL) e salvati solo se non già presenti.
4.  **Error Handling**: Se un utente ha credenziali errate, il sistema segnala l'errore nel database (campo `last_sync_error`) permettendo al frontend di mostrare un avviso, senza bloccare gli altri utenti.

---

## 4. Frontend & State Management (Vue 3)

### Pinia Stores (ESM)
- **`auth.ts`**: Gestisce lo stato dell'utente, i permessi, e intercetta le risposte 401 per eseguire l'auto-refresh del token JWT.
- **`glucose.ts`**: Contiene la logica di calcolo clinico (GMI, eA1c, IOB, COB) e le predizioni matematiche.

### UI Engine (Tailwind CSS 4)
L'interfaccia è costruita con **Tailwind CSS 4** in modalità "CSS-first", garantendo una build estremamente leggera e performance di rendering elevate anche su dispositivi mobili.

---

## 5. Deployment & Scalabilità

- **TypeScript Nativo**: Utilizzo di `tsx` nel backend per l'esecuzione diretta senza compilazione manuale intermedia.
- **Gestione Processi**: Supporto ufficiale per **PM2** per garantire il riavvio automatico e la gestione dei log.
- **Porta Default**: `3002` per il backend, configurabile tramite file `.env`.
