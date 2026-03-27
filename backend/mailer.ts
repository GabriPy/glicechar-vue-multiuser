import { Resend } from 'resend';

/**
 * Invia una email di ripristino password utilizzando Resend API.
 */
export async function sendPasswordResetEmail(email: string, token: string) {
  // Inizializza Resend all'interno della funzione per assicurarsi che dotenv abbia caricato le variabili
  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
  
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
        <p style="font-size: 10px; color: #999; text-align: center;">GliceChart v1.2.0 - Monitoraggio Glicemia</p>
      </div>
    `;

  if (!resend) {
    console.error(`[Mailer] ERRORE: RESEND_API_KEY non configurata nel .env`);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEBUG] Token di reset per ${email}: ${token}`);
      console.log(`[DEBUG] Link: ${resetLink}`);
    }
    throw new Error('Servizio email non configurato');
  }

  try {
    const from = process.env.EMAIL_FROM || "GliceChart <onboarding@resend.dev>";
    console.log(`[Mailer] Invio email di reset a: ${email} via Resend API`);
    
    const { data, error } = await resend.emails.send({
      from,
      to: [email],
      subject,
      html
    });

    if (error) {
      throw new Error(error.message);
    }
    
    console.log(`[Mailer] Email inviata con successo (ID: ${data?.id})`);
  } catch (e: any) {
    console.error(`[Mailer] Errore invio email: ${e.message}`);
    throw new Error(`Errore invio email: ${e.message}`);
  }
}
