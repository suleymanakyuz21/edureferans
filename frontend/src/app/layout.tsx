import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import QueryProvider from '@/components/providers/QueryProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'EduReferans | Yeteneklerini Gelire Dönüştür',
    template: '%s | EduReferans',
  },
  description:
    "Türkiye'nin en yenilikçi eğitim ve referans platformu. Öğrenirken kazan, kazandırırken büyü.",
  keywords: ['eğitim', 'referans sistemi', 'online kurs', 'pasif gelir', 'edureferans'],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'EduReferans',
    title: 'EduReferans | Yeteneklerini Gelire Dönüştür',
    description: "Türkiye'nin en yenilikçi eğitim ve referans platformu.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduReferans',
    description: "Türkiye'nin en yenilikçi eğitim ve referans platformu.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* FOUC Prevention — must run before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', theme);
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
