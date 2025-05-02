import { test as base } from 'playwright-test-coverage';

// config: GaxiosOptions;
// data: T;
// status: number;
// statusText: string;
// headers: Headers;
// request: GaxiosXMLHttpRequest;

const image64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAA30lEQVR4nEWPvU8CURDEZ/a985TDgkCMlY05O2NITPRvteMfIoiFFhhtieQ+QC739d5aPMBpdmd+xe5wNntR70kCqgqSOEpELFQRCBAWksF6VQnpaDyhsc6r80pjRuNJyG0YRZHH8fnz0yOh88UyL8voYuja+oCdc9Ppw12adl21yfLP1Vff1lA9YKhW1b7cZuv1z8fqm14t1UNt+HWYJIvX5fztfZPlTdPcp7e/u+3/bROdma7v6/pykNxcX+3bXhU84V2RUySO7ECka2rvVQiQVijgsTTovQIwQgCk/AH9fnK3HDMMUwAAAABJRU5ErkJggg==';

export const test = base.extend({
  context: async ({ context }, use) => {
    await context.route('**/*.{png,jpg,jpeg,webp,svg}*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'image/jpg',
        body: Buffer.from(image64, 'base64'),
      }),
    );

    await context.route('books/**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          books: [
            {
              id: 1,
              name: 'Book Title',
              image: 'https://test.fake/image.jpg',
              mimeType: 'image/jpg',
            },
            {
              id: 2,
              name: 'Book Title 2',
              image: 'https://test.fake/image.jpg',
              mimeType: 'image/jpg',
            },
            {
              id: 3,
              name: 'Book Title 3',
              image: 'https://test.fake/image.jpg',
              mimeType: 'image/jpg',
            },
          ],
          pagination: {
            hasMore: false,
            nextPageToken: false,
          },
        }),
      });
    });

    await use(context);
  },
});
