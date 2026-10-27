"use client";

import React, { useEffect, useState } from 'react';
import { getNewsItems } from '@/lib/newsActions';
import { Calendar, Clock, X, ArrowLeft, BookOpen, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../lib/translations';

export default function NewsPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];

  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<any | null>(null);

  useEffect(() => {
    async function loadNews() {
      try {
        const data = await getNewsItems();
        setNews(data || []);
      } catch (err) {
        console.error("Failed to load news:", err);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-orange-900/20 to-black animate-gradient-slow"></div>
        <div className="relative z-10 animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 border-r-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white transition-colors duration-300 pb-20 relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-black via-orange-900/20 via-30% to-black animate-gradient-slow pointer-events-none"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-orange-500/5 via-transparent to-orange-500/5 animate-gradient-slow-reverse pointer-events-none"></div>

      <header className="max-w-7xl mx-auto px-6 pt-8 flex items-center justify-between relative z-10">
        {/* optional navigation */}
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-15 relative z-10">
        <div className="text-center md:text-left mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            {t.news.titlePrefix}{' '}
            <span className="text-orange-500">{t.news.titleHighlight}</span>
          </h1>
          <p className="text-gray-400 mt-3 max-w-xl text-sm font-medium">
            {t.news.subtitle}
          </p>
        </div>

        {news.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookOpen size={48} className="text-gray-700 mb-4" />
            <p className="text-gray-500 italic text-sm">{t.news.noNews}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <article
                key={item.id}
                onClick={() => setSelectedNews(item)}
                className="group cursor-pointer bg-[#1a1a1a]/90 backdrop-blur-sm border border-gray-800 hover:border-orange-500/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full relative"
              >
                <div className="relative h-52 w-full bg-gray-900 overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-600">
                      <BookOpen size={40} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                    <Calendar size={12} className="text-orange-500" />
                    <span>{new Date(item.created_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
                  </div>

                  <h2 className="text-xl font-black group-hover:text-orange-500 transition-colors duration-300 line-clamp-2 leading-snug">
                    {item.title}
                  </h2>

                  <p className="text-gray-400 text-xs font-medium leading-relaxed mt-3 line-clamp-3 flex-grow">
                    {item.content}
                  </p>

                  <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-orange-500 tracking-wider group-hover:translate-x-2 transition-all duration-300 flex items-center gap-1">
                      {t.news.readMore} <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    <div className="w-8 h-8 rounded-full bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors duration-300 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 group-hover:scale-150 transition-transform duration-300"></div>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/5 via-transparent to-orange-500/5"></div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedNews(null)}
          />

          <div className="relative w-full max-w-3xl bg-[#1a1a1a]/95 backdrop-blur-sm border border-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center px-8 py-6 border-b border-gray-800 shrink-0 bg-[#1a1a1a]/95">
              <div className="flex items-center gap-2 text-xs font-black text-orange-500 uppercase tracking-widest">
                <Clock size={14} />
                <span>
                  {t.news.postedOn}{' '}
                  {new Date(selectedNews.created_at).toLocaleDateString('en-US', { dateStyle: 'full' })}
                </span>
              </div>
              <button
                onClick={() => setSelectedNews(null)}
                className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors duration-300"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-8 space-y-6">
              {selectedNews.image_url && (
                <div className="w-full h-72 rounded-2xl overflow-hidden bg-gray-800 shrink-0">
                  <img
                    src={selectedNews.image_url}
                    alt={selectedNews.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h2 className="text-3xl font-black text-white leading-tight">
                {selectedNews.title}
              </h2>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                {selectedNews.content}
              </p>
            </div>

            <div className="px-8 py-5 border-t border-gray-800 bg-black/50 text-right shrink-0">
              <button
                onClick={() => setSelectedNews(null)}
                className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-600/20 transition-all duration-300 hover:scale-105"
              >
                {t.news.closePanel}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes gradientSlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes gradientSlowReverse {
          0% { background-position: 100% 50%; }
          50% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-gradient-slow {
          background-size: 400% 400%;
          animation: gradientSlow 20s ease-in-out infinite;
        }
        .animate-gradient-slow-reverse {
          background-size: 400% 400%;
          animation: gradientSlowReverse 25s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}