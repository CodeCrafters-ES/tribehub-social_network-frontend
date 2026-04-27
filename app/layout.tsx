import type { Metadata, Viewport } from 'next';
import { Sora, Space_Grotesk } from 'next/font/google';
import './globals.css';

const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sora',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'TribeHub | Social Network',
  description: 'Social network for communities',
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
    <html
      lang="es"
      suppressHydrationWarning
      className={`${sora.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#2c6e49" />
      </head>
      <body className="min-h-screen antialiased">
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
