# 🛠️ Guida all'Installazione v1.3.0

Segui questi passaggi per installare e configurare **GliceChart-multiuser** sul tuo server locale o remoto.

## 1. Prerequisiti

Assicurati di avere installato:
- **Node.js 20.x** o superiore.
- **MySQL 8.0** o superiore.
- **NPM** o **Yarn**.
- **PM2** e **tsx** installati globalmente: `npm install -g pm2 tsx`.

---

## 2. Configurazione Database MySQL

Crea il database dedicato e un utente con i privilegi necessari. È fondamentale che l'utente abbia i permessi di `CREATE`, `ALTER` e `INDEX` per consentire l'auto-migrazione dello schema al primo avvio.

```sql
-- Creazione Database
CREATE DATABASE `glicechart-multiutente` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Creazione Utente (Sostituisci 'TUA_PASSWORD_SICURA')
CREATE USER 'glucoview'@'localhost' IDENTIFIED BY 'TUA_PASSWORD_SICURA';

-- Assegnazione Privilegi
GRANT ALL PRIVILEGES ON `glicechart-multiutente`.* TO 'glucoview'@'localhost';
FLUSH PRIVILEGES;
```

> **💡 Risoluzione Problemi**: Se riscontri `ER_ACCESS_DENIED_ERROR` all'avvio del backend, verifica che le credenziali nel file `.env` corrispondano esattamente a quelle create sopra e che il servizio MySQL sia attivo. In alcuni sistemi, potrebbe essere necessario usare `127.0.0.1` invece di `localhost` nel file `.env`.

---

## 3. Installazione Dipendenze

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## 4. Configurazione Ambiente (.env)

Crea un file `.env` nella cartella `backend/` seguendo questo schema:

```env
# Database
DB_HOST=localhost
DB_USER=glucoview
DB_PASSWORD=TUA_PASSWORD_SICURA
DB_NAME=glicechart-multiutente

# Sicurezza (JWT)
JWT_SECRET=genera_una_stringa_casuale_lunga
REFRESH_TOKEN_SECRET=genera_un_altra_stringa_casuale_lunga

# ── Email (Resend API - Consigliato) ────────────────────────
# Ottieni la tua API Key su https://resend.com
RESEND_API_KEY=tua_api_key_resend
RESEND_PASSWORDRECOVERY_TEMPLATE_ID=password-reset
RESEND_WELCOME_TEMPLATE_ID=welcome-newuser

# Mittente autorizzato
EMAIL_FROM="GliceChart" <noreply@glicechart.ghibiri.it>

# ── Email (SMTP Tradizionale - Alternativa) ────────────────
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
# EMAIL_FROM viene usato anche qui se RESEND_API_KEY è vuota.

# Server
PORT=3002
FRONTEND_URL=https://tuo-dominio.it
POLL_INTERVAL_SECONDS=15
```

---

## 5. Configurazione Invio Email

Il sistema è preconfigurato per usare il mailer locale del server (Postfix/Sendmail) su Linux. Se vuoi usare un servizio esterno (Gmail, Outlook, Resend, ecc.), compila i campi `EMAIL_HOST`, `EMAIL_USER` e `EMAIL_PASS` nel file `.env`.

---

## 6. Avvio del Sistema

### Sviluppo
Backend (con hot-reload): `cd backend && npm run dev`  
Frontend (Vite): `cd frontend && npm run dev`

### Produzione (Consigliato)
Utilizza **PM2** per gestire il backend in background:

```bash
# Build frontend
cd frontend
npm run build

# Avvio backend con PM2 e tsx
cd ../backend
pm2 start tsx --name "glicechart-backend" -- server.ts
```

---

## 7. Primo Accesso e Privilegi Admin

1.  Apri il browser su `http://tuo-ip:3002`.
2.  Vai alla pagina di **Registrazione** e crea il tuo account.
3.  Per abilitare i privilegi amministrativi, modifica manualmente il database (campo `isAdmin = 1` nella tabella `users`).
4.  **Sicurezza**: Una volta loggato come Admin, non potrai rimuovere i tuoi privilegi o eliminare il tuo account dal pannello per evitare lock-out accidentali.
