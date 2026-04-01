# 📥 Guida all'Installazione - GliceChart v1.4.4

Questa guida ti accompagnerà nel processo di installazione e configurazione di GliceChart sul tuo server (Linux o Windows).

---

## 1. Requisiti di Sistema

Prima di iniziare, assicurati di avere installato:
- **Node.js**: v18.x o superiore (LTS raccomandata)
- **MySQL**: v8.0 o superiore
- **Package Manager**: npm (incluso con Node.js)
- **Git**: Per la clonazione del repository

---

## 2. Preparazione del Database

Accedi alla tua istanza MySQL e crea il database e l'utente dedicato:

```sql
-- 1. Crea il database con codifica corretta
CREATE DATABASE IF NOT EXISTS `glicechart` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Crea l'utente (cambia 'PASSWORD_SICURA' con una tua scelta)
CREATE USER IF NOT EXISTS 'glice_user'@'localhost' IDENTIFIED BY 'PASSWORD_SICURA';

-- 3. Assegna i privilegi necessari
GRANT ALL PRIVILEGES ON `glicechart`.* TO 'glice_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## 3. Configurazione del Backend

Spostati nella cartella `backend/` e crea il file `.env`:

```bash
cd backend
cp .env.example .env # Se presente, altrimenti crealo manualmente
```

Modifica il file `.env` con i tuoi parametri:

```env
PORT=3002
FRONTEND_URL=https://tua-app.it

# MySQL Configuration
DB_HOST=localhost
DB_USER=glice_user
DB_PASSWORD=PASSWORD_SICURA
DB_NAME=glicechart

# Security (Genera chiavi uniche!)
JWT_SECRET=usa_un_codice_random_molto_lungo
REFRESH_TOKEN_SECRET=usa_un_altro_codice_random

# Email (Resend.com)
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM="GliceChart" <noreply@tua-app.it>
```

Installa le dipendenze:
```bash
npm install
```

---

## 4. Configurazione del Frontend

Spostati nella cartella `frontend/`:

```bash
cd ../frontend
npm install
```

Se necessario, configura l'URL del backend nel file di configurazione (solitamente gestito tramite variabili d'ambiente Vite).

Compila il progetto per la produzione:
```bash
npm run build
```

---

## 5. Deployment (Produzione)

Si raccomanda l'uso di **PM2** per gestire il processo del backend:

```bash
npm install -g pm2
cd ../backend
pm2 start server.ts --name "glicechart-api" --interpreter tsx
```

### Reverse Proxy (Nginx)
Configura Nginx per puntare alla porta `3002` e servire i file statici della cartella `frontend/dist`. Assicurati di abilitare **HTTPS** tramite Certbot/Let's Encrypt.

---

## 6. Risoluzione Problemi Comune

- **Errore di connessione DB**: Verifica che il servizio MySQL sia attivo e che le credenziali nel file `.env` siano corrette.
- **Token scaduti**: Il sistema gestisce automaticamente il refresh, ma assicurati che le chiavi segrete siano consistenti.
- **Email non inviate**: Controlla la validità della chiave API di Resend e che il dominio mittente sia verificato sul pannello Resend.

---

© 2026 GliceChart Project - [glicechart.ghibiri.it](https://glicechart.ghibiri.it)
