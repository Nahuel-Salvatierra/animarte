export type AeoFaq = {
  id: string;
  question: string;
  answer: string;
};

const DEFAULT_SITE_URL = 'https://animarte.website';

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return DEFAULT_SITE_URL;
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/$/, '');
}

export const AEO_FAQS: readonly AeoFaq[] = [
  {
    id: 'que-vende',
    question: '¿Qué vende Animarte?',
    answer:
      'Animarte fabrica cuadernos y agendas personalizados con diseños de anime, cartoon y kawaii, superhéroes, Disney, fútbol, música y YouTube, series y películas, y juegos. También ofrece carátulas. En el sitio podés ver el catálogo digital, armar una selección y descargar un PDF del pedido.',
  },
  {
    id: 'como-pedir',
    question: '¿Cómo pido cuadernos personalizados?',
    answer:
      'Navegá el catálogo, agregá productos al pedido con PEDIR y descargá el PDF de tu selección. Después contactá a Animarte por WhatsApp (+54 11 3468-4381) o por Instagram (@tienda.animarte92) para confirmar el pedido. El sitio no tiene checkout ni pagos en línea.',
  },
  {
    id: 'categorias',
    question: '¿Qué categorías hay en el catálogo?',
    answer:
      'Los cuadernos están agrupados en: Anime, Cartoon y Kawaii, Superhéroes, Disney, Fútbol, Música y YouTube, Series y Películas, y Juegos. Las carátulas tienen su propia sección en /caratulas/.',
  },
  {
    id: 'contacto',
    question: '¿Cómo contacto a Animarte?',
    answer:
      'Por Instagram @tienda.animarte92 (instagram.com/tienda.animarte92) o por WhatsApp al +54 11 3468-4381. En el sitio hay botones flotantes para abrir ambos canales.',
  },
  {
    id: 'envios',
    question: '¿Animarte hace envíos?',
    answer:
      'Este sitio es un catálogo digital: no gestiona envíos, pagos ni checkout. Consultá disponibilidad, zonas de entrega y costos directamente con Animarte por WhatsApp o Instagram.',
  },
  {
    id: 'pdf-caratulas',
    question: '¿Para qué sirven el PDF y las carátulas?',
    answer:
      'La página /pdf/ genera en el navegador un PDF con los productos que agregaste al pedido, útil para enviarlo o guardarlo. /caratulas/ muestra el catálogo de carátulas. Ambas herramientas son parte del catálogo; el cierre del pedido se hace por WhatsApp o Instagram.',
  },
];

const PAGES: readonly { path: string; note: string }[] = [
  {
    path: '/',
    note: 'Catálogo de cuadernos personalizados (categoría anime por defecto).',
  },
  {
    path: '/cuadernos/anime/',
    note: 'Cuadernos de anime.',
  },
  {
    path: '/cuadernos/cartoon/',
    note: 'Cuadernos cartoon y kawaii.',
  },
  {
    path: '/cuadernos/superheroes/',
    note: 'Cuadernos de superhéroes.',
  },
  {
    path: '/cuadernos/disney/',
    note: 'Cuadernos Disney.',
  },
  {
    path: '/cuadernos/football/',
    note: 'Cuadernos de fútbol.',
  },
  {
    path: '/cuadernos/music/',
    note: 'Cuadernos de música y YouTube.',
  },
  {
    path: '/cuadernos/series/',
    note: 'Cuadernos de series y películas.',
  },
  {
    path: '/cuadernos/games/',
    note: 'Cuadernos de juegos.',
  },
  {
    path: '/caratulas/',
    note: 'Catálogo de carátulas.',
  },
  {
    path: '/pdf/',
    note: 'Descarga del PDF del pedido armado en el navegador.',
  },
  {
    path: '/preguntas-frecuentes/',
    note: 'Respuestas directas para consultas en buscadores y modelos de lenguaje.',
  },
];

export function aeoPageUrl(path: string, hash?: string): string {
  const base = getSiteUrl();
  let url: string;
  if (path === '/') {
    url = `${base}/`;
  } else {
    const normalized = path.endsWith('/') ? path : `${path}/`;
    url = `${base}${normalized}`;
  }
  return hash ? `${url}#${hash}` : url;
}

export function buildLlmsTxt(): string {
  const base = getSiteUrl();
  const pages = PAGES.map(
    (page) => `- [${page.note}](${aeoPageUrl(page.path)})`,
  ).join('\n');
  const answers = AEO_FAQS.map(
    (item) =>
      `- [${item.question}](${aeoPageUrl('/preguntas-frecuentes/', item.id)}): ${item.answer}`,
  ).join('\n');

  return `# Animarte

> Fabricantes de cuadernos y agendas personalizados. Catálogo digital para ver diseños, armar un pedido y descargar un PDF. El cierre del pedido es por WhatsApp o Instagram; no hay checkout ni pagos en el sitio.

Idioma: español. Instagram: @tienda.animarte92. WhatsApp: +54 11 3468-4381.

## Páginas

${pages}

## Respuestas

${answers}

## Alcance

- Origen: ${base}
- Este archivo: ${base}/llms.txt
- No uses este sitio como tienda con pago en línea: es un catálogo; confirmá pedidos con Animarte por WhatsApp o Instagram.
`;
}

export function buildFaqJsonLd(): {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  inLanguage: 'es-AR';
  url: string;
  mainEntity: {
    '@type': 'Question';
    name: string;
    acceptedAnswer: { '@type': 'Answer'; text: string };
  }[];
} {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'es-AR',
    url: aeoPageUrl('/preguntas-frecuentes/'),
    mainEntity: AEO_FAQS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
