'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { PlayCircle, BookOpen, Tag } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

interface Course {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  category: string;
  createdAt: string;
}

const categoryColors: Record<string, string> = {
  'Yazılım': 'text-yellow-400 bg-yellow-500/10',
  'Pazarlama': 'text-[#0ea5e9] bg-[#0ea5e9]/10',
  'Tasarım': 'text-[#06b6d4] bg-[#06b6d4]/10',
  'Kişisel Gelişim': 'text-emerald-400 bg-emerald-500/10',
};

export default function CoursesPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const { data, isLoading } = useQuery<{ data: Course[] }>({
    queryKey: ['courses'],
    queryFn: () => api.get('/courses').then(r => r.data),
  });

  const courses = data?.data ?? [];

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-black mb-1 text-[var(--text-primary)]">Kurslar</h1>
        <p className="text-[var(--text-secondary)]">Eğitim içeriklerini keşfet ve öğrenmeye başla.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-48 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl">
          <BookOpen size={56} className="mx-auto mb-4 opacity-20" />
          <h3 className="text-xl font-bold mb-2">Yakında Gelecek</h3>
          <p className="text-[var(--text-secondary)]">İlk kurslar çok yakında platformda!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => {
                if (!user?.isPremium) {
                  router.push('/dashboard/subscribe');
                } else {
                  alert('Video oynatıcı yükleniyor...');
                }
              }}
              className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden hover:border-[var(--accent-primary)]/30 hover:shadow-[0_0_20px_rgba(14,165,233,0.06)] transition-all group cursor-pointer"
            >
              <div className="h-36 bg-[var(--accent-primary)]/5 flex items-center justify-center group-hover:bg-[var(--accent-primary)]/10 transition-all">
                <PlayCircle size={44} className="text-[var(--accent-primary)]/40 group-hover:text-[var(--accent-primary)] transition-all group-hover:scale-110" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 ${categoryColors[course.category] || 'text-[var(--accent-primary)] bg-[var(--accent-primary)]/10'}`}>
                    <Tag size={10} />
                    {course.category}
                  </span>
                </div>
                <h3 className="font-bold text-base mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{course.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
