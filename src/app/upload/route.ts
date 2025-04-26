import { NextResponse } from 'next/server';

import { sendEmail } from '@/app/actions/sendEmail';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No se envió ningún archivo.' },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    await sendEmail({
      fileBuffer: buffer,
      fileName: file.name,
      recipient: process.env.SMTP_RECEPTOR || '',
    });

    return NextResponse.json({
      success: true,
      message: 'Archivo enviado con éxito.',
    });
  } catch (error) {
    console.error('Error en la ruta de subida:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
