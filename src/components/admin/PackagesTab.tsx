import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Save, Check, Plus, Trash2, Upload } from 'lucide-react';
import { Package } from '../../data/mockData';
import { adminFetch, AdminSessionExpiredError } from '../../lib/adminApi';
import { PackagesContent, DEFAULT_PACKAGES_CONTENT, fetchSiteContentMerged } from '../../lib/siteContent';

const CLOUD_NAME = 'dffqpiizc';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

function newPackage(): Package {
  return { id: crypto.randomUUID(), name: 'แพ็กเกจใหม่', price: '', description: '', items: [], image: '' };
}

async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  if (!UPLOAD_PRESET) throw new Error('ยังไม่ได้ตั้งค่า VITE_CLOUDINARY_UPLOAD_PRESET ใน .env');
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error('อัปโหลดรูปไม่สำเร็จ');
  const data = await res.json();
  return data.secure_url as string;
}

function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={2}
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

// การ์ดรูป+คำอธิบาย ที่เพิ่ม/ลบ/อัปโหลดรูปได้ — ใช้ทั้งกับส่วนอุปกรณ์และฟีเจอร์ POS
function ImageLabelListEditor({
  items, onChange, folder,
}: {
  items: { image: string; label: string }[];
  onChange: (items: { image: string; label: string }[]) => void;
  folder: string;
}) {
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const updateAt = (idx: number, patch: Partial<{ image: string; label: string }>) => {
    onChange(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };

  const handleFile = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIdx(idx);
    try {
      const url = await uploadToCloudinary(file, folder);
      updateAt(idx, { image: url });
    } catch {
      // เงียบไว้ — ผู้ใช้ลองใหม่ได้จากปุ่มเดิม
    } finally {
      setUploadingIdx(null);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((it, idx) => (
        <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
          <div className="w-full aspect-square rounded-lg bg-white border border-dashed border-gray-200 overflow-hidden flex items-center justify-center">
            {it.image ? <img src={it.image} alt={it.label} className="w-full h-full object-contain" /> : <span className="text-xs text-gray-300">ไม่มีรูป</span>}
          </div>
          <button
            onClick={() => fileRefs.current[idx]?.click()}
            disabled={uploadingIdx === idx}
            className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
          >
            {uploadingIdx === idx ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />} เปลี่ยนรูป
          </button>
          <input ref={el => { fileRefs.current[idx] = el; }} type="file" accept="image/*" onChange={e => handleFile(idx, e)} className="hidden" />
          <input
            type="text"
            value={it.label}
            onChange={e => updateAt(idx, { label: e.target.value })}
            placeholder="คำอธิบายรูป"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary-500 text-sm"
          />
          <button
            onClick={() => onChange(items.filter((_, i) => i !== idx))}
            className="w-full flex items-center justify-center gap-1 text-xs font-bold text-red-500 hover:text-red-600 py-1"
          >
            <Trash2 size={12} /> ลบ
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...items, { image: '', label: '' }])}
        className="p-3 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-primary-400 hover:text-primary-600 transition-colors min-h-[180px]"
      >
        <Plus size={20} />
        <span className="text-xs font-bold">เพิ่มรูป</span>
      </button>
    </div>
  );
}

// แกลเลอรีรูปล้วน (ไม่มีคำอธิบาย) — ใช้กับ galleryImages
function ImageListEditor({ images, onChange, folder }: { images: string[]; onChange: (images: string[]) => void; folder: string }) {
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const handleFile = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIdx(idx);
    try {
      const url = await uploadToCloudinary(file, folder);
      onChange(images.map((img, i) => (i === idx ? url : img)));
    } catch {
      // เงียบไว้ — ผู้ใช้ลองใหม่ได้จากปุ่มเดิม
    } finally {
      setUploadingIdx(null);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {images.map((img, idx) => (
        <div key={idx} className="relative group aspect-square rounded-xl bg-gray-50 border border-gray-100 overflow-hidden">
          {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">ไม่มีรูป</div>}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => fileRefs.current[idx]?.click()}
              disabled={uploadingIdx === idx}
              className="p-2 bg-white/90 rounded-full text-primary-600 hover:bg-white transition-colors"
              title="เปลี่ยนรูป"
            >
              {uploadingIdx === idx ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            </button>
            <button
              onClick={() => onChange(images.filter((_, i) => i !== idx))}
              className="p-2 bg-white/90 rounded-full text-red-500 hover:bg-white transition-colors"
              title="ลบรูป"
            >
              <Trash2 size={15} />
            </button>
          </div>
          <input ref={el => { fileRefs.current[idx] = el; }} type="file" accept="image/*" onChange={e => handleFile(idx, e)} className="hidden" />
        </div>
      ))}
      <button
        onClick={() => onChange([...images, ''])}
        className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-primary-400 hover:text-primary-600 transition-colors"
      >
        <Plus size={20} />
        <span className="text-xs font-bold">เพิ่มรูป</span>
      </button>
    </div>
  );
}

export default function PackagesTab({ onSessionExpired }: { onSessionExpired: () => void }) {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<PackagesContent>(DEFAULT_PACKAGES_CONTENT);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [uploadingPkgIdx, setUploadingPkgIdx] = useState<number | null>(null);
  const pkgFileRefs = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    fetchSiteContentMerged<PackagesContent>('packages_content', DEFAULT_PACKAGES_CONTENT)
      .then(setContent)
      .finally(() => setLoading(false));
  }, []);

  const updatePackage = (idx: number, patch: Partial<Package>) => {
    setContent(c => ({ ...c, packages: c.packages.map((p, i) => (i === idx ? { ...p, ...patch } : p)) }));
  };

  const addPackage = () => setContent(c => ({ ...c, packages: [...c.packages, newPackage()] }));

  const removePackage = (idx: number) => {
    if (!confirm('ลบแพ็กเกจนี้ใช่หรือไม่?')) return;
    setContent(c => ({ ...c, packages: c.packages.filter((_, i) => i !== idx) }));
  };

  const updateItem = (pkgIdx: number, itemIdx: number, value: string) => {
    setContent(c => ({ ...c, packages: c.packages.map((p, i) => i === pkgIdx ? { ...p, items: p.items.map((it, ii) => ii === itemIdx ? value : it) } : p) }));
  };

  const addItem = (pkgIdx: number) => {
    setContent(c => ({ ...c, packages: c.packages.map((p, i) => i === pkgIdx ? { ...p, items: [...p.items, ''] } : p) }));
  };

  const removeItem = (pkgIdx: number, itemIdx: number) => {
    setContent(c => ({ ...c, packages: c.packages.map((p, i) => i === pkgIdx ? { ...p, items: p.items.filter((_, ii) => ii !== itemIdx) } : p) }));
  };

  const handlePkgImageFile = async (pkgIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPkgIdx(pkgIdx);
    setError('');
    try {
      const url = await uploadToCloudinary(file, 'wh_packages');
      updatePackage(pkgIdx, { image: url });
    } catch (err: any) {
      setError(err.message || 'อัปโหลดรูปไม่สำเร็จ');
    } finally {
      setUploadingPkgIdx(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      const res = await adminFetch('/api/settings/packages_content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      } else {
        setError('บันทึกไม่สำเร็จ');
      }
    } catch (err) {
      if (err instanceof AdminSessionExpiredError) onSessionExpired();
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="animate-spin text-primary-500" size={48} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-500 text-sm">แสดงในหน้า /packages</p>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors ${
            saved ? 'bg-green-500 text-white' : 'bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-60'
          }`}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : <Save size={16} />}
          {saving ? 'กำลังบันทึก...' : saved ? 'บันทึกแล้ว' : 'บันทึกทั้งหมด'}
        </button>
      </div>

      {error && <p className="text-red-500 text-xs font-medium mb-4 bg-red-50 px-3 py-2 rounded-xl">{error}</p>}

      <div className="space-y-8">
        {/* หัวข้อหน้า */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-extrabold text-dark mb-4">หัวข้อหน้าแพ็กเกจ</h2>
          <div className="space-y-4">
            <Field label="หัวข้อใหญ่" value={content.heroTitle} onChange={v => setContent(c => ({ ...c, heroTitle: v }))} />
            <Field label="คำอธิบาย" value={content.heroSubtitle} onChange={v => setContent(c => ({ ...c, heroSubtitle: v }))} textarea />
          </div>
        </section>

        {/* จุดเด่น */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-dark">จุดเด่นแฟรนไชส์</h2>
            <button
              onClick={() => setContent(c => ({ ...c, featureHighlights: [...c.featureHighlights, { title: '', desc: '' }] }))}
              className="flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors"
            >
              <Plus size={14} /> เพิ่ม
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.featureHighlights.map((f, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 space-y-2">
                    <Field label="หัวข้อ" value={f.title} onChange={v => setContent(c => ({ ...c, featureHighlights: c.featureHighlights.map((x, xi) => xi === i ? { ...x, title: v } : x) }))} />
                    <Field label="คำอธิบาย" value={f.desc} onChange={v => setContent(c => ({ ...c, featureHighlights: c.featureHighlights.map((x, xi) => xi === i ? { ...x, desc: v } : x) }))} />
                  </div>
                  <button
                    onClick={() => setContent(c => ({ ...c, featureHighlights: c.featureHighlights.filter((_, xi) => xi !== i) }))}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* หัวข้อรายการแพ็กเกจ + แพ็กเกจ */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-dark">แพ็กเกจ (SALES PACKAGE)</h2>
            <button
              onClick={addPackage}
              className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
            >
              <Plus size={15} /> เพิ่มแพ็กเกจ
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Field label="หัวข้อ" value={content.salesPackageTitle} onChange={v => setContent(c => ({ ...c, salesPackageTitle: v }))} />
            <Field label="คำอธิบาย" value={content.salesPackageSubtitle} onChange={v => setContent(c => ({ ...c, salesPackageSubtitle: v }))} />
          </div>

          <div className="space-y-6">
            {content.packages.map((pkg, idx) => (
              <div key={pkg.id} className="border border-gray-100 rounded-2xl p-6">
                <div className="flex items-start gap-6">
                  <div className="w-32 shrink-0 space-y-2">
                    <div className="w-32 h-32 rounded-xl bg-gray-50 border border-dashed border-gray-200 overflow-hidden flex items-center justify-center">
                      {pkg.image ? <img src={pkg.image} alt={pkg.name} className="w-full h-full object-contain" /> : <span className="text-xs text-gray-300">ไม่มีรูป</span>}
                    </div>
                    <button
                      onClick={() => pkgFileRefs.current[idx]?.click()}
                      disabled={uploadingPkgIdx === idx}
                      className="w-full flex items-center justify-center gap-1.5 px-2 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
                    >
                      {uploadingPkgIdx === idx ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                      เปลี่ยนรูป
                    </button>
                    <input
                      ref={el => { pkgFileRefs.current[idx] = el; }}
                      type="file"
                      accept="image/*"
                      onChange={e => handlePkgImageFile(idx, e)}
                      className="hidden"
                    />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Field label="ชื่อแพ็กเกจ" value={pkg.name} onChange={v => updatePackage(idx, { name: v })} />
                      <Field label="ราคา" value={pkg.price} onChange={v => updatePackage(idx, { price: v })} />
                    </div>
                    <Field label="คำอธิบายสั้นๆ" value={pkg.description} onChange={v => updatePackage(idx, { description: v })} textarea />

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">รายการที่ได้รับ</span>
                        <button onClick={() => addItem(idx)} className="flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors">
                          <Plus size={13} /> เพิ่มรายการ
                        </button>
                      </div>
                      <div className="space-y-2">
                        {pkg.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={e => updateItem(idx, itemIdx, e.target.value)}
                              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 text-sm"
                            />
                            <button onClick={() => removeItem(idx, itemIdx)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors shrink-0">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ))}
                        {pkg.items.length === 0 && <p className="text-xs text-gray-400 italic">ยังไม่มีรายการ</p>}
                      </div>
                    </div>
                  </div>

                  <button onClick={() => removePackage(idx)} className="p-2 text-gray-400 hover:text-red-500 transition-colors shrink-0" title="ลบแพ็กเกจนี้">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* อุปกรณ์ตกแต่งร้าน */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-extrabold text-dark mb-4">อุปกรณ์ตกแต่งร้าน</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Field label="หัวข้อ" value={content.equipmentTitle} onChange={v => setContent(c => ({ ...c, equipmentTitle: v }))} />
            <Field label="คำอธิบาย" value={content.equipmentSubtitle} onChange={v => setContent(c => ({ ...c, equipmentSubtitle: v }))} />
          </div>
          <ImageLabelListEditor
            items={content.equipment}
            onChange={equipment => setContent(c => ({ ...c, equipment }))}
            folder="wh_packages_equipment"
          />
        </section>

        {/* ฟีเจอร์ POS */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-extrabold text-dark mb-4">ฟีเจอร์ GROW STORE POS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Field label="หัวข้อ" value={content.posFeaturesTitle} onChange={v => setContent(c => ({ ...c, posFeaturesTitle: v }))} />
            <Field label="คำอธิบาย" value={content.posFeaturesSubtitle} onChange={v => setContent(c => ({ ...c, posFeaturesSubtitle: v }))} />
          </div>
          <ImageLabelListEditor
            items={content.posFeatures}
            onChange={posFeatures => setContent(c => ({ ...c, posFeatures }))}
            folder="wh_packages_pos"
          />
        </section>

        {/* แกลเลอรี */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-extrabold text-dark mb-4">แกลเลอรีภาพกิจกรรม</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Field label="หัวข้อ" value={content.galleryTitle} onChange={v => setContent(c => ({ ...c, galleryTitle: v }))} />
            <Field label="คำอธิบาย" value={content.gallerySubtitle} onChange={v => setContent(c => ({ ...c, gallerySubtitle: v }))} />
          </div>
          <ImageListEditor
            images={content.galleryImages}
            onChange={galleryImages => setContent(c => ({ ...c, galleryImages }))}
            folder="wh_packages_gallery"
          />
        </section>
      </div>
    </div>
  );
}
