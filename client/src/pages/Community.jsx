import { motion } from 'framer-motion';
import { ThumbsUp, TrendingUp, Users, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Community() {
  const { t, lang } = useLanguage();

  const announcements = [
    { 
      id: 1, 
      author: lang === 'tr' ? 'Platform Yönetimi' : 'Platform Management', 
      avatar: 'https://i.pravatar.cc/150?u=admin1',
      title: lang === 'tr' ? '🚀 Sadece Bugüne Özel: +%30 Ekstra Komisyon!' : '🚀 Today Only: +30% Extra Commission!', 
      content: lang === 'tr' ? 'Bugün (24:00\'e kadar) referans linkinizle platformumuza kazandırdığınız her yeni aktif üye için standart komisyon oranına ek olarak %30 bonus kazanacaksınız.' : 'Earn an extra 30% bonus on top of standard commission for every new active member you refer today (until 24:00).',
      category: lang === 'tr' ? 'Kampanya' : 'Campaign',
      likes: 342,
      time: lang === 'tr' ? '2 saat önce' : '2 hours ago'
    },
    { 
      id: 2, 
      author: lang === 'tr' ? 'Platform Yönetimi' : 'Platform Management', 
      avatar: 'https://i.pravatar.cc/150?u=admin1',
      title: lang === 'tr' ? '📚 Yeni Eğitim Serisi Yayında: İleri Seviye SaaS Mimarisi' : '📚 New Series: Advanced SaaS Architecture', 
      content: lang === 'tr' ? 'Sektörün önde gelen eğitmenleriyle hazırladığımız 20 saatlik "İleri Seviye SaaS Mimarisi" eğitimimiz platforma eklendi.' : 'Our 20-hour "Advanced SaaS Architecture" training, prepared with leading instructors, has been added to the platform.',
      category: lang === 'tr' ? 'Yeni İçerik' : 'New Content',
      likes: 521,
      time: lang === 'tr' ? '1 gün önce' : '1 day ago'
    }
  ];

  const activeTags = lang === 'tr' 
    ? ['#kampanya', '#yenieğitim', '#güncelleme', '#duyuru']
    : ['#campaign', '#newcourse', '#update', '#announcement'];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">{t('communityTitle')}</h1>
          <p className="text-gray-400 mt-1">{t('communityDesc')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          
          <div className="glass-card p-2 flex items-center">
            <div className="pl-4 pr-2 text-gray-500">
              <Search className="h-5 w-5" />
            </div>
            <input 
              type="text" 
              placeholder={lang === 'tr' ? 'Toplulukta ara...' : 'Search in community...'} 
              className="w-full bg-transparent border-none text-white focus:ring-0 placeholder-gray-500 text-sm font-bold"
            />
          </div>

          {announcements.map((post) => (
            <div key={post.id} className="glass-card p-6 group cursor-pointer hover:border-brand-500/30 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-xl border border-white/10" />
                  <div>
                    <h4 className="text-sm font-black text-white">{post.author}</h4>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">{post.time}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full text-[10px] font-black text-brand-400 uppercase tracking-widest">
                  {post.category}
                </span>
              </div>
              
              <h3 className="text-xl font-black text-white mb-2 group-hover:text-brand-400 transition-colors leading-tight">{post.title}</h3>
              <p className="text-gray-400 text-sm font-medium leading-relaxed opacity-80">{post.content}</p>
              
              <div className="flex items-center gap-6 pt-6 mt-4 border-t border-white/5">
                <button className="flex items-center gap-2 text-gray-500 hover:text-brand-400 transition-colors text-[10px] font-black uppercase tracking-widest">
                  <ThumbsUp className="h-4 w-4" /> {post.likes} {t('likes')}
                </button>
              </div>
            </div>
          ))}
          
          <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black text-brand-400 transition-all uppercase tracking-widest">
            {t('showMore')}
          </button>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-5">
            <h3 className="text-xs font-black text-white mb-4 flex items-center gap-2 uppercase tracking-widest">
              <TrendingUp className="h-4 w-4 text-brand-500" /> {lang === 'tr' ? 'Gündemdekiler' : 'Trending'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {activeTags.map((topic, i) => (
                <span key={i} className="px-3 py-1.5 bg-white/5 hover:bg-brand-500 text-gray-400 hover:text-white rounded-xl text-[10px] font-black cursor-pointer transition-all uppercase">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-xs font-black text-white mb-4 flex items-center gap-2 uppercase tracking-widest">
              <Users className="h-4 w-4 text-brand-500" /> {lang === 'tr' ? 'Destek' : 'Support'}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-white uppercase">{lang === 'tr' ? 'Yardım Merkezi' : 'Help Center'}</p>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">{lang === 'tr' ? 'Sıkça Sorulan Sorular' : 'FAQ'}</p>
                </div>
                <button className="text-[10px] font-black text-brand-400 hover:text-brand-300 uppercase tracking-widest">{lang === 'tr' ? 'Git' : 'Go'}</button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-white uppercase">{lang === 'tr' ? 'Canlı Destek' : 'Live Support'}</p>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">{lang === 'tr' ? '7/24 Aktif' : '24/7 Active'}</p>
                </div>
                <button className="text-[10px] font-black text-brand-400 hover:text-brand-300 uppercase tracking-widest">{lang === 'tr' ? 'Bağlan' : 'Connect'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
