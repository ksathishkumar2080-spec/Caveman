/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
  ...(process.env.NODE_ENV === "development" && {
    allowedDevOrigins: ["*.replit.dev", "*.pike.replit.dev", "*.repl.co"],
  }),
};

module.exports = nextConfig;
