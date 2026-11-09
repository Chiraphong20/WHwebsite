import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Save, Check, Plus, Trash2, Upload, ArrowUp, ArrowDown } from 'lucide-react';
import { adminFetch, AdminSessionExpiredError } from '../../lib/adminApi';
import {
  HomeContent, HeroSlide, StripImage, BestSellerItem, BestSellersConfig, AboutContent, ContactContent,
  DEFAULT_HOME_CONTENT, DEFAULT_ABOUT_CONTENT, DEFAULT_CONTACT_CONTENT,
  fetchSiteContentMerged,
} from '../../lib/siteContent';
import { getFacebookEmbedUrl } from '../../lib/facebook';
import { usePushDraft } from './PreviewContext';
import { uploadToCloudinary } from '../../lib/cloudinary';

type SectionKey = 'home_content' | 'about_content' | 'contact_content';

function Field({ label, value, onChange, textarea, path }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; path?: string }) {
  return (
    <label className="block" data-path={path}>
      <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={3}
          className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 font-medium text-sm"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 font-medium text-sm"
        />
      )}
    </label>
  );
}

// สไลด์เดียวของแบนเนอร์: เปลี่ยนรูป (อัปโหลดหรือวางลิงก์) · คำอธิบายรูป · ลิงก์เมื่อคลิก
function HeroSlideEditor({ index, total, value, onChange, onMove, onRemove, allowEmpty }: {
  allowEmpty?: boolean; index: number; total: number; value: HeroSlide;
  onChange: (v: HeroSlide) => void; onMove: (dir: -1 | 1) => void; onRemove: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      onChange({ ...value, image: await uploadToCloudinary(file, 'wh_hero') });
    } catch (err: any) {
      setError(err.message || 'อัปโหลดรูปไม่สำเร็จ');
    } finally {
      setUploading(false);
      if (input.current) input.current.value = '';
    }
  };
  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-dark">รูปที่ {index + 1}</p>
        <div className="flex items-center gap-1">
          <button onClick={() => onMove(-1)} disabled={index === 0} title="เลื่อนขึ้น" className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 disabled:opacity-30"><ArrowUp size={16} /></button>
          <button onClick={() => onMove(1)} disabled={index === total - 1} title="เลื่อนลง" className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 disabled:opacity-30"><ArrowDown size={16} /></button>
          <button onClick={onRemove} disabled={total === 1 && !allowEmpty} title="ลบรูปนี้" className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 disabled:opacity-30"><Trash2 size={16} /></button>
        </div>
      </div>
      <div className="rounded-xl overflow-hidden border border-dashed border-gray-200 bg-white">
        {value.image ? <img src={value.image} alt={value.alt} className="w-full max-h-56 object-contain" /> : <p className="p-8 text-center text-xs text-gray-300">ไม่มีรูป</p>}
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => input.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? 'กำลังอัปโหลด...' : 'เปลี่ยนรูป'}
        </button>
        <input ref={input} type="file" accept="image/*" onChange={onFile} className="hidden" />
      </div>
      {error && <p className="text-red-500 text-xs font-medium bg-red-50 px-3 py-2 rounded-xl">{error}</p>}
      <Field label="ลิงก์รูป (วางลิงก์เองได้)" value={value.image} onChange={v => onChange({ ...value, image: v })} />
      <Field label="คำอธิบายรูป (สำหรับผู้พิการทางสายตา/SEO)" value={value.alt} onChange={v => onChange({ ...value, alt: v })} />
      <Field label="ลิงก์เมื่อคลิก (เว้นว่าง = ไม่ลิงก์ไปไหน)" value={value.link} onChange={v => onChange({ ...value, link: v })} />
    </div>
  );
}

// แบนเนอร์ใหญ่บนสุดของหน้าแรก (Hero): ใส่ได้หลายรูป สไลด์อัตโนมัติทุก 5 วินาที
function HeroBannerEditor({ value, onChange }: { value: HeroSlide[]; onChange: (v: HeroSlide[]) => void }) {
  const update = (i: number, v: HeroSlide) => onChange(value.map((s, j) => (j === i ? v : s)));
  const move = (i: number, dir: -1 | 1) => {
    const next = [...value];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    onChange(next);
  };
  return (
    <div data-path="heroBanner" className="space-y-3">
      <div>
        <p className="text-sm font-bold text-dark">แบนเนอร์ใหญ่บนสุด (Hero)</p>
        <p className="text-xs text-gray-400 mt-1">ใส่ได้หลายรูป ถ้ามีมากกว่า 1 รูปจะสไลด์อัตโนมัติทุก 5 วินาที · แนะนำรูปแนวนอน กว้างประมาณ 1920px (อัตราส่วนใกล้เคียง 16:9) และควรใช้สัดส่วนเดียวกันทุกรูป ไฟล์ WebP/JPG ไม่ควรเกิน ~500KB</p>
      </div>
      {value.map((s, i) => (
        <HeroSlideEditor
          key={i} index={i} total={value.length} value={s}
          onChange={v => update(i, v)} onMove={d => move(i, d)}
          onRemove={() => onChange(value.filter((_, j) => j !== i))}
        />
      ))}
      <button
        onClick={() => onChange([...value, { image: '', alt: '', link: '' }])}
        className="flex items-center gap-1.5 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-xs font-bold text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
      >
        <Plus size={14} /> เพิ่มรูปแบนเนอร์
      </button>
    </div>
  );
}

// แถวรูปภาพใต้แถบสถิติ: 5 ภาพต่อแถว ถ้ามากกว่า 5 จะเลื่อนอัตโนมัติ
function ImageStripEditor({ value, onChange }: { value: StripImage[]; onChange: (v: StripImage[]) => void }) {
  const update = (i: number, v: StripImage) => onChange(value.map((s, j) => (j === i ? v : s)));
  const move = (i: number, dir: -1 | 1) => {
    const next = [...value];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    onChange(next);
  };
  return (
    <div data-path="imageStrip" className="space-y-3">
      <div>
        <p className="text-sm font-bold text-dark">แถวรูปภาพใต้แถบสถิติ</p>
        <p className="text-xs text-gray-400 mt-1">แสดง 5 ภาพต่อแถว (มือถือ 3 ภาพ) ถ้าใส่มากกว่า 5 ภาพจะเลื่อนอัตโนมัติ · แนะนำรูปสี่เหลี่ยมจัตุรัส · ไม่ใส่รูปเลย = ไม่แสดงส่วนนี้</p>
      </div>
      {value.map((s, i) => (
        <HeroSlideEditor
          key={i} index={i} total={value.length} value={s} allowEmpty
          onChange={v => update(i, v)} onMove={d => move(i, d)}
          onRemove={() => onChange(value.filter((_, j) => j !== i))}
        />
      ))}
      <button
        onClick={() => onChange([...value, { image: '', alt: '', link: '' }])}
        className="flex items-center gap-1.5 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-xs font-bold text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
      >
        <Plus size={14} /> เพิ่มรูป
      </button>
    </div>
  );
}

const PRODUCT_IMG_BASE = 'https://res.cloudinary.com/dffqpiizc/image/upload/q_auto,f_auto,w_800/';
type PickableProduct = BestSellerItem & { barcode: string };

// ส่วน "ขายดีที่สุด": ตั้งชื่อหัวข้อเอง + เลือกสินค้าเอง (ไม่เลือกสินค้าเลย = ใช้ยอดขายจริงอัตโนมัติ)
function BestSellersEditor({ value, onChange, onSessionExpired }: { value: BestSellersConfig; onChange: (v: BestSellersConfig) => void; onSessionExpired: () => void }) {
  const [all, setAll] = useState<PickableProduct[] | null>(null);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  const loadAll = async () => {
    if (all || loading) return;
    setLoading(true);
    try {
      const res = await adminFetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setAll(data.map((p: any): PickableProduct => ({
          id: String(p.id), name: p.name || '', category: p.category || '',
          image: p.imageId ? `${PRODUCT_IMG_BASE}${p.imageId}.jpg` : (p.image || 'https://placehold.co/400x400?text=No+Image'),
          wholesalePrice: Number(p.wholesalePrice) || 0, minWholesaleQty: Number(p.minWholesaleQty) || 1, unit: p.unit || 'ชิ้น',
          barcode: String(p.barcode || ''),
        })));
      }
    } catch (err) {
      if (err instanceof AdminSessionExpiredError) onSessionExpired();
    } finally {
      setLoading(false);
    }
  };

  const picked = new Set(value.products.map(p => p.id));
  const term = q.trim().toLowerCase();
  const results = (all ?? []).filter(p => term && !picked.has(p.id) && (p.name.toLowerCase().includes(term) || p.barcode.toLowerCase().includes(term))).slice(0, 12);
  const add = ({ barcode, ...item }: PickableProduct) => onChange({ ...value, products: [...value.products, item] });
  const move = (i: number, dir: -1 | 1) => {
    const next = [...value.products];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    onChange({ ...value, products: next });
  };

  return (
    <div data-path="bestSellers" className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
      <p className="text-sm font-bold text-dark">ส่วนสินค้าขายดี (หน้าแรก)</p>
      <Field label="หัวข้อ" value={value.title} onChange={v => onChange({ ...value, title: v })} />
      <Field label="คำอธิบายใต้หัวข้อ" value={value.subtitle} onChange={v => onChange({ ...value, subtitle: v })} />

      <div>
        <p className="text-xs font-bold text-gray-500 mb-2">สินค้าที่เลือก ({value.products.length}) — ไม่เลือกเลย = แสดงสินค้าขายดีอัตโนมัติจากยอดขายจริง</p>
        <div className="space-y-2">
          {value.products.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-2">
              <img src={p.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-dark truncate">{p.name}</p>
                <p className="text-xs text-gray-400">{p.category} · ราคาส่ง ฿{p.wholesalePrice.toLocaleString()}</p>
              </div>
              <button onClick={() => move(i, -1)} disabled={i === 0} title="เลื่อนขึ้น" className="p-1.5 text-gray-400 hover:text-primary-600 disabled:opacity-30"><ArrowUp size={16} /></button>
              <button onClick={() => move(i, 1)} disabled={i === value.products.length - 1} title="เลื่อนลง" className="p-1.5 text-gray-400 hover:text-primary-600 disabled:opacity-30"><ArrowDown size={16} /></button>
              <button onClick={() => onChange({ ...value, products: value.products.filter((_, j) => j !== i) })} title="เอาออก" className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <input
          value={q}
          onFocus={loadAll}
          onChange={e => { setQ(e.target.value); loadAll(); }}
          placeholder="พิมพ์ชื่อสินค้าหรือรหัสบาร์โค้ดเพื่อค้นหาและเพิ่ม..."
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 font-medium text-sm"
        />
        {loading && <Loader2 size={16} className="animate-spin absolute right-3 top-3 text-gray-400" />}
        {term && !loading && (
          <div className="mt-2 bg-white rounded-xl border border-gray-100 max-h-72 overflow-y-auto divide-y divide-gray-50">
            {results.length === 0 && <p className="p-3 text-xs text-gray-400">ไม่พบสินค้า</p>}
            {results.map(p => (
              <button key={p.id} onClick={() => add(p)} className="w-full flex items-center gap-3 p-2 text-left hover:bg-primary-50 transition-colors">
                <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0" />
                <span className="flex-1 min-w-0 text-sm font-medium text-dark truncate">{p.name}</span>
                <Plus size={16} className="text-primary-500 shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SaveButton({ saving, saved, onClick }: { saving: boolean; saved: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors ${
        saved ? 'bg-green-500 text-white' : 'bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-60'
      }`}
    >
      {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : <Save size={16} />}
      {saving ? 'กำลังบันทึก...' : saved ? 'บันทึกแล้ว' : 'บันทึก'}
    </button>
  );
}

export default function ContentTab({ onSessionExpired }: { onSessionExpired: () => void }) {
  const [loading, setLoading] = useState(true);
  const [home, setHome] = useState<HomeContent>(DEFAULT_HOME_CONTENT);
  const [about, setAbout] = useState<AboutContent>(DEFAULT_ABOUT_CONTENT);
  const [contact, setContact] = useState<ContactContent>(DEFAULT_CONTACT_CONTENT);
  const markHome = usePushDraft('home_content', home, !loading);
  const markAbout = usePushDraft('about_content', about, !loading);
  const markContact = usePushDraft('contact_content', contact, !loading);

  useEffect(() => {
    (async () => {
      const [h, a, c] = await Promise.all([
        fetchSiteContentMerged<HomeContent>('home_content', DEFAULT_HOME_CONTENT),
        fetchSiteContentMerged<AboutContent>('about_content', DEFAULT_ABOUT_CONTENT),
        fetchSiteContentMerged<ContactContent>('contact_content', DEFAULT_CONTACT_CONTENT),
      ]);
      setHome(h);
      setAbout(a);
      setContact(c);
      setLoading(false);
    })();
  }, []);

  const save = async (key: SectionKey, value: unknown, onDone: () => void) => {
    try {
      const res = await adminFetch(`/api/settings/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(value),
      });
      if (res.ok) onDone();
    } catch (err) {
      if (err instanceof AdminSessionExpiredError) onSessionExpired();
    }
  };

  const [savingHome, setSavingHome] = useState(false);
  const [savedHome, setSavedHome] = useState(false);
  const saveHome = async () => {
    setSavingHome(true); setSavedHome(false);
    await save('home_content', home, () => { markHome(home); setSavedHome(true); setTimeout(() => setSavedHome(false), 1500); });
    setSavingHome(false);
  };

  const [savingAbout, setSavingAbout] = useState(false);
  const [savedAbout, setSavedAbout] = useState(false);
  const saveAbout = async () => {
    setSavingAbout(true); setSavedAbout(false);
    await save('about_content', about, () => { markAbout(about); setSavedAbout(true); setTimeout(() => setSavedAbout(false), 1500); });
    setSavingAbout(false);
  };

  const [savingContact, setSavingContact] = useState(false);
  const [savedContact, setSavedContact] = useState(false);
  const saveContact = async () => {
    setSavingContact(true); setSavedContact(false);
    await save('contact_content', contact, () => { markContact(contact); setSavedContact(true); setTimeout(() => setSavedContact(false), 1500); });
    setSavingContact(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="animate-spin text-primary-500" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* หน้าแรก */}
      <section data-focus-key="home_content" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold text-dark">หน้าแรก — สถิติและจุดเด่น</h2>
          <SaveButton saving={savingHome} saved={savedHome} onClick={saveHome} />
        </div>

        <div className="space-y-6">
          <HeroBannerEditor value={home.heroBanners?.length ? home.heroBanners : [home.heroBanner]} onChange={heroBanners => setHome(h => ({ ...h, heroBanners }))} />

          <ImageStripEditor value={home.imageStrip ?? []} onChange={imageStrip => setHome(h => ({ ...h, imageStrip }))} />

          <div>
            <p className="text-sm font-bold text-dark mb-2">แถบสถิติ 3 อัน</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {home.stats.map((s, i) => (
                <div key={i} data-path={`stats.${i}`} className="p-4 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
                  <Field label="ตัวเลข" value={s.number} onChange={v => setHome(h => ({ ...h, stats: h.stats.map((x, xi) => xi === i ? { ...x, number: v } : x) }))} />
                  <Field label="หัวข้อ" value={s.label} onChange={v => setHome(h => ({ ...h, stats: h.stats.map((x, xi) => xi === i ? { ...x, label: v } : x) }))} />
                  <Field label="คำอธิบาย" value={s.desc} onChange={v => setHome(h => ({ ...h, stats: h.stats.map((x, xi) => xi === i ? { ...x, desc: v } : x) }))} />
                </div>
              ))}
            </div>
          </div>

          <Field path="highlightsTitle" label="หัวข้อจุดเด่น" value={home.highlightsTitle} onChange={v => setHome(h => ({ ...h, highlightsTitle: v }))} />
          <Field path="highlightsSubtitle" label="คำอธิบายจุดเด่น" value={home.highlightsSubtitle} onChange={v => setHome(h => ({ ...h, highlightsSubtitle: v }))} textarea />

          <div>
            <p className="text-sm font-bold text-dark mb-2">การ์ดจุดเด่น 3 อัน</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {home.highlights.map((s, i) => (
                <div key={i} data-path={`highlights.${i}`} className="p-4 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
                  <Field label="หัวข้อ" value={s.title} onChange={v => setHome(h => ({ ...h, highlights: h.highlights.map((x, xi) => xi === i ? { ...x, title: v } : x) }))} />
                  <Field label="คำอธิบาย" value={s.desc} onChange={v => setHome(h => ({ ...h, highlights: h.highlights.map((x, xi) => xi === i ? { ...x, desc: v } : x) }))} textarea />
                </div>
              ))}
            </div>
          </div>

          <BestSellersEditor
            value={home.bestSellers ?? { title: 'ขายดีที่สุด ⭐', subtitle: 'สินค้าที่มียอดขายสะสมสูงสุดตลอดกาล', products: [] }}
            onChange={bestSellers => setHome(h => ({ ...h, bestSellers }))}
            onSessionExpired={onSessionExpired}
          />

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-dark">คลิป Facebook Reels (ดูบรรยากาศร้านค้าจริง)</p>
              <button
                onClick={() => setHome(h => ({ ...h, reels: [...h.reels, ''] }))}
                className="flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors"
              >
                <Plus size={14} /> เพิ่มคลิป
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-3">วางลิงก์ Facebook Reel เช่น https://www.facebook.com/reel/xxxxxxx/</p>
            <div className="space-y-3">
              {home.reels.length === 0 && (
                <p className="text-sm text-gray-400 italic">ยังไม่มีคลิป — กด "เพิ่มคลิป" เพื่อเริ่ม</p>
              )}
              {home.reels.map((url, i) => {
                const preview = getFacebookEmbedUrl(url);
                return (
                  <div key={i} data-path={`reels.${i}`} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-3">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={url}
                        onChange={e => setHome(h => ({ ...h, reels: h.reels.map((x, xi) => xi === i ? e.target.value : x) }))}
                        placeholder="https://www.facebook.com/reel/..."
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 font-medium text-sm"
                      />
                      {url && !preview && (
                        <p className="text-xs text-amber-600">ลิงก์นี้ยังใช้งานไม่ได้ ตรวจสอบรูปแบบอีกครั้ง</p>
                      )}
                    </div>
                    <button
                      onClick={() => setHome(h => ({ ...h, reels: h.reels.filter((_, xi) => xi !== i) }))}
                      className="p-2.5 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* เกี่ยวกับเรา */}
      <section data-focus-key="about_content" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold text-dark">เกี่ยวกับเรา</h2>
          <SaveButton saving={savingAbout} saved={savedAbout} onClick={saveAbout} />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field path="heroTitleLine1" label="หัวข้อบรรทัดแรก" value={about.heroTitleLine1} onChange={v => setAbout(a => ({ ...a, heroTitleLine1: v }))} />
            <Field path="heroTitleHighlight" label="หัวข้อเน้นสี" value={about.heroTitleHighlight} onChange={v => setAbout(a => ({ ...a, heroTitleHighlight: v }))} />
          </div>
          <Field path="heroSubtitle" label="คำโปรย" value={about.heroSubtitle} onChange={v => setAbout(a => ({ ...a, heroSubtitle: v }))} textarea />
          <Field path="storyHeading" label="หัวข้อประวัติ" value={about.storyHeading} onChange={v => setAbout(a => ({ ...a, storyHeading: v }))} />
          <Field path="storyParagraph1" label="ย่อหน้าประวัติ 1" value={about.storyParagraph1} onChange={v => setAbout(a => ({ ...a, storyParagraph1: v }))} textarea />
          <Field path="storyParagraph2" label="ย่อหน้าประวัติ 2" value={about.storyParagraph2} onChange={v => setAbout(a => ({ ...a, storyParagraph2: v }))} textarea />

          <div>
            <p className="text-sm font-bold text-dark mb-2">สถิติ 4 อัน</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {about.stats.map((s, i) => (
                <div key={i} data-path={`stats.${i}`} className="p-4 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
                  <Field label="ตัวเลข" value={s.number} onChange={v => setAbout(a => ({ ...a, stats: a.stats.map((x, xi) => xi === i ? { ...x, number: v } : x) }))} />
                  <Field label="หัวข้อ" value={s.label} onChange={v => setAbout(a => ({ ...a, stats: a.stats.map((x, xi) => xi === i ? { ...x, label: v } : x) }))} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-dark mb-2">ค่านิยม 3 อัน</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {about.values.map((s, i) => (
                <div key={i} data-path={`values.${i}`} className="p-4 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
                  <Field label="หัวข้อ" value={s.title} onChange={v => setAbout(a => ({ ...a, values: a.values.map((x, xi) => xi === i ? { ...x, title: v } : x) }))} />
                  <Field label="คำอธิบาย" value={s.desc} onChange={v => setAbout(a => ({ ...a, values: a.values.map((x, xi) => xi === i ? { ...x, desc: v } : x) }))} textarea />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ติดต่อเรา */}
      <section data-focus-key="contact_content" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold text-dark">ข้อมูลติดต่อ</h2>
          <SaveButton saving={savingContact} saved={savedContact} onClick={saveContact} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field path="phone" label="เบอร์โทรศัพท์" value={contact.phone} onChange={v => setContact(c => ({ ...c, phone: v }))} />
          <Field path="email" label="อีเมล" value={contact.email} onChange={v => setContact(c => ({ ...c, email: v }))} />
          <Field path="facebookLink" label="ลิงก์ Facebook" value={contact.facebookLink} onChange={v => setContact(c => ({ ...c, facebookLink: v }))} />
          <Field path="facebookName" label="ชื่อเพจ Facebook" value={contact.facebookName} onChange={v => setContact(c => ({ ...c, facebookName: v }))} />
          <Field path="lineOaLink" label="ลิงก์ LINE OA" value={contact.lineOaLink} onChange={v => setContact(c => ({ ...c, lineOaLink: v }))} />
          <Field path="lineOaName" label="ชื่อ LINE OA" value={contact.lineOaName} onChange={v => setContact(c => ({ ...c, lineOaName: v }))} />
          <Field path="hoursLine1" label="เวลาเปิด-ปิด บรรทัด 1" value={contact.hoursLine1} onChange={v => setContact(c => ({ ...c, hoursLine1: v }))} />
          <Field path="hoursLine2" label="เวลาเปิด-ปิด บรรทัด 2" value={contact.hoursLine2} onChange={v => setContact(c => ({ ...c, hoursLine2: v }))} />
        </div>
        <div className="mt-4">
          <Field path="address" label="ที่อยู่" value={contact.address} onChange={v => setContact(c => ({ ...c, address: v }))} textarea />
        </div>
      </section>
    </div>
  );
}
