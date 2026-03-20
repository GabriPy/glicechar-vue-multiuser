# 💉 GliceChart multiuser-v1.0

**Monitor glicemia multiutente professionale**, sviluppato in **TypeScript** con architettura **ES Modules (ESM)**.  
Una piattaforma completa per il monitoraggio della glicemia in tempo reale, con gestione avanzata di insulina, carboidrati, note e analisi predittiva, progettata per supportare **più utenti simultanei** con isolamento totale dei dati.

I dati vengono sincronizzati automaticamente da **Gluroo** (o altre fonti tramite API) e salvati in un database MySQL locale sicuro per massime prestazioni e privacy.

---

## ✨ Caratteristiche Principali

- **👥 Architettura Multiutente**: Registrazione, login sicuro (JWT + Refresh Tokens), recupero password via email e isolamento completo dei dati tra gli utenti.
- **🛡️ Pannello Admin**: Gestione utenti centralizzata per gli amministratori (abilitazione, eliminazione, permessi).
- **🚀 Predizione Glicemia v2.0**: Algoritmo matematico avanzato (ROC + Smoothing) che stima l'andamento a 15/30/60 minuti basandosi su trend, IOB, COB, ISF e Carb Ratio.
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
    - Supporto email tramite **Nodemailer** per il recupero password.
2.  **Database (MySQL)**: 
    - Isolamento dei dati tramite `user_id` su tutte le tabelle.
    - Schema ottimizzato per performance elevate.
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
│   ├── mailer.ts       # Configurazione invio email (Nodemailer)
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
