import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'TribeHub | Social Network',
  description: 'Conecta con el mundo de una nueva manera',
  keywords: ['social network', 'tribehub', 'community'],
  robots: 'index, follow',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TribeHub',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="min-h-screen">
        <a href="#main-content" className="sr-only">
          Ir al contenido principal
        </a>
        <main id="main-content" role="main">
          {children}
        </main>
      </body>
    </html>
  );
}
