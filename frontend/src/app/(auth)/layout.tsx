import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Giriş Yap | EduReferans',
  description: 'EduReferans hesabınıza giriş yapın.',
  robots: 'noindex',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Minimal header for auth pages */}
      <div className="fixed top-0 left-0 right-0 z-50 py-6 px-8">
        <Link href="/" className="text-xl font-extrabold tracking-tighter text-[var(--text-primary)]">
          EDU<span className="text-indigo-500">REFERANS</span>
        </Link>
      </div>
      <main>{children}</main>
    </div>
  );
}
