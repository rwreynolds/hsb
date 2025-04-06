/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:5000/api/:path*', // Ensure this matches your backend's URL
      },
    ];
  },
  experimental: {
    allowedDevOrigins: ['localhost:3000', '127.0.0.1:3000', '192.168.1.198:3000'],
  },
};

module.exports = nextConfig;