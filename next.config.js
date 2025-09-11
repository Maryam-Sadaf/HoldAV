/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@prisma/client', 'next-auth'],
    turbo: {
      loaders: {
        '.svg': ['@svgr/webpack']
      }
    }
  },
  // Add webpack configuration for path resolution
  webpack: (config, { dev, isServer }) => {
    const path = require('path')
    
    // Ensure the resolve object exists
    if (!config.resolve) {
      config.resolve = {}
    }
    if (!config.resolve.alias) {
      config.resolve.alias = {}
    }
    
    // Add comprehensive aliases for Vercel compatibility
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
      '@/assets': path.resolve(__dirname, 'assets'),
      '@/components': path.resolve(__dirname, 'components'),
      '@/lib': path.resolve(__dirname, 'lib'),
      '@/utils': path.resolve(__dirname, 'utils'),
      '@/types': path.resolve(__dirname, 'types'),
      '@/constants': path.resolve(__dirname, 'constants'),
      '@/contexts': path.resolve(__dirname, 'contexts'),
      '@/providers': path.resolve(__dirname, 'providers'),
    }
    
    // Add fallback for Node.js modules (important for Vercel)
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }
    
    // Ensure proper module resolution
    config.resolve.modules = [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname),
      'node_modules'
    ]
    
    // Add extensions for better resolution
    config.resolve.extensions = [
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.json',
      '.mjs',
      '.cjs'
    ]
    
    // Debug logging for Vercel
    if (process.env.NODE_ENV === 'production') {
      console.log('Webpack alias config:', config.resolve.alias)
      console.log('Webpack modules config:', config.resolve.modules)
    }
    
    // Add a custom resolver plugin for better path resolution
    const { NormalModuleReplacementPlugin } = require('webpack')
    
    // Add replacement plugin for @/ paths
    config.plugins.push(
      new NormalModuleReplacementPlugin(
        /^@\/(.*)$/,
        (resource) => {
          const match = resource.request.match(/^@\/(.*)$/)
          if (match) {
            resource.request = path.resolve(__dirname, match[1])
          }
        }
      )
    )
    
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