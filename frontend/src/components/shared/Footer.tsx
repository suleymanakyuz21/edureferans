import React from 'react';
import Link from 'next/link';
import { Globe, MessageSquare, Monitor, Info, Mail, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)] pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-5 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] flex items-center justify-center shadow-[0_0_14px_rgba(14,165,233,0.3)] group-hover:shadow-[0_0_22px_rgba(14,165,233,0.45)] transition-all">
                <Zap size={15} className="text-white" fill="white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
                EDU<span className="text-gradient">REFERANS</span>
              </span>
            </Link>
            <p className="text-[var(--text-secondary)] mb-6 leading-relaxed text-sm">
              Türkiye&apos;nin en yenilikçi eğitim ve referans platformu. Öğrenirken kazan, kazandırırken büyü.
            </p>
            <div className="flex gap-3">
              {[Globe, MessageSquare, Monitor, Info].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/30 transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-5 text-[var(--text-primary)] text-sm uppercase tracking-widest">Platform</h4>
            <ul className="space-y-3 text-[var(--text-secondary)] text-sm">
              <li><Link href="#courses" className="hover:text-[var(--accent-primary)] transition-colors">Tüm Kurslar</Link></li>
              <li><Link href="#categories" className="hover:text-[var(--accent-primary)] transition-colors">Kategoriler</Link></li>
              <li><Link href="#referral" className="hover:text-[var(--accent-primary)] transition-colors">Referans Sistemi</Link></li>
              <li><Link href="#" className="hover:text-[var(--accent-primary)] transition-colors">Eğitmen Ol</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-5 text-[var(--text-primary)] text-sm uppercase tracking-widest">Destek</h4>
            <ul className="space-y-3 text-[var(--text-secondary)] text-sm">
              <li><Link href="#faq" className="hover:text-[var(--accent-primary)] transition-colors">Sıkça Sorulan Sorular</Link></li>
              <li><Link href="#" className="hover:text-[var(--accent-primary)] transition-colors">Kullanım Koşulları</Link></li>
              <li><Link href="#" className="hover:text-[var(--accent-primary)] transition-colors">Gizlilik Politikası</Link></li>
              <li><Link href="#" className="hover:text-[var(--accent-primary)] transition-colors">İletişim</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-5 text-[var(--text-primary)] text-sm uppercase tracking-widest">Bülten</h4>
            <p className="text-[var(--text-secondary)] text-sm mb-4">Yeni kurslar ve fırsatlardan haberdar olun.</p>
            <div className="relative">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent-primary)]/50 focus:ring-1 focus:ring-[var(--accent-primary)]/20 transition-all text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              />
              <button className="absolute right-2 top-2 w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] text-white shadow-[0_0_12px_rgba(14,165,233,0.3)] hover:shadow-[0_0_20px_rgba(14,165,233,0.45)] transition-all">
                <Mail size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--text-muted)]">
          <p>© {new Date().getFullYear()} EduReferans. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-1 text-xs">
            <span>Üretildi</span>
            <span className="text-[var(--accent-primary)] font-medium">🇹🇷</span>
            <span>ile</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
