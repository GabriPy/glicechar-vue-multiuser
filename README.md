# 💉 GliceChart v1.2.0

**Monitor glicemia multiutente professionale**, sviluppato in **TypeScript** con architettura **ES Modules (ESM)**.  
Una piattaforma completa per il monitoraggio della glicemia in tempo reale, con gestione avanzata di insulina, carboidrati, note e analisi predittiva, progettata per supportare **più utenti simultanei** con isolamento totale dei dati.

I dati vengono sincronizzati automaticamente da **Gluroo** (o altre fonti tramite API) e salvati in un database MySQL locale sicuro per massime prestazioni e privacy.

---

## ✨ Caratteristiche Principali (v1.2.0)

- **🎨 Design Unified**: Interfaccia ridisegnata con estetica moderna, effetti "glassmorphism", bagliori soffusi (`blur-3xl`) e coerenza cromatica basata su temi DaisyUI 5 (Cupcake, Dark, ecc.).
- **👥 Architettura Multiutente**: Registrazione, login sicuro (JWT + Refresh Tokens), recupero password via **Local Mailer (sendmail)** e isolamento completo dei dati tra gli utenti.
- **🛡️ Pannello Admin**: Gestione utenti centralizzata per gli amministratori (abilitazione, eliminazione, permessi).
- **🚀 Predizione Glicemia v2.2**: Algoritmo matematico avanzato (ROC + Smoothing) con supporto per soglie critiche personalizzabili (`red_under`, `red_over`).
- **📊 Analisi Comparativa**: Vista "Confronto Periodi" con overlay grafico per monitorare i progressi orari tra diverse settimane.
- **🧠 Pattern Smart Dinamici**: Analisi automatica dello storico che identifica schemi ricorrenti e correlazioni con le note (es. "Effetto Pizza").
- **📅 Calendario Glicemico 24h**: Analisi storica giornaliera con asse orario fisso, lista insuline, carboidrati e note.
- **🥖 Dietometro Integrato**: Database alimenti personalizzabile per calcolare rapidamente i carboidrati dei pasti.
- **🌍 Internazionalizzazione (i18n)**: Supporto completo per lingua **Italiana** e **Inglese**.
- **🎨 UI Moderna & Reattiva**: Sviluppato con **Vue 3 (Composition API)**, **Tailwind CSS 4** e **daisyUI 5**.

---

## 🛠️ Stack Tecnologico

Il progetto utilizza uno stack moderno e rigorosamente tipizzato:

1.  **Backend (Node.js + TypeScript + ESM)**: 
    - Esecuzione rapida con `tsx`.
    - Autenticazione con **JWT** e gestione sessioni via **Refresh Tokens**.
    - Validazione rigorosa dei dati con **Zod**.
    - **Native Mailer**: Invio email tramite il sistema locale (Postfix/Sendmail) o SMTP, integrato direttamente nel backend Node.js.
2.  **Database (MySQL)**: 
    - Isolamento dei dati tramite `user_id` su tutte le tabelle.
    - Schema ottimizzato con supporto per migrazioni automatiche (soglie critiche).
3.  **Frontend (Vue 3 + Vite)**:
    - Gestione stato globale con **Pinia**.
    - Grafici interattivi con **Chart.js**.
    - Design atomico e configurazione CSS-first con Tailwind 4.

---

## 📂 Struttura del Progetto

```text
glicechart-multiuser/
├── backend/            # TypeScript API & Sincronizzazione
│   ├── server.ts       # Entry point Express (ESM)
│   ├── db.ts           # Gestione MySQL e isolamento user_id
│   ├── mailer.ts       # Bridge per invio email (PHP)
│   ├── mail.php        # Script PHP per l'invio fisico delle email
│   ├── validators.ts   # Schemi Zod per validazione input
│   └── .env            # Configurazioni server, DB e Email
│
└── frontend/           # Vue 3 App (Vite)
    ├── src/
    │   ├── stores/     # Pinia (Auth & Glucose logic)
    │   ├── views/      # Dashboard, Analisi, Impostazioni, i18n
    │   └── i18n.ts     # Traduzioni IT/EN
    └── public/         # Asset statici
```

---

## 📥 Installazione e Avvio

Per configurare il tuo ambiente, creare il database e avviare il sistema:

👉 **[Guida all'Installazione (INSTALL.md)](./INSTALL.md)**

Per i dettagli tecnici sull'architettura e la sicurezza:

👉 **[Architettura del Sistema (ARCHITECTURE.md)](./ARCHITECTURE.md)**

Per consultare la cronologia delle versioni:

👉 **[Changelog (CHANGELOG.md)](./CHANGELOG.md)**

---

Creato con ❤️ per una gestione condivisa, sicura e professionale della glicemia.
