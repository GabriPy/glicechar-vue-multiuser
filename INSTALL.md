# 🛠️ Guida all'Installazione v1.2.0

Segui questi passaggi per installare e configurare **GliceChart-multiuser** sul tuo server locale o remoto.

## 1. Prerequisiti

Assicurati di avere installato:
- **Node.js 20.x** o superiore.
- **MySQL 8.0** o superiore.
- **NPM** o **Yarn**.
- **PM2** e **tsx** installati globalmente: `npm install -g pm2 tsx`.
- **PHP 7.4+** sul server web per l'invio delle email (opzionale ma consigliato).

---

## 2. Configurazione Database MySQL

Crea il database dedicato e un utente dedicato:

```sql
CREATE DATABASE `glicechart-multiutente` CHARACTER SET utf8mb4;
CREATE USER 'glicechart_admin'@'localhost' IDENTIFIED BY 'TUA_PASSWORD_SICURA';
GRANT ALL PRIVILEGES ON `glicechart-multiutente`.* TO 'glicechart_admin'@'localhost';
FLUSH PRIVILEGES;
```

> **Nota**: Il sistema inizializzerà automaticamente lo schema (tabelle e indici) al primo avvio del server backend.

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
DB_USER=glicechart_admin
DB_PASSWORD=TUA_PASSWORD_SICURA
DB_NAME=glicechart-multiutente

# Sicurezza (JWT)
JWT_SECRET=genera_una_stringa_casuale_lunga
REFRESH_TOKEN_SECRET=genera_un_altra_stringa_casuale_lunga

# Email (Local Mailer - Consigliato su Linux)
# Se lasci EMAIL_HOST vuoto, userà il comando 'sendmail' locale.
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM="GliceChart" <noreply@mglicechart.ghibiri.it>

# Server
PORT=3002
FRONTEND_URL=https://mglicechart.ghibiri.it
POLL_INTERVAL_SECONDS=15
```

---

## 5. Configurazione Invio Email (Linux)

Il sistema è preconfigurato per usare il mailer locale del server (Postfix/Sendmail). Non devi fare nulla se il tuo server Linux è già in grado di inviare email. Se invece vuoi usare un servizio esterno (Gmail, Outlook, ecc.), compila i campi `EMAIL_HOST`, `EMAIL_USER` e `EMAIL_PASS` nel file `.env`.

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
