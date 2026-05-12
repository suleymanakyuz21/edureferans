import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Star, Clock, BookOpen, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Courses() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState({ isPremium: false });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handlePlayClick = (id) => {
    if (!user.isPremium) {
      alert(lang === 'tr' ? 'Önce Pro üye olmalısın!' : 'You must be a Pro member first!');
      return;
    }
    navigate(`/courses/${id}`);
  };

  const categories = [
    t('all'), 
    lang === 'tr' ? 'Yazılım' : 'Software', 
    lang === 'tr' ? 'Tasarım' : 'Design', 
    lang === 'tr' ? 'Pazarlama' : 'Marketing', 
    lang === 'tr' ? 'Girişimcilik' : 'Entrepreneurship'
  ];

  const courses = [
    { id: 1, title: lang === 'tr' ? 'Modern React ve Next.js Mimarisi' : 'Modern React and Next.js Architecture', instructor: 'Ahmet Yılmaz', duration: lang === 'tr' ? '12 Saat' : '12 Hours', rating: 4.9, students: '2.4k', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop', category: lang === 'tr' ? 'Yazılım' : 'Software' },
    { id: 2, title: lang === 'tr' ? 'İleri Seviye UI/UX Tasarım' : 'Advanced UI/UX Design', instructor: 'Ayşe Demir', duration: lang === 'tr' ? '8.5 Saat' : '8.5 Hours', rating: 4.8, students: '1.2k', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop', category: lang === 'tr' ? 'Tasarım' : 'Design' },
    { id: 3, title: lang === 'tr' ? 'SaaS Büyüme Stratejileri' : 'SaaS Growth Strategies', instructor: 'Can Özkan', duration: lang === 'tr' ? '5 Saat' : '5 Hours', rating: 4.7, students: '850', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop', category: lang === 'tr' ? 'Girişimcilik' : 'Entrepreneurship' },
    { id: 4, title: lang === 'tr' ? 'Dijital Pazarlama Masterclass' : 'Digital Marketing Masterclass', instructor: 'Zeynep Kaya', duration: lang === 'tr' ? '15 Saat' : '15 Hours', rating: 4.9, students: '3.1k', image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=800&auto=format&fit=crop', category: lang === 'tr' ? 'Pazarlama' : 'Marketing' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">{lang === 'tr' ? 'Eğitim Kütüphanesi' : 'Course Library'}</h1>
          <p className="text-gray-400 mt-2">{lang === 'tr' ? 'Kariyerini bir sonraki seviyeye taşıyacak premium içerikler.' : 'Premium content to take your career to the next level.'}</p>
        </div>
      </div>

      {/* Featured Course */}
      <div className="relative rounded-3xl overflow-hidden group cursor-pointer" onClick={() => handlePlayClick(1)}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10"></div>
        <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop" alt="Featured" className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105" />
        
        <div className="absolute inset-0 z-20 flex flex-col justify-center p-8 md:p-12 md:w-2/3">
          <span className="inline-block px-3 py-1 bg-brand-500/20 text-brand-400 border border-brand-500/30 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 w-max">
            {lang === 'tr' ? 'Yeni Eklenen' : 'Newly Added'}
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
            {lang === 'tr' ? 'Yapay Zeka ile Web Geliştirme' : 'Web Development with AI'}
          </h2>
          <div className="flex gap-4">
            <button className="bg-white text-black hover:bg-gray-200 font-black px-8 py-3 rounded-2xl flex items-center gap-2 transition-all">
              <Play className="h-5 w-5 fill-current" /> {lang === 'tr' ? 'Hemen İzle' : 'Watch Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div>
        <h2 className="text-xl font-black text-white mb-6 flex items-center justify-between">
          {lang === 'tr' ? 'Popüler Eğitimler' : 'Popular Courses'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div 
              key={course.id} 
              onClick={() => handlePlayClick(course.id)}
              className="glass-card group cursor-pointer overflow-hidden flex flex-col h-full"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center text-white shadow-xl">
                    <Play className="h-5 w-5 fill-current ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-brand-400 transition-colors leading-snug">{course.title}</h3>
                <p className="text-sm text-gray-500 font-medium mb-4">{course.instructor}</p>
                
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-brand-500" /> {course.duration}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
