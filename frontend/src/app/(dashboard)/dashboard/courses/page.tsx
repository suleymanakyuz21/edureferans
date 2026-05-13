'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { PlayCircle, BookOpen, Tag } from 'lucide-react';
import api from '@/lib/api';

interface Course {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  category: string;
  createdAt: string;
}

const categoryColors: Record<string, string> = {
  'Yazılım': 'text-yellow-500 bg-yellow-500/10',
  'Pazarlama': 'text-blue-500 bg-blue-500/10',
  'Tasarım': 'text-purple-500 bg-purple-500/10',
  'Kişisel Gelişim': 'text-green-500 bg-green-500/10',
};

export default function CoursesPage() {
  const { data, isLoading } = useQuery<{ data: Course[] }>({
    queryKey: ['courses'],
    queryFn: () => api.get('/courses').then(r => r.data),
  });

  const courses = data?.data ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black mb-2">Kurslar</h1>
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
              className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl overflow-hidden hover:border-indigo-500/30 transition-all group cursor-pointer"
            >
              <div className="h-36 bg-indigo-500/5 flex items-center justify-center group-hover:bg-indigo-500/10 transition-all">
                <PlayCircle size={48} className="text-indigo-500/50 group-hover:text-indigo-500 transition-all group-hover:scale-110" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1 ${categoryColors[course.category] || 'text-indigo-500 bg-indigo-500/10'}`}>
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
