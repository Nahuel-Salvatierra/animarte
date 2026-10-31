import { test as base } from '@playwright/test';

const image64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAA30lEQVR4nEWPvU8CURDEZ/a985TDgkCMlY05O2NITPRvteMfIoiFFhhtieQ+QC739d5aPMBpdmd+xe5wNntR70kCqgqSOEpELFQRCBAWksF6VQnpaDyhsc6r80pjRuNJyG0YRZHH8fnz0yOh88UyL8voYuga+oCdc9Ppw12adl21yfLP1Vff1lA9YKhW1b7cZuv1z8fqm14t1UNt+HWYJIvX5fjtfZPlTdPcp7e/u+3/bROdma7v6/pykNxcX+3bXhU84V2RUySO7ECka2rvVQiQVijgsTTovQIwQgCk/AH9fnK3HDMMUwAAAABJRU5ErkJggg==';

const catalogFixture = {
  version: 1,
  generatedAt: '2026-10-30T00:00:00.000Z',
  products: [
    {
      id: 'anime-demo-001',
      title: 'Cuaderno Demo Anime 1',
      slug: 'anime-demo-001',
      category: 'anime',
      kind: 'notebook',
      images: { cover: 'animarte_logo.png' },
      active: true,
    },
    {
      id: 'anime-demo-002',
      title: 'Cuaderno Demo Anime 2',
      slug: 'anime-demo-002',
      category: 'anime',
      kind: 'notebook',
      images: { cover: 'animarte_logo.png' },
      active: true,
    },
    {
      id: 'anime-demo-003',
      title: 'Cuaderno Demo Anime 3',
      slug: 'anime-demo-003',
      category: 'anime',
      kind: 'notebook',
      images: { cover: 'animarte_logo.png' },
      active: true,
    },
  ],
};

export const test = base.extend({
  context: async ({ context }, use) => {
    await context.route(/\/catalog\.json(?:\?.*)?$/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(catalogFixture),
      });
    });

    await context.route(/\.(?:png|jpe?g|webp|svg)(?:\?.*)?$/i, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'image/png',
        body: Buffer.from(image64, 'base64'),
      });
    });

    await use(context);
  },
});
