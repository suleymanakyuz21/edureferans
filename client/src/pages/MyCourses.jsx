import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, CheckCircle2, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function MyCourses() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState({ isPremium: false });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const myCourses = [
    { 
      id: 1, 
      title: lang === 'tr' ? 'Modern React ve Next.js Mimarisi' : 'Modern React and Next.js Architecture', 
      progress: 75,
      completedLessons: 9,
      totalLessons: 12,
      lastWatched: lang === 'tr' ? '2 saat önce' : '2 hours ago',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop' 
    },
    { 
      id: 2, 
      title: lang === 'tr' ? 'SaaS Büyüme Stratejileri' : 'SaaS Growth Strategies', 
      progress: 30,
      completedLessons: 6,
      totalLessons: 20,
      lastWatched: lang === 'tr' ? '3 gün önce' : '3 days ago',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop' 
    }
  ];

  const LockedOverlay = () => (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-primary)]/40 backdrop-blur-md rounded-[2rem] border-2 border-dashed border-brand-500/20 p-8 text-center">
      <div className="w-20 h-20 bg-brand-500/20 rounded-full flex items-center justify-center mb-6 border border-brand-500/30">
        <Lock className="h-10 w-10 text-brand-500" />
      </div>
      <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Eğitimlerim Sistemi Kilitli! 🔒</h2>
      <p className="text-gray-400 mb-8 max-w-md font-medium">Bu sayfaya erişmek ve eğitimlerine devam etmek için Pro Üye olmalısın.</p>
      <button 
        onClick={() => navigate('/checkout')}
        className="bg-brand-500 hover:bg-brand-400 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-2xl shadow-brand-500/40 active:scale-95"
      >
        {lang === 'tr' ? 'Pro Üye Ol' : 'Become Pro'}
      </button>
    </div>
  );

  return (
    <div className="relative min-h-[600px] rounded-[2rem] overflow-hidden">
      {!user.isPremium && <LockedOverlay />}
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className={`space-y-8 ${!user.isPremium ? 'opacity-20 pointer-events-none' : ''}`}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">{t('myCourses')}</h1>
            <p className="text-gray-400 mt-2">{t('myCoursesDesc')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {myCourses.map((course) => (
            <div key={course.id} className="glass-card overflow-hidden flex flex-col group">
              <div className="relative h-48 overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40"></div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-white mb-4 line-clamp-2">{course.title}</h3>
                <div className="mt-auto space-y-4">
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500" style={{ width: `${course.progress}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
