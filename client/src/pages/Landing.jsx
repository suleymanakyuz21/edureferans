import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Users, BookOpen, Star, ArrowRight, Wallet, CheckCircle2 } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[var(--color-dark-900)] text-white font-sans selection:bg-brand-500/30 overflow-x-hidden">
      
      {/* Background Ambient Lights */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-brand-600/10 blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[30%] h-[50%] rounded-full bg-purple-600/10 blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 border-b border-white/5 bg-white/[0.02] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
            EduReferans<span className="text-brand-500">.</span>
          </Link>
          <div className="hidden md:flex gap-8 items-center text-sm font-medium text-gray-300">
            <a href="#courses" className="hover:text-white transition-colors">Eğitimler</a>
            <a href="#referral" className="hover:text-white transition-colors">Referans Sistemi</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Görüşler</a>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('/login')} className="px-5 py-2 text-sm font-semibold text-white hover:text-brand-300 transition-colors">
              Giriş Yap
            </button>
            <button onClick={() => navigate('/register')} className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all">
              Kayıt Ol
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-4 md:px-8 pt-20 pb-32 flex flex-col lg:flex-row items-center gap-12">
          
          <motion.div variants={containerVars} initial="hidden" animate="show" className="flex-1 space-y-8 text-center lg:text-left">
            <motion.div variants={itemVars} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              Yeni 2 Seviyeli Kazanç Sistemi Yayında
            </motion.div>
            
            <motion.h1 variants={itemVars} className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
              Yeteneklerini <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-500">Gelire</span> Dönüştür.
            </motion.h1>
            
            <motion.p variants={itemVars} className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Sektörün uzmanlarından premium eğitim al, kendi topluluğunu kur ve benzersiz 2 seviyeli referans sistemimizle uyurken bile kazanç elde et.
            </motion.p>
            
            <motion.div variants={itemVars} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={() => navigate('/register')} className="px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-xl text-lg font-bold transition-all flex items-center justify-center gap-2">
                Hemen Başla <ArrowRight className="h-5 w-5" />
              </button>
              <button onClick={() => document.getElementById('referral').scrollIntoView({behavior: 'smooth'})} className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-lg font-bold transition-all flex items-center justify-center gap-2">
                Nasıl Çalışır?
              </button>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="flex-1 w-full relative"
          >
            {/* Mock Dashboard Graphic */}
            <div className="relative rounded-2xl border border-white/10 bg-[var(--color-dark-800)]/80 backdrop-blur-sm p-4 shadow-2xl overflow-hidden aspect-[4/3] flex flex-col">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                <div className="w-32 h-6 bg-white/5 rounded-full"></div>
                <div className="w-10 h-10 bg-brand-500/20 rounded-full"></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="h-24 bg-white/5 rounded-xl border border-white/5"></div>
                <div className="h-24 bg-gradient-to-br from-brand-500/20 to-purple-500/20 rounded-xl border border-brand-500/30"></div>
              </div>
              <div className="flex-1 bg-white/5 rounded-xl border border-white/5"></div>

              {/* Floating elements */}
              <motion.div 
                animate={{ y: [0, -15, 0] }} 
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-1/4 -right-6 glass-card p-4 flex items-center gap-4 border-brand-500/30"
              >
                <div className="w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/40">
                  <Wallet className="text-white h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Yeni Komisyon</p>
                  <p className="text-lg font-bold text-white">+₺2,500</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 15, 0] }} 
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute bottom-1/4 -left-6 glass-card p-4 flex items-center gap-4 border-green-500/30"
              >
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/40">
                  <CheckCircle2 className="text-white h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Eğitim Tamamlandı</p>
                  <p className="text-sm font-bold text-white">React Mastery</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-white/5 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/5">
              <div>
                <p className="text-4xl md:text-5xl font-black text-white mb-2">15.4K</p>
                <p className="text-gray-500 font-medium text-sm tracking-wider uppercase">Aktif Öğrenci</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-black text-white mb-2">240+</p>
                <p className="text-gray-500 font-medium text-sm tracking-wider uppercase">Premium Eğitim</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-black text-white mb-2">85</p>
                <p className="text-gray-500 font-medium text-sm tracking-wider uppercase">Uzman Eğitmen</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400 mb-2">₺4.5M</p>
                <p className="text-brand-200/50 font-medium text-sm tracking-wider uppercase">Dağıtılan Komisyon</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="max-w-4xl mx-auto px-4 md:px-8 py-32 text-center">
          <h2 className="text-4xl font-bold mb-6">Öğrenmeye ve Kazanmaya Hazır mısın?</h2>
          <p className="text-gray-400 mb-10 text-lg">Hemen ücretsiz kayıt ol, dashboard'unu keşfet ve ilk adımını at.</p>
          <button onClick={() => navigate('/register')} className="px-10 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xl font-bold shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all">
            Ücretsiz Kayıt Ol
          </button>
        </section>

      </main>
    </div>
  );
}
