# 📓 Changelog v1.3.0

Tutti i cambiamenti significativi dalla transizione alla versione multiutente.

---

## [v1.3.0] - 2026-03-28

### 🎨 Design & UI (Visual Refactoring)
- **Modern Typography**: Sostituiti i vecchi font con **Plus Jakarta Sans** (testi) e **JetBrains Mono** (numeri) per una leggibilità superiore e un look professionale.
- **Iconography Redesign**: Tutte le icone dell'interfaccia ora utilizzano contenitori **quadrati con angoli arrotondati** (`rounded-2xl/3xl`), eliminando l'incoerenza dei vecchi background rettangolari o circolari.
- **Smart Status Indicator**: Introdotto un **pallino di stato pulsante** accanto alla glicemia attuale. Il colore (Verde/Giallo/Rosso) comunica istantaneamente lo stato metabolico, permettendo di mantenere il testo della glicemia in un elegante nero neutro.
- **Centratura Statistiche**: Riprogettate le card della homepage (Media, TIR, IOB, COB) con testi e icone perfettamente centrati per un bilanciamento visivo ottimale.
- **Rimozione Italic**: Eliminato lo stile corsivo diffuso in molte parti della UI per un design più solido, moderno e leggibile.

### 🛡️ Sicurezza & Amministrazione
- **Admin Self-Protection**: Implementata protezione sia frontend che backend per impedire agli amministratori di rimuovere i propri privilegi o eliminare il proprio account accidentalmente dal pannello di gestione.
- **User Management Fix**: Corretta la query di recupero utenti nel pannello admin; ora l'indirizzo email viene visualizzato correttamente per tutti gli account registrati.

### 🛠️ Database & Stabilità
- **Access Control Fix**: Risolto il problema di accesso negato (`ER_ACCESS_DENIED_ERROR`) migliorando la gestione delle credenziali di default e documentando la procedura corretta di abilitazione utente in MySQL.
- **Data Integrity**: Ottimizzata la selezione dei campi nelle query amministrative per garantire che tutti i dati necessari siano sempre disponibili all'interfaccia.

---

## [v1.2.0] - 2026-03-26

### 📧 Mailer & Recovery (New)
- **Native Node Mailer**: Introduzione di un sistema di invio email integrato direttamente nel backend che utilizza il comando `sendmail` locale.

### 🎨 Design & UI (Visual Overhaul)
- **Unified UI**: Riprogettazione completa di tutte le viste con un'estetica moderna e coerente.
- **Glassmorphism & Glow Effects**: Implementazione di effetti di trasparenza e bagliori soffusi (`blur-3xl`).
- **Tema Dinamico**: Gestione centralizzata del tema basata su DaisyUI 5.

---

## [multiuser-v1.0] - 2026-03-20

### 🚀 Evoluzione Multiutente (Major Release)
- **Migrazione TypeScript**: Backend e frontend ora utilizzano TypeScript.
- **Sistema Account**: Implementata gestione completa utenti con registrazione, login e recupero password.
- **Isolamento Dati**: Migrazione totale del database MySQL per supportare il multi-tenant tramite `user_id`.
- **Sicurezza Avanzata**: Integrazione **JWT** e **Refresh Tokens**.
