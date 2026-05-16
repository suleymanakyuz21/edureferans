'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, PlayCircle, Edit, Trash2 } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export default function AdminCoursesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Beginner',
    instructor: '',
    duration: '',
    provider: 'Vimeo',
    videoUrl: ''
  });

  const { data: courses, refetch } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: () => api.get('/content/courses').then(res => res.data.data),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.createCourse(formData);
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error creating course', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Kurs Yönetimi</h2>
          <p className="text-sm text-slate-400 mt-1">Platformdaki eğitim içeriklerini ve videoları yönetin.</p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] w-full md:w-auto"
        >
          <Plus size={18} />
          <span>Yeni Kurs Ekle</span>
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses?.map((course: any, i: number) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group rounded-2xl bg-[#0F172A]/80 border border-[#1E293B] overflow-hidden hover:border-cyan-500/30 transition-all flex flex-col"
          >
            <div className="h-40 bg-slate-800 relative flex items-center justify-center">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <PlayCircle size={48} className="text-slate-600 group-hover:text-cyan-500/50 transition-colors" />
              )}
              <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white border border-white/10 uppercase tracking-wider">
                {course.provider}
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                  {course.category}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                  {course.level || 'Tüm Seviyeler'}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2 leading-tight">{course.title}</h3>
              <p className="text-sm text-slate-400 line-clamp-2 mb-4">{course.description}</p>
              
              <div className="mt-auto pt-4 border-t border-[#1E293B] flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Eğitmen: <span className="text-slate-300 font-medium">{course.instructor || 'EduReferans'}</span>
                </div>
                <div className="flex gap-2">
                  <button className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors"><Edit size={16} /></button>
                  <button className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0B0F19] border border-[#1E293B] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-[#0B0F19] border-b border-[#1E293B] px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-lg font-bold text-white">Yeni Kurs (Video) Ekle</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kurs Adı</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 bg-[#0F172A] border border-[#1E293B] rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori</label>
                  <input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2.5 bg-[#0F172A] border border-[#1E293B] rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Açıklama</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full px-4 py-2.5 bg-[#0F172A] border border-[#1E293B] rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Video Sağlayıcı</label>
                  <select value={formData.provider} onChange={e => setFormData({...formData, provider: e.target.value})} className="w-full px-4 py-2.5 bg-[#0F172A] border border-[#1E293B] rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none appearance-none">
                    <option>Vimeo</option>
                    <option>Mux</option>
                    <option>Cloudflare Stream</option>
                    <option>YouTube</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Video URL veya ID</label>
                  <input required value={formData.videoUrl} onChange={e => setFormData({...formData, videoUrl: e.target.value})} placeholder="Örn: https://player.vimeo.com/video/123456" className="w-full px-4 py-2.5 bg-[#0F172A] border border-[#1E293B] rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1E293B]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white transition-colors">İptal</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]">Kursu Yayına Al</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
