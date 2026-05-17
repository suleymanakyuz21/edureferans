'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const stored = (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
    setTheme(stored);
    document.documentElement.setAttribute('data-theme', stored);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const navLinks = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Kategoriler', href: '#categories' },
    { name: 'Referans Sistemi', href: '#referral' },
    { name: 'SSS', href: '/sss', external: true },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300 py-5',
        isScrolled
          ? 'py-3 bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-[var(--border-color)]'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] flex items-center justify-center shadow-[0_0_16px_rgba(14,165,233,0.35)] group-hover:shadow-[0_0_24px_rgba(14,165,233,0.5)] transition-all">
            <Zap size={16} className="text-white" fill="white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
            EDU<span className="text-gradient">REFERANS</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                target={link.external ? "_blank" : undefined}
                className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-200"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/30 transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link
            href="/login"
            className="px-5 py-2 rounded-xl border border-[var(--border-color)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)]/30 transition-all"
          >
            Giriş Yap
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 rounded-xl btn-gradient text-sm font-semibold text-white"
          >
            Kayıt Ol
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-[var(--text-primary)] w-9 h-9 flex items-center justify-center rounded-xl border border-[var(--border-color)]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[var(--bg-secondary)]/95 backdrop-blur-xl border-b border-[var(--border-color)] overflow-hidden"
          >
            <div className="flex flex-col gap-1 p-5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] px-3 py-2.5 rounded-xl hover:bg-[var(--accent-primary)]/5 transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-[var(--border-color)] mt-2">
                <Link href="/login" className="text-center py-3 rounded-xl border border-[var(--border-color)] text-sm font-medium hover:border-[var(--accent-primary)]/30 transition-all">
                  Giriş Yap
                </Link>
                <Link href="/register" className="text-center py-3 rounded-xl btn-gradient text-white text-sm font-semibold">
                  Kayıt Ol
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
