# Animarte architecture

## Product definition

Animarte is a digital product catalog (not a traditional e-commerce). Users browse products, select items into a temporary cart, and download a PDF of the selection. There is no checkout, payments, shipping, order management, or email sending.

WhatsApp is only a floating link that opens a chat with the business phone number.

## Runtime architecture

- **Frontend:** Next.js App Router exported as a **static site** (`output: 'export'`). No Node server in production.
- **Hosting:** S3 + CloudFront serve the `out/` build and the catalog assets.
- **Catalog assets:** `catalog.json`, `categories.json`, and optimized product images.
- **CDN URL:** optional `NEXT_PUBLIC_CATALOG_CDN_URL` (baked at build time). Empty means same-origin paths like `/catalog.json`.
- **Cart:** Zustand + localStorage.
- **PDF:** generated entirely in the browser with `@react-pdf/renderer` and downloaded locally.

```text
Browser --> CloudFront --> S3
              |-- HTML/JS from Next export (out/)
              |-- catalog.json + products/**/*.webp
```

## Offline importer

`tools/catalog-importer/` runs only in development/ops. It is never part of the storefront runtime.

## Product model

See `src/catalog/schema.ts`. Required MVP fields: `id`, `title`, `slug`, `category`, `kind`, `images.cover`, `active`.

## Docs

- `docs/s3-static-deploy.md` — what to upload to the bucket
- `docs/catalog-publish.md` — catalog-only publish notes
