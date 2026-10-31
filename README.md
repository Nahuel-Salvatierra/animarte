# Animarte

Digital product catalog for browsing stationery items, building a temporary selection, and downloading a PDF order sheet.

There is no checkout, payments, shipping, or email sending. WhatsApp is only a chat link to the business phone number.

## Stack

- **Static** Next.js export (`out/`) — no SSR, no Node server in production
- Hosted on **S3 + CloudFront**
- Offline importer in `tools/catalog-importer/`

## Local development

```bash
cp .env.example .env
npm install
npm run dev
```

With an empty CDN URL, the app loads `/catalog.json` from `public/`.

## Static build (what you upload to S3)

```bash
npm run build          # writes ./out
npm start              # optional local preview of ./out
```

Pushes to **`main`** deploy the static site via GitHub Actions → S3 + CloudFront (catalog `products/` / JSON are left alone). See **[`docs/s3-static-deploy.md`](docs/s3-static-deploy.md)** for bucket layout, IAM/OIDC secrets, and manual upload steps.

## Catalog importer

```bash
cd tools/catalog-importer
npm install
npm run import -- --category games --skip-ai
```

## Docs

- `docs/s3-static-deploy.md` — S3/CloudFront deploy
- `docs/architecture.md`
- `docs/catalog-publish.md`
