/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'indexbuilding.com.au' },
      { protocol: 'https', hostname: 'www.indexbuilding.com.au' },
    ],
  },
}
export default nextConfig
