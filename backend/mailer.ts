import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"GliceChart" <${process.env.EMAIL_USER}>`,
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
