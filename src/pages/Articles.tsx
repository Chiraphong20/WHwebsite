import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Loader2, Newspaper, Youtube } from 'lucide-react';
import { motion } from 'motion/react';
import { Article } from '../data/mockData';

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch('/api/articles', {
          headers: { 'ngrok-skip-browser-warning': 'true' },
          cache: 'no-store',
        });
        if (res.ok) setArticles(await res.json());
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-white">
      <section className="relative overflow-hidden bg-dark text-white py-20 mb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-sm text-orange-300 space-x-2 mb-6">
            <span className="text-gray-400">หน้าแรก</span>
            <ChevronRight size={14} />
            <span className="font-medium">บทความ</span>
          </div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
              บทความ<span className="text-primary-400">และข่าวสาร</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-xl leading-relaxed">
              ความรู้ เคล็ดลับ และข่าวสารใหม่ๆ จากวงษ์หิรัญค้าส่ง
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="animate-spin text-primary-500" size={48} />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <Newspaper size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">ยังไม่มีบทความในขณะนี้</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <Link
                to={`/articles/${article.slug}`}
                key={article.id}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2"
              >
                <div className="aspect-video relative overflow-hidden bg-gray-50">
                  {article.coverImage ? (
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Newspaper size={40} />
                    </div>
                  )}
                  {article.videoUrl && (
                    <div className="absolute top-3 right-3 bg-red-500/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <Youtube size={13} /> วิดีโอ
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-xs text-gray-400 font-medium mb-2">
                    {new Date(article.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <h3 className="font-bold text-dark text-lg line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-gray-500 text-sm line-clamp-3 flex-1">{article.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
