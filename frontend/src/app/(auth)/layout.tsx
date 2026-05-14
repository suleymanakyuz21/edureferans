import type { Metadata } from 'next';

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
      <main>{children}</main>
    </div>
  );
}
