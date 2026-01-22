import { NextResponse } from 'next/server';

const ALLOWED_ORIGINS = [
  'https://drive.google.com',
  'https://lh3.googleusercontent.com',
  'https://www.google.com',
];

function isAllowedUrl(url: string): boolean {
  try {
    const u = new URL(url);
    const origin = u.origin;
    if (ALLOWED_ORIGINS.some((o) => origin === o)) return true;
    if (origin.endsWith('.googleusercontent.com')) return true;
    return false;
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url || !isAllowedUrl(url)) {
    return NextResponse.json({ error: 'URL no permitida' }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Animarte/1.0' },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Error al obtener la imagen' },
        { status: 502 },
      );
    }

    const contentType = res.headers.get('content-type') || 'image/png';
    const buffer = Buffer.from(await res.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('proxy-image error:', error);
    return NextResponse.json(
      { error: 'Error al obtener la imagen' },
      { status: 502 },
    );
  }
}
