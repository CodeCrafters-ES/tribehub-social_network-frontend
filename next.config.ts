import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  /* Optimización de imágenes */
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    /* Lazy loading por defecto */
    unoptimized: false,
  },
  /* Caching de archivos estáticos */
  headers: async () => {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ];
  },
  /* Compresión habilitada por defecto en Next.js 16 */
  compress: true,
  /* Optimización de fuentes */
  experimental: {
    optimizePackageImports: ['next/font/google'],
  },
  /* Optimizar código dividido */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      /* Optimizar bundle de cliente */
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      };
    }
    return config;
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);
