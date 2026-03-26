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

# Email (PHP Mailer Bridge - Consigliato)
PHP_MAILER_URL=https://tuodominio.it/mail.php
PHP_MAILER_SECRET=glicechart_secret_mail_key

# Server
PORT=3002
FRONTEND_URL=https://mglicechart.ghibiri.it
POLL_INTERVAL_SECONDS=15
```

---

## 5. Configurazione PHP Mailer (Invio Email)

1.  Carica il file `backend/mail.php` nella cartella pubblica del tuo server web (es: `public_html`).
2.  Assicurati che la variabile `$SECRET_KEY` in `mail.php` coincida con `PHP_MAILER_SECRET` nel tuo file `.env`.
3.  Imposta l'URL completo del file in `PHP_MAILER_URL`.

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
