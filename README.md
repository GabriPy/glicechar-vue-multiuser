# 💉 GliceChart Multiuser v1.4.4

Piattaforma web moderna e professionale per il monitoraggio glicemico avanzato. Progettata per offrire un'esperienza multi-utente sicura, analisi predittive accurate e uno strumento di gestione completa per diabetici e caregiver. Si integra perfettamente con l'ecosistema **Gluroo** e **Nightscout**.

🌐 **Sito Ufficiale**: [glicechart.ghibiri.it](https://glicechart.ghibiri.it)

---

## ✨ Cosa c'è di nuovo (v1.4.4)

- **🚀 Performance Optimization**: Migliorata la velocità di caricamento iniziale e l'efficienza delle query al database.
- **🛡️ Security Hardening**: Rafforzamento del Rate Limiting e protezione avanzata contro attacchi CSRF.
- **🎨 UI Refinement**: Perfezionamento dei componenti DaisyUI 5 e ottimizzazione del responsive design per dispositivi mobile.
- **📈 GliceForecast v3.1**: Piccoli aggiustamenti all'algoritmo predittivo per una maggiore stabilità nei trend notturni.

---

## 🛠️ Funzionalità Chiave

- **👥 Architettura Multi-utente**: Isolamento totale dei dati con gestione account sicura (JWT + Refresh Tokens).
- **� GliceForecast™**: Algoritmo predittivo proprietario con simulazione gaussiana e smorzamento dei trend.
- **🧠 Smart Patterns**: Identificazione automatica delle correlazioni tra alimentazione e glicemia.
- **🥗 Dietometro Visivo**: Database integrato per il calcolo rapido dei carboidrati con supporto visuale.
- **� PWA Ready**: Installabile su smartphone come un'app nativa per un accesso rapido.
- **📧 Sistema Notifiche**: Recupero password e benvenuto automatizzati tramite Resend API.

---

## 🚀 Guida Rapida

### Prerequisiti
- **Node.js** v20+ (Consigliato)
- **MySQL** v8.0+
- **Chiave API Resend** (per le funzionalità email)

### Installazione in 3 step
1. **Clona il repository**: `git clone https://github.com/ghibiri/glicechar-vue-multiuser.git`
2. **Configura l'ambiente**: Segui le istruzioni in [INSTALL.md](INSTALL.md).
3. **Avvia il progetto**: 
   - Backend: `cd backend && npm install && npm start`
   - Frontend: `cd frontend && npm install && npm run build`

---

## 📖 Documentazione

| Documento | Descrizione |
| :--- | :--- |
| [**INSTALL.md**](INSTALL.md) | Guida dettagliata alla configurazione del server e del database. |
| [**ARCHITECTURE.md**](ARCHITECTURE.md) | Approfondimento tecnico su sicurezza, algoritmi e struttura dati. |
| [**CHANGELOG.md**](CHANGELOG.md) | Cronologia completa di tutte le versioni e i cambiamenti. |

---

## 📄 Licenza

Distribuito sotto Licenza MIT. Consulta il file `LICENSE` per maggiori informazioni.

---

Sviluppato con passione da **Ghibiri**. Se trovi utile questo progetto, considera di lasciare una ⭐!
