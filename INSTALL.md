# 📥 Guida all'Installazione - GliceChart Multiuser v1.3.0

Segui questi passaggi per configurare GliceChart sul tuo server Linux/Windows.

---

## 1. Prerequisiti

- **Node.js** (v18 o superiore)
- **MySQL** (v8.0 o superiore)
- **Git**
- Una chiave API di **Resend** (gratuita su [resend.com](https://resend.com))

---

## 2. Configurazione Database MySQL

Crea il database dedicato e un utente con i privilegi necessari. È fondamentale che l'utente abbia i permessi di `CREATE`, `ALTER` e `INDEX` per consentire l'auto-migrazione dello schema al primo avvio.

```sql
-- Creazione Database
CREATE DATABASE IF NOT EXISTS `glicechart-multiutente` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Creazione Utente (Sostituisci 'TUA_PASSWORD_SICURA')
CREATE USER IF NOT EXISTS 'glucoview'@'localhost' IDENTIFIED BY 'TUA_PASSWORD_SICURA';

-- Assegnazione Privilegi
GRANT ALL PRIVILEGES ON `glicechart-multiutente`.* TO 'glucoview'@'localhost';
FLUSH PRIVILEGES;
```

---

## 3. Configurazione Ambiente (.env)

Nella cartella `backend/`, rinomina il file `.env.example` in `.env` (o crealo) e configura i seguenti parametri critici:

```env
# URL Pubblico dell'app
FRONTEND_URL=https://glicechart.ghibiri.it

# MySQL
DB_HOST=localhost
DB_USER=glucoview
DB_PASSWORD=TUA_PASSWORD_SICURA
DB_NAME=glicechart-multiutente

# SICUREZZA JWT (Genera chiavi casuali!)
# Puoi usare: openssl rand -base64 32
JWT_SECRET=inserisci_qui_una_chiave_molto_lunga
REFRESH_TOKEN_SECRET=inserisci_qui_un_altra_chiave_molto_lunga

# EMAIL (Resend API)
RESEND_API_KEY=re_tua_chiave
RESEND_PASSWORDRECOVERY_TEMPLATE_ID=password-reset
RESEND_WELCOME_TEMPLATE_ID=welcome-newuser
EMAIL_FROM="GliceChart" <noreply@glicechart.ghibiri.it>
```

---

## 4. Installazione e Build

### Backend
```bash
cd backend
npm install
# Per avviare in sviluppo: npm run dev
# Per avviare in produzione: npm start
```

### Frontend
```bash
cd frontend
npm install
npm run build
```

---

## 5. Messa in Produzione

Per mantenere il server sempre attivo su un VPS, si consiglia l'uso di **PM2**:

```bash
cd backend
npm install -g pm2
pm2 start server.ts --name "glicechart" --interpreter tsx
```

Assicurati di configurare un reverse proxy come **Nginx** per gestire il certificato SSL (HTTPS) e puntare al backend sulla porta 3002.

---

© 2024 GliceChart Team - [glicechart.ghibiri.it](https://glicechart.ghibiri.it)
