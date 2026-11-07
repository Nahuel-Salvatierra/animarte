import type { Metadata } from 'next';

import { AEO_FAQS, buildFaqJsonLd } from '@/lib/aeo';

export const metadata: Metadata = {
  title: 'Preguntas frecuentes | Animarte',
  description:
    'Qué vende Animarte, cómo pedir cuadernos personalizados, categorías del catálogo, contacto por Instagram y WhatsApp, envíos, PDF y carátulas.',
  alternates: { canonical: '/preguntas-frecuentes/' },
  openGraph: {
    title: 'Preguntas frecuentes | Animarte',
    description:
      'Respuestas directas sobre cuadernos personalizados, catálogo, pedidos y contacto con Animarte.',
    locale: 'es_AR',
  },
};

export default function PreguntasFrecuentesPage() {
  const jsonLd = buildFaqJsonLd();

  return (
    <main className="container mx-auto max-w-3xl px-2 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-3xl font-bold">Preguntas frecuentes</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Respuestas cortas sobre el catálogo de cuadernos personalizados de
        Animarte. El sitio no tiene checkout: el pedido se confirma por WhatsApp
        o Instagram.
      </p>
      <div className="mt-8 space-y-8">
        {AEO_FAQS.map((item) => (
          <article key={item.id} id={item.id} className="scroll-mt-24">
            <h2 className="text-base font-semibold">{item.question}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {item.answer}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
