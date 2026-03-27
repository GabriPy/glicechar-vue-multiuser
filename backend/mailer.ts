import axios from 'axios';

/**
 * Invia una email di ripristino password utilizzando i Template di Resend.
 * Utilizziamo axios per una chiamata API diretta, garantendo la compatibilità con i template.
 */
export async function sendPasswordResetEmail(email: string, token: string, username: string = '') {
  const apiKey = process.env.RESEND_API_KEY;
  const templateId = process.env.RESEND_TEMPLATE_ID;
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3002'}/reset-password?token=${token}`;

  if (!apiKey || !templateId) {
    console.error(`[Mailer] ERRORE: Configurazione Resend incompleta (API Key o Template ID mancanti nel .env)`);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEBUG] Token di reset per ${email}: ${token}`);
      console.log(`[DEBUG] Link: ${resetLink}`);
    }
    throw new Error('Servizio email non configurato correttamente');
  }

  try {
    const from = process.env.EMAIL_FROM || "GliceChart <onboarding@resend.dev>";
    
    console.log(`[Mailer] Invio email di reset a: ${email} via Resend API (Template: ${templateId})`);
    
    // Chiamata API diretta a Resend per garantire la corretta gestione del template
    await axios.post('https://api.resend.com/emails', {
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
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`[Mailer] Email inviata con successo tramite Resend Template API`);
  } catch (e: any) {
    const errorDetail = e.response?.data;
    console.error(`[Mailer] Errore Resend API:`, JSON.stringify(errorDetail || e.message));
    throw new Error(`Errore invio email: ${errorDetail?.message || e.message}`);
  }
}
