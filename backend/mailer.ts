import { Resend } from 'resend';

/**
 * Invia una email di ripristino password utilizzando i Template di Resend.
 */
export async function sendPasswordResetEmail(email: string, token: string, username: string = '') {
  // Inizializza Resend all'interno della funzione per assicurarsi che dotenv abbia caricato le variabili
  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
  const templateId = process.env.RESEND_TEMPLATE_ID;
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3002'}/reset-password?token=${token}`;

  if (!resend || !templateId) {
    console.error(`[Mailer] ERRORE: Configurazione Resend incompleta (API Key o Template ID mancanti nel .env)`);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEBUG] Token di reset per ${email}: ${token}`);
      console.log(`[DEBUG] Link: ${resetLink}`);
    }
    throw new Error('Servizio email non configurato correttamente');
  }

  try {
    const from = process.env.EMAIL_FROM || "GliceChart <onboarding@resend.dev>";
    
    console.log(`[Mailer] Invio email di reset a: ${email} via Resend (Template: ${templateId})`);
    
    const { data, error } = await resend.emails.send({
      from,
      to: [email],
      subject: 'Recupero Password - GliceChart',
      template: {
        id: templateId,
        variables: {
          username: username || email,
          reset_link: resetLink,
        }
      }
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
