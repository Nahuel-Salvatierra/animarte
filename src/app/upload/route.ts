import { NextResponse } from 'next/server';

import { sendEmail } from '@/app/actions/sendEmail';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { html?: string };
    const { html } = body;

    if (typeof html !== 'string' || !html.trim()) {
      return NextResponse.json(
        { success: false, error: 'No se envió HTML.' },
        { status: 400 },
      );
    }

    await sendEmail({
      html,
      recipient: process.env.SMTP_RECEPTOR || '',
    });

    return NextResponse.json({
      success: true,
      message: 'Pedido enviado con éxito.',
    });
  } catch (error) {
    console.error('Error en la ruta de subida:', error);
    return NextResponse.json(
      { success: false, error: 'Error al enviar.' },
      { status: 500 },
    );
  }
}
