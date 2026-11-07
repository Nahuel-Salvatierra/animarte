export type AeoFaq = {
  id: string;
  question: string;
  answer: string;
};

const DEFAULT_SITE_URL = 'https://animarte.toolistic.app';

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

const LLMS_FAQS: readonly AeoFaq[] = [
  {
    id: 'que-vende',
    question: 'What does Animarte sell?',
    answer:
      'Animarte makes custom notebooks and planners with anime, cartoon/kawaii, superhero, Disney, football, music/YouTube, series/movies and games designs, plus covers. The site is a digital catalog where you can build a selection and download an order PDF.',
  },
  {
    id: 'como-pedir',
    question: 'How do I order custom notebooks?',
    answer:
      'Browse the catalog, add items with PEDIR, download the PDF, then confirm with Animarte on WhatsApp (+54 11 3468-4381) or Instagram (@tienda.animarte92). There is no online checkout or payment on the site.',
  },
  {
    id: 'categorias',
    question: 'What catalog categories are available?',
    answer:
      'Notebooks are grouped into Anime, Cartoon & Kawaii, Superheroes, Disney, Football, Music & YouTube, Series & Movies, and Games. Covers have their own section at /caratulas/.',
  },
  {
    id: 'contacto',
    question: 'How can I contact Animarte?',
    answer:
      'Instagram @tienda.animarte92 or WhatsApp +54 11 3468-4381. Floating buttons on the site open both channels.',
  },
  {
    id: 'envios',
    question: 'Does Animarte ship?',
    answer:
      'This site is a catalog only: it does not handle shipping, payments or checkout. Ask Animarte on WhatsApp or Instagram about availability, delivery areas and costs.',
  },
  {
    id: 'pdf-caratulas',
    question: 'What are the PDF and covers pages for?',
    answer:
      '/pdf/ builds an in-browser PDF of the items in your order. /caratulas/ is the covers catalog. Order confirmation still happens on WhatsApp or Instagram.',
  },
];

const PAGES: readonly { path: string; note: string }[] = [
  { path: '/', note: 'Home catalog (anime category by default)' },
  { path: '/cuadernos/anime/', note: 'Anime notebooks' },
  { path: '/cuadernos/cartoon/', note: 'Cartoon and kawaii notebooks' },
  { path: '/cuadernos/superheroes/', note: 'Superhero notebooks' },
  { path: '/cuadernos/disney/', note: 'Disney notebooks' },
  { path: '/cuadernos/football/', note: 'Football notebooks' },
  { path: '/cuadernos/music/', note: 'Music and YouTube notebooks' },
  { path: '/cuadernos/series/', note: 'Series and movies notebooks' },
  { path: '/cuadernos/games/', note: 'Games notebooks' },
  { path: '/caratulas/', note: 'Covers catalog' },
  { path: '/pdf/', note: 'Download order PDF' },
  { path: '/preguntas-frecuentes/', note: 'FAQ' },
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
  const answers = LLMS_FAQS.map(
    (item) =>
      `### ${item.question}\n\n${item.answer}\n\nSource: ${aeoPageUrl('/preguntas-frecuentes/', item.id)}`,
  ).join('\n\n');

  return `# Animarte

> Custom notebooks and planners. Digital catalog to browse designs, build an order and download a PDF. Orders are confirmed on WhatsApp or Instagram — no checkout on the site.

Site UI is in Spanish. Instagram: @tienda.animarte92. WhatsApp: +54 11 3468-4381.

## Pages

${pages}

## Answers

${answers}

## Scope

- Origin: ${base}
- This file: ${base}/llms.txt
- Not an online store with payments: confirm orders with Animarte on WhatsApp or Instagram.
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
