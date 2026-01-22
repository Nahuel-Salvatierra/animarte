/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: [
      'drive.google.com',
      'lh3.googleusercontent.com',
      'test.fake',
      'https://drive.google.com',
      'https://lh3.googleusercontent.com',
      'https://www.google.com',
    ],
  },
  output: 'standalone',
};

module.exports = nextConfig;
