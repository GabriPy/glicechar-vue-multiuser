# 📓 Changelog multiuser-v1.0

Tutti i cambiamenti significativi dalla transizione alla versione multiutente.

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
    - Verifica della vecchia password obbligatoria per il cambio password.
- **Admin Dashboard**: Nuova vista per amministratori per gestire l'abilitazione e l'eliminazione degli utenti.

### 📊 Analisi & Funzioni Cliniche
- **Confronto Periodi**: Nuova vista con overlay grafico per comparare l'andamento orario di diversi periodi.
- **Predizione Glicemia v2.0**: Algoritmo predittivo basato su ROC, IOB, COB e Smoothing del sensore.
- **Pattern Smart**: Rilevamento automatico di schemi orari e correlazioni con le note.
- **Dietometro i18n**: Database alimenti con slider per calcolo CHO istantaneo.

### 🌍 Internazionalizzazione (i18n)
- Supporto completo per **Italiano** e **Inglese**.
- Localizzazione automatica di date, grafici e report PDF.

### 🎨 UI/UX
- **daisyUI 5 & Tailwind CSS 4**: Aggiornamento alla versione più recente del framework CSS.
- **Responsive Design**: Ottimizzazione per ogni tipo di schermo (Desktop, Tablet, Mobile).
- **Log Backend**: Output del terminale colorato (`picocolors`) con timestamp per un monitoraggio facilitato.

---

## Note
Il progetto **GliceChart multiuser-v1.0** rappresenta una riscrittura professionale della versione single-user originale, focalizzata su sicurezza, scalabilità e facilità d'uso condivisa.
