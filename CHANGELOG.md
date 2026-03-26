# 📓 Changelog v1.2.0

Tutti i cambiamenti significativi dalla transizione alla versione multiutente.

---

## [v1.2.0] - 2026-03-26

### 📧 Mailer & Recovery (New)
- **Native Node Mailer**: Introduzione di un sistema di invio email integrato direttamente nel backend che utilizza il comando `sendmail` locale (lo stesso metodo usato da PHP). Questo elimina la necessità di script esterni o SMTP complicati.

### 🎨 Design & UI (Visual Overhaul)
- **Unified UI**: Riprogettazione completa di tutte le viste con un'estetica moderna e coerente.
- **Glassmorphism & Glow Effects**: Implementazione di effetti di trasparenza e bagliori soffusi (`blur-3xl`) per un look futuristico.
- **Tema Dinamico**: Gestione centralizzata del tema basata su DaisyUI 5, sincronizzata tra tutte le pagine.

### ⚙️ Impostazioni & Personalizzazione
- **Soglie Critiche**: Aggiunta del supporto per limiti `red_under` (ipoglicemia grave) e `red_over` (iperglicemia grave) personalizzabili.
- **Auto-Sync Migration**: Il database ora gestisce automaticamente l'aggiunta di nuove colonne e l'inizializzazione dei dati mancanti.
- **Robustezza Salvataggio**: Nuovo sistema `INSERT ... ON DUPLICATE KEY UPDATE` per garantire che le impostazioni vengano salvate anche per utenti migrati da versioni precedenti.

### 🛠️ Correzioni & Stabilità
- **Logout Immediato**: Corretto il bug che mostrava avvisi di "credenziali mancanti" durante la disconnessione; ora il reindirizzamento al login è istantaneo e pulito.
- **Zod Validation**: Rafforzata la validazione degli account (email opzionale) e delle impostazioni cliniche.
- **Logging Avanzato**: Implementato un sistema di log colorato nel backend per monitorare in tempo reale il successo o il fallimento di ogni operazione critica (Sync, Mail, DB).

---

## [multiuser-v1.0] - 2026-03-20

### 🚀 Evoluzione Multiutente (Major Release)
- **Migrazione TypeScript**: Backend e frontend ora utilizzano TypeScript per una robustezza superiore.
- **Architettura ESM**: Passaggio completo a ES Modules (import/export) in tutto il progetto.
- **Sistema Account**: Implementata gestione completa utenti con registrazione, login e recupero password via email.
- **Isolamento Dati**: Migrazione totale del database MySQL per supportare il multi-tenant tramite `user_id`.
- **Sicurezza Avanzata**:
    - Integrazione **JWT** e **Refresh Tokens** per sessioni persistenti.
    - Validazione degli input tramite **Zod** in tutti gli endpoint API.
    - Hashing password con **bcryptjs**.
- **Admin Dashboard**: Nuova vista per amministratori per gestire l'abilitazione e l'eliminazione degli utenti.

---

## Note
Il progetto **GliceChart multiuser-v1.1-premium** rappresenta l'eccellenza nella gestione multiutente della glicemia, unendo un'interfaccia di alta classe a una robustezza tecnica senza compromessi.
