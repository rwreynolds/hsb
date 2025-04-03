/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://hsb-api:5000/api/:path*', // Proxy to Backend
      },
    ];
  },
}

module.exports = nextConfig
