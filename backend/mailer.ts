import axios from 'axios';

// --- PHP Mailer Config ---
// URL dello script PHP caricato sul server (es: https://tuodominio.it/mail.php)
const PHP_MAILER_URL    = process.env.PHP_MAILER_URL; 
// Chiave di sicurezza per autorizzare l'invio (deve coincidere con quella in mail.php)
const PHP_MAILER_SECRET = process.env.PHP_MAILER_SECRET || "glicechart_secret_mail_key";

/**
 * Invia una email di ripristino password utilizzando lo script PHP sul server.
 */
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3002'}/reset-password?token=${token}`;
  const subject   = 'Recupero Password - GliceChart';
  const html      = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #4F46E5;">Recupero Password</h2>
        <p>Hai richiesto il ripristino della password per il tuo account GliceChart.</p>
        <p>Clicca sul pulsante qui sotto per impostare una nuova password. Il link scadrà tra 1 ora.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reimposta Password</a>
        </div>
        <p style="font-size: 12px; color: #666;">Se non hai richiesto tu il ripristino, puoi ignorare questa email.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 10px; color: #999; text-align: center;">GliceChart-multiuser - Monitoraggio Glicemia</p>
      </div>
    `;

  if (!PHP_MAILER_URL) {
    console.error(`[Mailer] ERRORE: PHP_MAILER_URL non configurato nel .env`);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEBUG] Token: ${token} | Link: ${resetLink}`);
    }
    throw new Error('Servizio email non configurato');
  }

  try {
    console.log(`[Mailer] Invio email via PHP a: ${email}`);
    await axios.post(PHP_MAILER_URL, {
      secret: PHP_MAILER_SECRET,
      to: email,
      subject,
      html
    });
    console.log(`[Mailer] Email inviata con successo via PHP`);
  } catch (e: any) {
    const errorMsg = e.response?.data?.error || e.message;
    console.error(`[Mailer] Errore invio via PHP: ${errorMsg}`);
    throw new Error(`Errore invio email: ${errorMsg}`);
  }
}
