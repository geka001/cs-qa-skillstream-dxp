/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: [],
    unoptimized: true, // For Contentstack Launch compatibility
  },
  // Ensure compatibility with Contentstack Launch
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig

