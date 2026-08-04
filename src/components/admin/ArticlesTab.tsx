import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Plus, Pencil, Trash2, X, Upload, Youtube } from 'lucide-react';
import { Article } from '../../data/mockData';
import { adminFetch, AdminSessionExpiredError } from '../../lib/adminApi';
import { getYouTubeEmbedUrl } from '../../lib/youtube';

const CLOUD_NAME = 'dffqpiizc';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

const emptyForm = { title: '', slug: '', excerpt: '', content: '', coverImage: '', videoUrl: '', isPublished: true };

export default function ArticlesTab({ onSessionExpired }: { onSessionExpired: () => void }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Article | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/api/articles/admin/all');
      if (res.ok) setArticles(await res.json());
    } catch (err) {
      if (err instanceof AdminSessionExpiredError) onSessionExpired();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  };

  const openEdit = (a: Article) => {
    setEditing(a);
    setForm({
      title: a.title, slug: a.slug, excerpt: a.excerpt || '', content: a.content || '',
      coverImage: a.coverImage || '', videoUrl: a.videoUrl || '', isPublished: !!a.isPublished,
    });
    setError('');
    setShowForm(true);
  };

  const handleCoverFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!UPLOAD_PRESET) {
      setError('ยังไม่ได้ตั้งค่า VITE_CLOUDINARY_UPLOAD_PRESET ใน .env');
      return;
    }
    setUploadingCover(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', 'wh_articles');
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error('อัปโหลดรูปไม่สำเร็จ');
      const data = await res.json();
      setForm(f => ({ ...f, coverImage: data.secure_url }));
    } catch (err: any) {
      setError(err.message || 'อัปโหลดรูปไม่สำเร็จ');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) { setError('กรุณาระบุชื่อบทความ'); return; }
    setSaving(true);
    setError('');
    try {
      const path = editing ? `/api/articles/${editing.id}` : '/api/articles';
      const res = await adminFetch(path, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'บันทึกไม่สำเร็จ'); return; }
      setShowForm(false);
      load();
    } catch (err) {
      if (err instanceof AdminSessionExpiredError) onSessionExpired();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (a: Article) => {
    if (!confirm(`ลบบทความ "${a.title}" ใช่หรือไม่?`)) return;
    try {
      const res = await adminFetch(`/api/articles/${a.id}`, { method: 'DELETE' });
      if (res.ok) load();
    } catch (err) {
      if (err instanceof AdminSessionExpiredError) onSessionExpired();
    }
  };

  const embedPreview = getYouTubeEmbedUrl(form.videoUrl);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-500 text-sm">{articles.length} บทความ</p>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-xl font-bold text-sm hover:bg-primary-600 transition-colors"
        >
          <Plus size={16} /> เขียนบทความใหม่
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-32">
          <Loader2 className="animate-spin text-primary-500" size={48} />
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-24 text-gray-400">ยังไม่มีบทความ</div>
      ) : (
        <div className="space-y-3">
          {articles.map(a => (
            <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden shrink-0">
                {a.coverImage ? (
                  <img src={a.coverImage} alt={a.title} className="w-full h-full object-cover" />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-dark truncate">{a.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.isPublished ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {a.isPublished ? 'เผยแพร่แล้ว' : 'ฉบับร่าง'}
                  </span>
                  {a.videoUrl && <Youtube size={14} className="text-red-500" />}
                  <span className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleDateString('th-TH')}</span>
                </div>
              </div>
              <button onClick={() => openEdit(a)} className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                <Pencil size={18} />
              </button>
              <button onClick={() => handleDelete(a)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8" onClick={e => e.stopPropagation()}>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-dark">{editing ? 'แก้ไขบทความ' : 'เขียนบทความใหม่'}</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 p-1">
                  <X size={20} />
                </button>
              </div>

              {error && <p className="text-red-500 text-xs font-medium bg-red-50 px-3 py-2 rounded-xl">{error}</p>}

              <label className="block">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">ชื่อบทความ</span>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 font-medium text-sm"
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Slug (ปล่อยว่างให้สร้างจากชื่อบทความ)</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  placeholder="เช่น how-to-open-a-20-baht-shop"
                  className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 font-medium text-sm"
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">เกริ่นนำ (แสดงในหน้ารายการ)</span>
                <textarea
                  value={form.excerpt}
                  onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  rows={2}
                  className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 font-medium text-sm"
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">เนื้อหา</span>
                <textarea
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  rows={8}
                  placeholder="แต่ละย่อหน้าให้เว้นบรรทัดว่างคั่น"
                  className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 font-medium text-sm"
                />
              </label>

              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">รูปปก</span>
                <div className="mt-1.5 flex items-center gap-4">
                  <div className="w-24 h-24 rounded-xl bg-gray-50 border border-dashed border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {form.coverImage ? <img src={form.coverImage} alt="cover" className="w-full h-full object-cover" /> : <span className="text-xs text-gray-300">ไม่มีรูป</span>}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingCover}
                    className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
                  >
                    {uploadingCover ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                    {uploadingCover ? 'กำลังอัปโหลด...' : 'เลือกรูปปก'}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleCoverFile} className="hidden" />
                </div>
              </div>

              <label className="block">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">ลิงก์วิดีโอ YouTube (ไม่บังคับ)</span>
                <input
                  type="text"
                  value={form.videoUrl}
                  onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 font-medium text-sm"
                />
                {form.videoUrl && !embedPreview && (
                  <p className="text-xs text-amber-600 mt-1">ไม่สามารถอ่านลิงก์นี้เป็นวิดีโอ YouTube ได้</p>
                )}
                {embedPreview && (
                  <div className="mt-2 aspect-video rounded-xl overflow-hidden border border-gray-100">
                    <iframe src={embedPreview} className="w-full h-full" allowFullScreen title="ตัวอย่างวิดีโอ" />
                  </div>
                )}
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))}
                  className="w-4 h-4 accent-primary-500"
                />
                <span className="text-sm font-bold text-dark">เผยแพร่บทความนี้บนเว็บไซต์</span>
              </label>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3.5 rounded-2xl font-bold text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              >
                {saving && <Loader2 size={18} className="animate-spin" />}
                {editing ? 'บันทึกการแก้ไข' : 'สร้างบทความ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
