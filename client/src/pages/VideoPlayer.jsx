import { motion } from 'framer-motion';
import { Play, Pause, Volume2, Maximize, Settings, CheckCircle2, Circle, MessageSquare, StickyNote, Download, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const curriculum = [
  { 
    title: 'Modül 1: Temeller', 
    lessons: [
      { id: 1, title: 'Hoş Geldiniz', duration: '05:30', completed: true },
      { id: 2, title: 'Kurulum ve Ayarlar', duration: '12:45', completed: true },
      { id: 3, title: 'Proje Yapısı', duration: '18:20', completed: false, active: true },
    ]
  },
  { 
    title: 'Modül 2: İleri Seviye Konseptler', 
    lessons: [
      { id: 4, title: 'State Yönetimi', duration: '25:10', completed: false },
      { id: 5, title: 'Performance Optimizasyonu', duration: '32:15', completed: false },
    ]
  }
];

export default function VideoPlayer() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/courses')} className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
        <ChevronLeft className="h-4 w-4 mr-1" /> Eğitime Dön
      </button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Player Area */}
        <div className="lg:w-2/3 xl:w-3/4 space-y-6">
          <div className="glass-card overflow-hidden">
            {/* Mock Player */}
            <div className="relative aspect-video bg-black flex flex-col group">
              <img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop" alt="Video thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Center Play Button */}
              <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-brand-500/90 rounded-full flex items-center justify-center text-white backdrop-blur-md hover:scale-110 hover:bg-brand-500 transition-all z-10 shadow-[0_0_30px_rgba(99,102,241,0.5)]">
                <Play className="h-8 w-8 fill-current ml-1" />
              </button>

              {/* Controls */}
              <div className="mt-auto p-4 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                <div className="w-full h-1.5 bg-white/30 rounded-full mb-4 cursor-pointer relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-brand-500 rounded-full"></div>
                  <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform"></div>
                </div>
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <button className="hover:text-brand-400 transition-colors"><Pause className="h-5 w-5 fill-current" /></button>
                    <div className="flex items-center gap-2 group/vol">
                      <Volume2 className="h-5 w-5" />
                      <div className="w-0 overflow-hidden group-hover/vol:w-16 transition-all duration-300">
                        <div className="w-16 h-1.5 bg-white/30 rounded-full ml-1">
                          <div className="w-1/2 h-full bg-brand-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-medium">06:24 / 18:20</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="hover:text-brand-400 transition-colors"><Settings className="h-5 w-5" /></button>
                    <button className="hover:text-brand-400 transition-colors"><Maximize className="h-5 w-5" /></button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">Proje Yapısı ve Kurulum</h1>
                  <p className="text-gray-400">Modül 1: Temeller • Bölüm 3</p>
                </div>
                <button className="bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Tamamlandı İşaretle
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="glass-card">
            <div className="flex border-b border-white/10">
              <button className="px-6 py-4 text-sm font-medium text-brand-400 border-b-2 border-brand-500 bg-white/5">İçerik Detayı</button>
              <button className="px-6 py-4 text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2"><StickyNote className="h-4 w-4" /> Notlarım</button>
              <button className="px-6 py-4 text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Tartışma (24)</button>
              <button className="px-6 py-4 text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2 ml-auto"><Download className="h-4 w-4" /> Kaynaklar</button>
            </div>
            <div className="p-6 text-gray-300 leading-relaxed text-sm">
              <p className="mb-4">Bu bölümde, modern bir React projesinin klasör yapısını nasıl kurgulayacağımızı detaylıca inceliyoruz. Özellikle büyük ölçekli SaaS uygulamalarında state yönetimi, component hiyerarşisi ve utils klasörlerinin organizasyonu hayati önem taşır.</p>
              <p>Öğrenecekleriniz:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-400">
                <li>Feature-based folder structure</li>
                <li>Absolute imports ayarları</li>
                <li>ESLint ve Prettier konfigürasyonları</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar Curriculum */}
        <div className="lg:w-1/3 xl:w-1/4">
          <div className="glass-card h-full flex flex-col max-h-[800px] sticky top-24">
            <div className="p-5 border-b border-white/10">
              <h3 className="font-bold text-white">Müfredat</h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 w-2/5 rounded-full"></div>
                </div>
                <span className="text-xs text-brand-400 font-medium">40%</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
              {curriculum.map((module, mIdx) => (
                <div key={mIdx}>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">{module.title}</h4>
                  <div className="space-y-1">
                    {module.lessons.map((lesson) => (
                      <button 
                        key={lesson.id}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left ${
                          lesson.active 
                            ? 'bg-brand-500/10 border border-brand-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                            : 'hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {lesson.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : lesson.active ? (
                            <Play className="h-5 w-5 text-brand-500 fill-current" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium line-clamp-2 ${lesson.active ? 'text-brand-400' : 'text-gray-300'}`}>
                            {lesson.id}. {lesson.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{lesson.duration}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
