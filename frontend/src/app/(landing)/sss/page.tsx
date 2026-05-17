'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Zap, HelpCircle } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  {
    question: "EduReferans tam olarak nedir?",
    answer: "EduReferans, hem kendinizi geliştirebileceğiniz premium eğitimlere ulaşabildiğiniz hem de referans sistemimiz sayesinde ağınızı büyüterek kazanç sağlayabileceğiniz yenilikçi bir SaaS platformudur."
  },
  {
    question: "Referans sistemi nasıl çalışır?",
    answer: "Sisteme kayıt olduktan sonra Pro üyeliğe geçiş yaptığınızda size özel bir referans kodu tanımlanır. Bu kodla platforma davet ettiğiniz her yeni kullanıcı üzerinden komisyon kazanırsınız. Ayrıca sizin davet ettiklerinizin davet ettiği kişilerden de (2. seviye) kazanç elde edersiniz."
  },
  {
    question: "Ödemeler nasıl ve ne zaman yapılır?",
    answer: "Kazançlarınız cüzdanınızda birikir. Minimum çekim tutarına (örn. 500 TL) ulaştığınızda IBAN numaranıza veya Papara hesabınıza talep edebilirsiniz. Ödemeler her ayın 1. ve 15. günlerinde otomatik olarak hesabınıza aktarılır."
  },
  {
    question: "Pro üyeliğin avantajları nelerdir?",
    answer: "Pro üyelerimiz; platformdaki tüm premium eğitimlere sınırsız erişim hakkı kazanır, kendi referans kodlarını oluşturabilir ve tüm referans ağlarından sınırsız kazanç elde etme hakkına sahip olurlar."
  },
  {
    question: "Eğitimlere mobilden ulaşabilir miyim?",
    answer: "Evet, EduReferans %100 mobil uyumlu (responsive) olarak tasarlanmıştır. Tüm cihazlardan (telefon, tablet, bilgisayar) eğitimlerinizi kesintisiz olarak izleyebilirsiniz."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 relative overflow-hidden bg-[var(--bg-primary)]">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#0ea5e9]/10 blur-[100px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#06b6d4]/10 blur-[100px] rounded-full -z-10 pointer-events-none" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-gradient-to-br from-[#0ea5e9]/20 to-[#06b6d4]/20 border border-[#0ea5e9]/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#0ea5e9]"
          >
            <HelpCircle size={32} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black mb-4 text-[var(--text-primary)]"
          >
            Sıkça Sorulan <span className="text-gradient">Sorular</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[var(--text-secondary)]"
          >
            EduReferans hakkında merak ettiğiniz tüm detaylar.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className={`bg-[var(--card-bg)] border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-[#0ea5e9]/40 shadow-[0_0_30px_rgba(14,165,233,0.1)]' : 'border-[var(--border-color)] hover:border-[var(--border-color-hover)]'}`}
              >
                <button
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className={`font-bold text-lg transition-colors ${isOpen ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-[#0ea5e9]/10 text-[#0ea5e9]' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'}`}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 text-[var(--text-secondary)] leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-[var(--text-muted)] mb-4">Başka sorularınız mı var?</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-secondary-hover)] transition-all">
            <Zap size={16} className="text-[#0ea5e9]" />
            Hemen Aramıza Katıl
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
