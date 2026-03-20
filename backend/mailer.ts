import nodemailer from 'nodemailer';

const transporter = (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'tua_password_email') 
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
      path: '/usr/sbin/sendmail' // Percorso standard su Linux
    });

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3002'}/reset-password?token=${token}`;
  
  // Se non c'è SMTP e non siamo su Linux (per sendmail), diamo un avviso ma proviamo comunque
  if (!process.env.EMAIL_HOST && process.platform === 'win32') {
    console.warn('ATTENZIONE: Invio email diretto non supportato su Windows senza SMTP configurato.');
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"GliceChart" <noreply@mglicechart.ghibiri.it>`,
    to: email,
    subject: 'Recupero Password - GliceChart',
    html: `
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
    `,
  };

  await transporter.sendMail(mailOptions);
}
