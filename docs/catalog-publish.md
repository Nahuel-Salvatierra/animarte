# Publishing catalog updates

For the full static site + catalog layout, see [`s3-static-deploy.md`](./s3-static-deploy.md).

## Catalog-only refresh

When only products change (app HTML unchanged):

1. Run the importer and review `review-queue.json`.
2. Sync `public-catalog/` to the bucket root (exclude reports).
3. Invalidate CloudFront paths `/catalog.json`, `/categories.json`, and any replaced product image paths.

## Do not upload

- `import-report.json`
- `review-queue.json`
- Importer workdir / secrets
