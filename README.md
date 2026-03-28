# 💉 GliceChart Multiuser v1.3.0

Piattaforma web moderna per il monitoraggio glicemico avanzato con supporto multi-utente, predizioni AI e analisi dei pattern. Progettata per integrarsi perfettamente con l'ecosistema Gluroo/Nightscout.

🌐 **Live Demo**: [glicechart.ghibiri.it](https://glicechart.ghibiri.it)

---

## ✨ Funzionalità Principali (v1.3.0)

- **🎨 Design Refined**: UI modernizzata con i font **Plus Jakarta Sans** (testi) e **JetBrains Mono** (numeri). Iconografia uniformata con background quadrati arrotondati (`rounded-2xl/3xl`) e nuovo indicatore di stato pulsante (Verde/Giallo/Rosso) per un feedback immediato senza interferire con il colore del valore glicemico.
- **🛡️ Sicurezza Enterprise**:
  - **Auto-Protezione Admin**: Impedisce il lock-out accidentale degli amministratori.
  - **Rate Limiting**: Protezione avanzata contro attacchi brute-force e DoS.
  - **CORS Strict**: Accesso API limitato esclusivamente al dominio autorizzato.
  - **Session Invalidation**: Cambio password forza il logout su tutti i dispositivi.
- **📈 Analisi Avanzata**:
  - **Predizione Glicemia**: Algoritmo v2.2 con smoothing e impatto IOB/COB.
  - **Pattern Smart**: Identificazione automatica di correlazioni tra note e risposte glicemiche.
  - **Resoconto PDF**: Esportazione professionale dei dati per consultazione medica.
- **👥 Architettura Multiutente**: Isolamento completo dei dati, login sicuro (JWT + Refresh Tokens) e recupero password via email (Resend API).

---

## 🚀 Installazione Rapida

Per installare GliceChart sul tuo server, consulta la guida dettagliata in [INSTALL.md](INSTALL.md).

### Prerequisiti
- **Node.js** v18+
- **MySQL** v8+
- **Resend API Key** (per l'invio delle email)

---

## 🛠️ Tech Stack

- **Frontend**: Vue 3, Vite, Tailwind CSS, DaisyUI, Pinia, Chart.js.
- **Backend**: Node.js, Express, TypeScript, MySQL (mysql2), Zod, JWT.
- **Email**: Resend API.

---

## 📖 Documentazione Tecnica

Per approfondimenti sull'architettura del sistema e le logiche di sicurezza, leggi [ARCHITECTURE.md](ARCHITECTURE.md).

---

## 📄 Licenza

Questo progetto è distribuito sotto licenza MIT. Vedi il file `LICENSE` per ulteriori dettagli.

---

Creato con ❤️ per una gestione condivisa, sicura e professionale della glicemia.
