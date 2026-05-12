import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, MessageCircle, HelpCircle, ArrowLeft, BookOpen, CreditCard, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqData = [
  {
    category: 'Genel',
    icon: HelpCircle,
    questions: [
      { q: 'Platform nasıl çalışıyor?', a: 'EduReferans, yazılım ve teknoloji eğitimlerini barındıran yeni nesil bir ekosistemdir. Pro üye olarak tüm içeriklere erişebilir ve aynı zamanda referans sistemiyle gelir elde edebilirsiniz.' },
      { q: 'Üyelik ücretli mi?', a: 'Sistemi incelemek ve ücretsiz içeriklere göz atmak tamamen ücretsizdir. Tüm premium içeriklere erişmek ve komisyon sistemine dahil olmak için Pro (Aylık/Yıllık) aboneliği gereklidir.' },
      { q: 'Eğitimlere nasıl erişebilirim?', a: 'Pro üyeliğinizi başlattığınız anda tüm video eğitimler, dökümanlar ve projeler panelinize anında tanımlanır. İstediğiniz zaman, istediğiniz cihazdan izleyebilirsiniz.' }
    ]
  },
  {
    category: 'Referans Sistemi',
    icon: Users,
    questions: [
      { q: 'Referral sistemi nasıl çalışır?', a: 'Sisteme kayıt olduğunuzda size özel bir referans kodu tanımlanır. Bu kodu kullanarak kayıt olan her yeni Pro üye için komisyon kazanırsınız.' },
      { q: 'Level 1 ve Level 2 kazanç nedir?', a: 'Level 1 (Seviye 1), doğrudan sizin davet ettiğiniz üyelerden kazandığınız %25\'lik dilimdir. Level 2 (Seviye 2) ise sizin davet ettiğiniz kişilerin getirdiği üyelerden kazandığınız %10\'luk pasif gelir dilimidir.' },
      { q: 'Kazançlar ne zaman hesabıma yansır?', a: 'Davet ettiğiniz üyenin ödemesi başarıyla gerçekleştiği saniye, komisyon tutarı cüzdanınıza yansır ve bildirim alırsınız. Herhangi bir bekleme süresi yoktur.' },
      { q: 'Referral linkimi/kodumu nereden bulabilirim?', a: 'Giriş yaptıktan sonra sol menüdeki "Referanslarım" (Referrals) sekmesine tıklayarak size özel kodunuzu görebilir ve kopyalayabilirsiniz.' }
    ]
  },
  {
    category: 'Ödemeler',
    icon: CreditCard,
    questions: [
      { q: 'Ödeme yöntemi güvenli mi?', a: 'Kesinlikle. Tüm ödemeler 256-bit SSL şifreleme teknolojisiyle korunur ve doğrudan yetkili lisanslı ödeme kuruluşları (Stripe/Iyzico) altyapısı üzerinden gerçekleşir.' },
      { q: 'Kazanç çekme işlemleri ne kadar sürer?', a: 'Para çekme talebiniz oluşturulduktan sonra, bakiyeniz 1-3 iş günü içerisinde kayıtlı banka hesabınıza (IBAN) aktarılır.' },
      { q: 'Hangi ödeme yöntemleri destekleniyor?', a: 'Tüm yurt içi ve yurt dışı kredi kartları, banka kartları ve sanal kartlar ile ödeme yapabilirsiniz.' }
    ]
  },
  {
    category: 'Eğitimler',
    icon: BookOpen,
    questions: [
      { q: 'Videolar sınırsız mı?', a: 'Evet. Pro üyeliğiniz aktif olduğu sürece platformdaki tüm video eğitimleri hiçbir sınır olmadan dilediğiniz kadar izleyebilirsiniz.' },
      { q: 'Mobil cihazlardan izleyebilir miyim?', a: 'Elbette. Platformumuz mobil uyumludur. Telefonunuzdan veya tabletinizden girerek tüm eğitimlere kesintisiz devam edebilirsiniz.' },
      { q: 'Yeni eğitimler ne sıklıkla ekleniyor?', a: 'Eğitim kütüphanemiz her ay düzenli olarak yeni içerikler, modern teknolojiler ve güncel projelerle genişletilmektedir.' }
    ]
  },
  {
    category: 'Hesap ve Güvenlik',
    icon: Shield,
    questions: [
      { q: 'Şifremi nasıl değiştirebilirim?', a: 'Panelinize giriş yaptıktan sonra "Ayarlar" sekmesine giderek "Güvenlik" bölümünden şifrenizi kolayca güncelleyebilirsiniz.' },
      { q: 'Hesabımı silebilir miyim?', a: 'Evet. Hesap ayarlarınızdan dilediğiniz zaman hesabınızı kalıcı olarak silme talebinde bulunabilirsiniz.' }
    ]
  }
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(faqData[0].category);
  const [openIndex, setOpenIndex] = useState(null);

  // Support Ticket Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitStatus, setSubmitStatus] = useState({ loading: false, success: false, error: null });

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ loading: true, success: false, error: null });
    
    try {
      const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? `http://${window.location.hostname}:3000/api/support` 
        : '/api/support';

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Bir hata oluştu.');
      
      setSubmitStatus({ loading: false, success: true, error: null });
      setTimeout(() => {
        setIsModalOpen(false);
        setFormData({ name: '', email: '', message: '' });
        setSubmitStatus({ loading: false, success: false, error: null });
      }, 3000);
    } catch (err) {
      setSubmitStatus({ loading: false, success: false, error: err.message });
    }
  };

  // Filter categories and questions based on search
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return faqData;
    
    const query = searchQuery.toLowerCase();
    return faqData.map(cat => ({
      ...cat,
      questions: cat.questions.filter(
        q => q.q.toLowerCase().includes(query) || q.a.toLowerCase().includes(query)
      )
    })).filter(cat => cat.questions.length > 0);
  }, [searchQuery]);

  // When search changes, expand active tab if needed or clear active tab
  const displayData = searchQuery ? filteredData : faqData.filter(d => d.category === activeTab);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] font-sans selection:bg-brand-500/30 text-white relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* Navigation (Simplified for Public) */}
      <nav className="absolute top-0 left-0 w-full p-6 md:px-12 flex justify-between items-center z-50">
        <a href={`http://${window.location.hostname}:3000/`} className="text-2xl font-black text-white tracking-tighter flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
            E
          </div>
          EduReferans.
        </a>
        <a href={`http://${window.location.hostname}:3000/`} className="text-sm font-bold text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Ana Sayfaya Dön
        </a>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-16 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
              Nasıl Yardımcı <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-500">Olabiliriz?</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
              Platform, referans sistemi, ödemeler ve eğitimler hakkında merak edilen tüm soruların cevaplarını burada bulabilirsiniz.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative max-w-2xl mx-auto group"
          >
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-brand-400 transition-colors">
              <Search className="h-6 w-6" />
            </div>
            <input
              type="text"
              placeholder="Sorunuzu arayın (Örn: Komisyon oranı nedir?)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--bg-glass)] border-2 border-[var(--border-color)] rounded-2xl py-5 pl-14 pr-6 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 transition-all font-medium text-lg backdrop-blur-xl shadow-2xl"
            />
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pb-24 relative z-10">
        
        {/* Category Tabs (Only show if not searching) */}
        {!searchQuery && (
          <div className="flex overflow-x-auto hide-scrollbar gap-3 mb-10 pb-4 snap-x">
            {faqData.map((category) => {
              const Icon = category.icon;
              const isActive = activeTab === category.category;
              return (
                <button
                  key={category.category}
                  onClick={() => { setActiveTab(category.category); setOpenIndex(null); }}
                  className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-300 snap-center shadow-lg ${
                    isActive 
                      ? 'bg-brand-500 text-white border-brand-400 shadow-brand-500/25' 
                      : 'bg-white/5 text-gray-400 border-[var(--border-color)] hover:bg-white/10 hover:text-white'
                  } border`}
                >
                  <Icon className="w-4 h-4" />
                  {category.category}
                </button>
              );
            })}
          </div>
        )}

        {/* Questions Accordion */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {displayData.length > 0 ? (
              displayData.map((category, catIdx) => (
                <motion.div key={category.category} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  
                  {/* Show Category Header only when searching to separate results */}
                  {searchQuery && (
                    <h3 className="text-sm font-black text-brand-400 uppercase tracking-widest mt-8 mb-4 ml-2 flex items-center gap-2">
                      <category.icon className="w-4 h-4" /> {category.category}
                    </h3>
                  )}

                  <div className="space-y-4">
                    {category.questions.map((item, qIdx) => {
                      const globalIndex = `${catIdx}-${qIdx}`;
                      const isOpen = openIndex === globalIndex;

                      return (
                        <motion.div 
                          layout
                          key={globalIndex}
                          className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                            isOpen 
                              ? 'bg-[var(--bg-glass)] border-brand-500/50 shadow-xl shadow-brand-500/10' 
                              : 'bg-white/5 border-[var(--border-color)] hover:border-white/20'
                          }`}
                        >
                          <button
                            onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                            className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                          >
                            <span className={`font-bold text-lg transition-colors ${isOpen ? 'text-white' : 'text-gray-200'}`}>
                              {item.q}
                            </span>
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-brand-500 text-white rotate-180' : 'bg-white/5 text-gray-400 group-hover:bg-white/10'}`}>
                              <ChevronDown className="w-5 h-5" />
                            </div>
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                              >
                                <div className="px-6 pb-6 pt-0 text-[var(--text-secondary)] leading-relaxed font-medium">
                                  {item.a}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))
            ) : (
              /* Empty State for Search */
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center py-20 bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-3xl"
              >
                <div className="w-20 h-20 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-400">
                  <Search className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Sonuç Bulunamadı</h3>
                <p className="text-[var(--text-secondary)]">"{searchQuery}" aramasına uygun bir soru bulamadık.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Support CTA Section */}
      <section className="border-t border-[var(--border-color)] bg-white/[0.02] py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-500/20">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4">Hâlâ yardım mı gerekiyor?</h2>
          <p className="text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
            Aradığınız sorunun cevabını bulamadıysanız, destek ekibimizle doğrudan iletişime geçebilirsiniz. Size yardımcı olmaktan memnuniyet duyarız.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-brand-500 hover:bg-brand-400 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-xl shadow-brand-500/30 active:scale-95"
            >
              Destek Talebi Oluştur
            </button>
          </div>
        </div>
      </section>

      {/* Support Ticket Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl"
            >
              <div className="p-8">
                <h3 className="text-2xl font-black text-white mb-2">Destek Talebi</h3>
                <p className="text-[var(--text-secondary)] text-sm mb-6">Lütfen sorununuzu detaylı bir şekilde açıklayın. Ekibimiz en kısa sürede dönüş yapacaktır.</p>

                {submitStatus.success ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-6 rounded-2xl text-center">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h4 className="font-bold text-lg mb-1">Talebiniz Alındı!</h4>
                    <p className="text-sm opacity-80">En kısa sürede e-posta üzerinden dönüş yapacağız.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSupportSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider pl-1">Ad Soyad</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-black/20 border border-[var(--border-color)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all" 
                          placeholder="Adınız Soyadınız"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider pl-1">E-posta</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-black/20 border border-[var(--border-color)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all" 
                          placeholder="ornek@mail.com"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider pl-1">Mesajınız</label>
                      <textarea 
                        required
                        rows="4"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-black/20 border border-[var(--border-color)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none" 
                        placeholder="Karşılaştığınız sorunu veya sormak istediğiniz soruyu buraya yazın..."
                      />
                    </div>

                    {submitStatus.error && (
                      <p className="text-red-400 text-sm">{submitStatus.error}</p>
                    )}

                    <div className="pt-2 flex justify-end gap-3">
                      <button 
                        type="button" 
                        onClick={() => setIsModalOpen(false)}
                        className="px-6 py-3 rounded-xl font-bold text-sm text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all"
                      >
                        İptal
                      </button>
                      <button 
                        type="submit" 
                        disabled={submitStatus.loading}
                        className="bg-brand-500 hover:bg-brand-400 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-brand-500/25 disabled:opacity-50 flex items-center gap-2"
                      >
                        {submitStatus.loading ? 'Gönderiliyor...' : 'Talebi Gönder'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
