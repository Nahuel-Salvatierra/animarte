# Deploy Animarte as a static site on S3 + CloudFront

No Node server. No SSR. The browser loads the exported HTML/JS and fetches `catalog.json` + images from the same CloudFront (or CDN URL).

## 1. Build locally

```bash
# Optional: bake CDN URL into the client bundle (no trailing slash).
# If the app and catalog share the same CloudFront domain, you can leave it empty.
set NEXT_PUBLIC_CATALOG_CDN_URL=https://cdn.animarte.website

npm install
npm run build
```

Output folder: `out/`

Also prepare catalog assets with the importer (`public-catalog/`), or reuse `public/catalog.json` for a smoke test.

## 2. What to put in the S3 bucket

Use **one bucket** (recommended) behind CloudFront. Sync these two trees into the **bucket root**:

### A) Website (from `out/`)

Upload **all contents** of `out/` to the bucket root, for example:

```text
s3://animarte-site/
  index.html
  404.html
  favicon.svg
  animarte_logo.png
  error_load_image.png
  catalog.json              # only if you keep the local fixture; prefer importer output
  categories.json
  _next/static/...
  cuadernos/anime/index.html
  cuadernos/cartoon/index.html
  ...
  caratulas/index.html
  pdf/index.html
```

### B) Catalog media (from `public-catalog/`)

Upload on top of the same bucket root (do **not** nest under another folder unless you also change CDN paths):

```text
s3://animarte-site/
  catalog.json              # from public-catalog/catalog.json (overwrite fixture)
  categories.json           # from public-catalog/categories.json
  products/
    anime/
      <product-id>/
        cover.webp
        back.webp           # optional
    disney/
      ...
    cover/
      ...
```

Do **not** upload to the public bucket:

- `import-report.json`
- `review-queue.json`
- `tools/catalog-importer/.work/`

### Final bucket layout (target)

```text
s3://YOUR_BUCKET/
├── index.html                 # app home
├── 404.html
├── _next/                     # Next static assets
├── cuadernos/...              # pre-rendered category pages
├── caratulas/
├── pdf/
├── animarte_logo.png
├── favicon.svg
├── error_load_image.png
├── catalog.json               # product list (browser fetch)
├── categories.json
└── products/                  # WebP images referenced by catalog.json
    └── {category}/{id}/cover.webp
```

## 3. Suggested upload commands

```bash
# 1) App build
aws s3 sync ./out s3://YOUR_BUCKET/ \
  --delete \
  --exclude "catalog.json" \
  --exclude "categories.json" \
  --exclude "products/*" \
  --cache-control "public,max-age=31536000,immutable" \
  --exclude "*.html" \
  --exclude "*.json"

aws s3 sync ./out s3://YOUR_BUCKET/ \
  --exclude "*" \
  --include "*.html" \
  --include "*.json" \
  --cache-control "public,max-age=60,s-maxage=300,stale-while-revalidate=600" \
  --content-type "text/html" # only when needed; aws usually detects

# Simpler first deploy (fine to start):
aws s3 sync ./out s3://YOUR_BUCKET/ --delete

# 2) Catalog from importer (overwrites catalog.json / products)
aws s3 sync ./public-catalog s3://YOUR_BUCKET/ \
  --exclude "import-report.json" \
  --exclude "review-queue.json" \
  --exclude ".work/*"
```

### Cache-Control cheat sheet

| Path | Cache-Control |
|---|---|
| `_next/static/**` | `public, max-age=31536000, immutable` |
| `products/**/*.webp` | `public, max-age=31536000, immutable` |
| `*.html` | `public, max-age=60, s-maxage=300` |
| `catalog.json` | `public, max-age=60, s-maxage=300, stale-while-revalidate=600` |
| `categories.json` | `public, max-age=300, s-maxage=900` |

## 4. CloudFront settings

1. Origin: S3 bucket with **Origin Access Control** (keep bucket private).
2. Default root object: `index.html`.
3. Custom error responses (important for exported routes):
   - HTTP 403 → `/404.html` (or `/index.html`) with 404
   - HTTP 404 → `/404.html` with 404
4. Because the export uses `trailingSlash: true`, URLs look like `/cuadernos/anime/`.
5. CORS (only needed if app and catalog are on **different** domains). Same-bucket same-CDN: usually not required for `fetch('/catalog.json')`.
6. If you set `NEXT_PUBLIC_CATALOG_CDN_URL` to this CloudFront URL at build time, rebuild after changing the domain.

## 5. Env vars

| Variable | Where | Notes |
|---|---|---|
| `NEXT_PUBLIC_CATALOG_CDN_URL` | **Build time** only | Empty = same origin (`/catalog.json`). Example: `https://cdn.animarte.website` |
| Importer `GOOGLE_*` / `AI_*` | Local machine only | Never put these in S3 or the browser |

## 6. Continuous deploy (GitHub Actions)

Every push to `main` (and manual **Run workflow**) runs `.github/workflows/deploy.yml`:

1. `npm ci` → `npm run build`
2. Assume an IAM role via **OIDC** (no long-lived AWS keys in GitHub)
3. Sync `out/` to S3 (**never** deletes/overwrites `products/`, `catalog.json`, or `categories.json`)
4. Invalidate CloudFront `/*` when `CLOUDFRONT_DISTRIBUTION_ID` is set

Catalog media still comes from the importer + manual/`aws s3 sync` of `public-catalog/` (see [`catalog-publish.md`](./catalog-publish.md)). App deploys do not wipe the catalog.

### GitHub configuration

Repo → **Settings → Secrets and variables → Actions**:

| Type | Name | Value |
|------|------|--------|
| Secret | `AWS_DEPLOY_ROLE_ARN` | IAM role ARN trusted by GitHub OIDC |
| Secret | `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution id |
| Variable | `S3_BUCKET` | Bucket name (required) |
| Variable | `AWS_REGION` | e.g. `sa-east-1` (optional; default `sa-east-1`) |
| Variable | `NEXT_PUBLIC_CATALOG_CDN_URL` | Optional; empty = same-origin `/catalog.json` |

### IAM role (OIDC)

1. Create (or reuse) the GitHub OIDC provider: `https://token.actions.githubusercontent.com`, audience `sts.amazonaws.com`.
2. Trust policy condition for this repo/branch:

```json
"token.actions.githubusercontent.com:sub": "repo:Nahuel-Salvatierra/animarte:ref:refs/heads/main"
```

3. Allow at least: `s3:ListBucket` on the bucket; `s3:GetObject` / `PutObject` / `DeleteObject` on `arn:aws:s3:::BUCKET/*`; `cloudfront:CreateInvalidation` on the distribution. Optionally deny writes under `products/*` if the importer uses a different principal.

Old `VPS_*` secrets are unused by this workflow and can be removed after cutover.

## 7. Manual update checklist

1. `npm run build` → produces `out/`
2. Run importer → refresh `public-catalog/`
3. Sync `out/` then `public-catalog/` to S3
4. Invalidate CloudFront: `/catalog.json`, `/categories.json`, `/*.html` (or `/*` on first deploy)
5. Open the CloudFront URL, browse a category, add to cart, download PDF

## Local preview of the static build

```bash
npm run build
npm start   # serves ./out on port 3000
```
