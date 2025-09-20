/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  serverExternalPackages: ['bcrypt'],
  turbopack: {
    rules: {
      '*.svg': ['@svgr/webpack']
    }
  },
  // Add webpack configuration for path resolution
  webpack: (config, { dev, isServer }) => {
    const path = require('path')
    
    // Simple and direct alias configuration for Vercel
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    }
    
    // Force refresh for Vercel deployment
    console.log('Webpack config loaded for Vercel deployment')
    
    // Remove Prisma externals; Firestore Admin runs fine without special externals

    if (!dev && !isServer) {
      // CSS tree-shaking and minification
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        styles: {
          name: 'styles',
          test: /\.(css|scss|sass)$/,
          chunks: 'all',
          enforce: true,
        },
      }
    }
    return config
  },
  // Enable compression
  compress: true,
  // Enable image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 3600, // Cache for 1 hour
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Enable modern JavaScript
  transpilePackages: [],
  // Headers for static assets and performance
  async headers() {
    return [
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      },
      {
        source: '/(.*\\.(?:jpg|jpeg|png|gif|webp|avif|svg|ico))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      },
      {
        source: '/(.*\\.(?:js|css))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
