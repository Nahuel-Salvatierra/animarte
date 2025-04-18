/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ["drive.google.com", "lh3.googleusercontent.com"],
  },
};

module.exports = nextConfig;
