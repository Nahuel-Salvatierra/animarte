import nodemailer from 'nodemailer';

type SendEmailParams = {
  html: string;
  recipient: string;
};

export async function sendEmail({
  html,
  recipient,
}: SendEmailParams): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Animarte" <${process.env.SMTP_USER}>`,
      to: recipient,
      subject: 'Pedido desde Animarte',
      html,
      text: 'Pedido desde Animarte. Abre este correo en un cliente que soporte HTML para ver el detalle.',
    });
  } catch (error) {
    console.error('Error enviando email:', error);
    throw new Error('Error enviando el correo.');
  }
}
