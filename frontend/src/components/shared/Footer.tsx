import React from 'react';
import Link from 'next/link';
import { Youtube, Github, Globe, MessageSquare, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)] pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="text-2xl font-extrabold tracking-tighter text-[var(--text-primary)] mb-6 block">
              EDU<span className="text-indigo-500">REFERANS</span>
            </Link>
            <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
              Türkiye'nin en yenilikçi eğitim ve referans platformu. Öğrenirken kazan, kazandırırken büyü.
            </p>
            <div className="flex gap-4">
              {[Youtube, Github, Globe, MessageSquare].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-white hover:border-indigo-500 transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-[var(--text-secondary)] text-sm">
              <li><Link href="#courses" className="hover:text-white transition-colors">Tüm Kurslar</Link></li>
              <li><Link href="#categories" className="hover:text-white transition-colors">Kategoriler</Link></li>
              <li><Link href="#referral" className="hover:text-white transition-colors">Referans Sistemi</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Eğitmen Ol</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Destek</h4>
            <ul className="space-y-4 text-[var(--text-secondary)] text-sm">
              <li><Link href="#faq" className="hover:text-white transition-colors">Sıkça Sorulan Sorular</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Kullanım Koşulları</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Gizlilik Politikası</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">İletişim</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Bülten</h4>
            <p className="text-[var(--text-secondary)] text-sm mb-4">Yeni kurslar ve fırsatlardan haberdar olun.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="E-posta adresiniz"
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-full px-5 py-3 text-sm focus:outline-none focus:border-indigo-500"
              />
              <button className="absolute right-2 top-2 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-500 text-white">
                <Mail size={14} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-[var(--border-color)] text-center text-sm text-[var(--text-secondary)]">
          <p>© {new Date().getFullYear()} EduReferans. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
