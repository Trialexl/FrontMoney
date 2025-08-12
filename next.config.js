/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1',
  },
  images: {
    domains: ['127.0.0.1', 'localhost'],
  },
}

module.exports = nextConfig