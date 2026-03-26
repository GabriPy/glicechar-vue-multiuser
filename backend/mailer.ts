import nodemailer from 'nodemailer';

/**
 * Configurazione del trasportatore.
 * Se sono presenti le variabili SMTP nel .env le usa, 
 * altrimenti prova a usare 'sendmail' locale (come fa PHP mail()).
 */
const transporter = (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) 
  ? nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  : nodemailer.createTransport({
      sendmail: true,
      newline: 'unix',
      path: '/usr/sbin/sendmail' // Percorso standard su Linux (Postfix/Exim/Sendmail)
    });

/**
 * Invia una email di ripristino password utilizzando il mailer locale del server.
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
        <p style="font-size: 10px; color: #999; text-align: center;">GliceChart v1.2.0 - Monitoraggio Glicemia</p>
      </div>
    `;

  try {
    const from = process.env.EMAIL_FROM || `"GliceChart" <noreply@mglicechart.ghibiri.it>`;
    console.log(`[Mailer] Invio email di reset a: ${email} (via ${transporter.options.hasOwnProperty('sendmail') ? 'sendmail locale' : 'SMTP'})`);
    
    await transporter.sendMail({
      from,
      to: email,
      subject,
      html
    });
    
    console.log(`[Mailer] Email inviata con successo`);
  } catch (e: any) {
    console.error(`[Mailer] Errore invio email: ${e.message}`);
    // Se fallisce l'invio fisico, logghiamo il token per permettere il reset manuale in emergenza
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEBUG] Token di reset per ${email}: ${token}`);
    }
    throw new Error(`Errore invio email: ${e.message}`);
  }
}
