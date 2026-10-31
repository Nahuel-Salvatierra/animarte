# Catalog importer

Offline tool that converts Google Drive product images into a static catalog ready for S3.

## Setup

```bash
cd tools/catalog-importer
npm install
```

Copy root `.env.example` values into the repo `.env` (Drive folder IDs + `GOOGLE_API_KEY` / `AI_API_KEY`).

## Usage

```bash
# Import one category without AI (heuristics only)
npm run import -- --category games --skip-ai

# Import selected categories with Gemini
npm run import -- --category anime,disney

# Custom output directory
npm run import -- --out ../../public-catalog --concurrency 3
```

## Output

Writes `public-catalog/` at the repo root:

- `catalog.json`
- `categories.json`
- `import-report.json`
- `review-queue.json`
- `products/{category}/{id}/cover.webp` (+ optional `back.webp`)

## Tests

```bash
npm test
```
