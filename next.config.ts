/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ["drive.google.com", "lh3.googleusercontent.com"],
  },
  output: "standalone",
};

module.exports = nextConfig;
