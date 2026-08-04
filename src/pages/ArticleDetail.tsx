import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Loader2, Newspaper } from 'lucide-react';
import { motion } from 'motion/react';
import { Article } from '../data/mockData';
import { getYouTubeEmbedUrl } from '../lib/youtube';

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    setNotFound(false);
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/articles/${slug}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
          cache: 'no-store',
        });
        if (res.ok) {
          setArticle(await res.json());
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Failed to fetch article:', error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <Loader2 className="animate-spin text-primary-500" size={48} />
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 pb-20 text-center px-4">
        <Newspaper size={48} className="text-gray-300 mb-4" />
        <h1 className="text-2xl font-extrabold text-dark mb-2">ไม่พบบทความนี้</h1>
        <Link to="/articles" className="text-primary-600 font-bold hover:underline">
          กลับไปหน้าบทความทั้งหมด
        </Link>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(article.videoUrl);
  const paragraphs = (article.content || '').split(/\n{2,}/).map(p => p.trim()).filter(Boolean);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center text-sm text-gray-400 space-x-2 mb-6">
          <Link to="/" className="hover:text-primary-500 transition-colors">หน้าแรก</Link>
          <ChevronRight size={14} />
          <Link to="/articles" className="hover:text-primary-500 transition-colors">บทความ</Link>
          <ChevronRight size={14} />
          <span className="text-primary-500 line-clamp-1">{article.title}</span>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-3xl md:text-5xl font-extrabold text-dark mb-4 leading-tight">{article.title}</h1>
          <p className="text-gray-400 font-medium mb-8">
            {new Date(article.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        {article.coverImage && (
          <div className="aspect-video rounded-3xl overflow-hidden shadow-xl mb-10 bg-gray-50">
            <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        {embedUrl && (
          <div className="aspect-video rounded-3xl overflow-hidden shadow-xl mb-10 border border-gray-100">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={article.title}
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none space-y-5">
          {paragraphs.length > 0 ? (
            paragraphs.map((p, i) => (
              <p key={i} className="text-gray-700 leading-relaxed whitespace-pre-line">{p}</p>
            ))
          ) : (
            <p className="text-gray-400 italic">ยังไม่มีเนื้อหา</p>
          )}
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100">
          <Link to="/articles" className="text-primary-600 font-bold hover:underline">
            ← กลับไปหน้าบทความทั้งหมด
          </Link>
        </div>
      </div>
    </div>
  );
}
