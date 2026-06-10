/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['*.replit.dev', '*.pike.replit.dev', '*.repl.co'],
  experimental: {
    turbo: {
      root: process.cwd(),
    },
  },
};

module.exports = nextConfig;
