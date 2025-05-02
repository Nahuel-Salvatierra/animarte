/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['drive.google.com', 'lh3.googleusercontent.com', 'test.fake'],
  },
  output: 'standalone',
};

module.exports = nextConfig;
