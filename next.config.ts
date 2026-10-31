/** @type {import('next').NextConfig} */
const catalogCdn = process.env.NEXT_PUBLIC_CATALOG_CDN_URL;
let catalogHostname: string | undefined;

try {
  if (catalogCdn) {
    catalogHostname = new URL(catalogCdn).hostname;
  }
} catch {
  catalogHostname = undefined;
}

const remotePatterns = [
  {
    protocol: 'https',
    hostname: '**.cloudfront.net',
  },
  ...(catalogHostname
    ? [
        {
          protocol: 'https',
          hostname: catalogHostname,
        },
      ]
    : []),
];

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns,
  },
};

module.exports = nextConfig;
