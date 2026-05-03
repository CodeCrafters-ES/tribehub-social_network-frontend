import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

/**
 * URL of the NestJS backend, used server-side by the rewrite proxy.
 * This variable is never exposed to the browser bundle.
 * In development: http://localhost:3000/api/v1
 * In production:  Railway backend URL
 */
const BACKEND_API_URL =
  process.env.AUTH_API_BASE_URL ?? 'http://localhost:3000/api/v1';

const nextConfig: NextConfig = {
  /**
   * Proxy rewrites — applied on the Next.js server, never visible to the client.
   *
   * Priority order (beforeFiles → afterFiles → fallback):
   *
   *   beforeFiles: BFF routes — /api/v1/auth/{login,register,refresh} are
   *   rewritten to their corresponding Next.js route handlers (/api/auth/*).
   *   These handlers own cookie management, so they MUST NOT be forwarded to
   *   the NestJS backend directly.
   *
   *   afterFiles: Everything else under /api/v1/* is forwarded to the NestJS
   *   backend transparently.
   *
   * Client-side Axios uses NEXT_PUBLIC_API_BASE_URL = http://localhost:5173/api/v1
   * so all requests first reach this Next.js server, which then routes them
   * to the correct destination.
   */
  async rewrites() {
    return {
      beforeFiles: [
        // BFF: login — handled by app/api/auth/login/route.ts
        {
          source: '/api/v1/auth/login',
          destination: '/api/auth/login',
        },
        // BFF: register — handled by app/api/auth/register/route.ts
        {
          source: '/api/v1/auth/register',
          destination: '/api/auth/register',
        },
        // BFF: refresh — handled by app/api/auth/refresh/route.ts
        // This is the critical one: the Axios 401 interceptor calls
        // POST /auth/refresh (resolved against baseURL → /api/v1/auth/refresh).
        // It must reach the BFF so that httpOnly cookies are managed server-side.
        {
          source: '/api/v1/auth/refresh',
          destination: '/api/auth/refresh',
        },
      ],
      afterFiles: [
        // Generic proxy: all other /api/v1/* requests → NestJS backend.
        // AUTH_API_BASE_URL must NOT end with a trailing slash.
        {
          source: '/api/v1/:path*',
          destination: `${BACKEND_API_URL}/:path*`,
        },
      ],
    };
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: false,
  },
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
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:;",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
          },
        ],
      },
    ];
  },
  compress: true,
  experimental: {
    optimizePackageImports: [
      'next/font/google',
      'lucide-react',
      'react-hook-form',
    ],
  },
  turbopack: {
    resolveAlias: {
      '@': './',
    },
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);
