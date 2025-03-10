/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/videos/:path*',
        destination: '/api/videos/stream/:path*',
      },
    ]
  },
}

export default nextConfig