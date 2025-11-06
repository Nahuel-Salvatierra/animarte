import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

type SendEmailParams = {
  fileBuffer: Buffer;
  fileName: string;
  recipient: string;
};

export async function sendEmail({
  fileBuffer,
  fileName,
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
      subject: 'Archivo PDF enviado desde Animarte',
      text: 'Adjunto encontrarás el archivo PDF solicitado.',
      attachments: [
        {
          filename: fileName,
          content: fileBuffer.toString('base64'),
          encoding: 'base64',
          contentType: 'application/pdf',
        },
      ],
    });
  } catch (error) {
    console.error('Error enviando email:', error);
    throw new Error('Error enviando el correo.');
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { file, fileName, recipient } = req.body;

    if (process.env.NODE_ENV === 'development') {
      return res.status(200).json({ success: true });
    }

    await sendEmail({
      fileBuffer: Buffer.from(file, 'base64'),
      fileName,
      recipient,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error en el handler:', error);
    res.status(500).json({ success: false, error });
  }
}
