import React, { useEffect, useRef, useState } from 'react';
import { EyeOff, Monitor, RotateCw, Smartphone } from 'lucide-react';

export const PREVIEW_PAGES: [string, string][] = [
  ['/', 'หน้าแรก'], ['/products', 'สินค้า'], ['/packages', 'แพ็กเกจ'], ['/how-to-order', 'วิธีสั่งซื้อ'],
  ['/about', 'เกี่ยวกับเรา'], ['/contact', 'ติดต่อเรา'], ['/articles', 'บทความ'],
];

// ช่องตัวอย่างหน้าเว็บ: ฝังหน้าเว็บจริงใน iframe แล้วย่อให้พอดีช่อง (เดสก์ท็อป 1280px / มือถือ 390px)
export default function PreviewPane({ siteUrl, frameRef, path, onGoto, onClose }: {
  siteUrl: string;
  frameRef: React.RefObject<HTMLIFrameElement>;
  path: string;
  onGoto: (path: string) => void;
  onClose: () => void;
}) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [size, setSize] = useState({ w: 600, h: 700 });
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const design = device === 'desktop' ? 1280 : 390;
  const scale = Math.min(1, size.w / design);
  const known = PREVIEW_PAGES.some(p => p[0] === path);

  return (
    <aside className="flex flex-col h-full bg-gray-200 rounded-2xl overflow-hidden border border-gray-200 shadow-sm" aria-label="ตัวอย่างหน้าเว็บ">
      <div className="flex items-center justify-between gap-2 flex-wrap px-3 py-2 bg-white border-b border-gray-200">
        <span className="text-sm font-extrabold text-dark">ตัวอย่างหน้าเว็บ</span>
        <select
          value={known ? path : ''}
          onChange={e => onGoto(e.target.value)}
          aria-label="เลือกหน้าที่จะดู"
          className="text-sm font-medium border border-gray-200 rounded-lg px-2 py-1 bg-white"
        >
          {!known && <option value="">{path}</option>}
          {PREVIEW_PAGES.map(([p, l]) => <option key={p} value={p}>{l}</option>)}
        </select>
        <div className="flex items-center gap-1">
          <button onClick={() => setDevice('desktop')} aria-label="มุมมองคอมพิวเตอร์" title="คอมพิวเตอร์"
            className={`p-1.5 rounded-lg border ${device === 'desktop' ? 'bg-dark text-white border-dark' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}><Monitor size={15} /></button>
          <button onClick={() => setDevice('mobile')} aria-label="มุมมองมือถือ" title="มือถือ"
            className={`p-1.5 rounded-lg border ${device === 'mobile' ? 'bg-dark text-white border-dark' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}><Smartphone size={15} /></button>
          <button onClick={() => { if (frameRef.current) frameRef.current.src = frameRef.current.src; }} aria-label="โหลดตัวอย่างใหม่" title="โหลดใหม่"
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"><RotateCw size={15} /></button>
          <button onClick={onClose} aria-label="ซ่อนตัวอย่าง" title="ซ่อนตัวอย่าง"
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"><EyeOff size={15} /></button>
        </div>
      </div>
      <p className="px-3 py-1.5 text-xs text-amber-800 bg-amber-50">
        คลิกส่วนใดของเว็บเพื่อไปแก้ที่ฟอร์มนั้น · สิ่งที่พิมพ์จะขึ้นในตัวอย่างทันที แต่จะแสดงจริงบนเว็บเมื่อกด “บันทึก”
      </p>
      <div ref={box} className="relative flex-1 overflow-hidden">
        <iframe
          ref={frameRef}
          title="ตัวอย่างหน้าเว็บ"
          src={`${siteUrl}/?sj-preview=1`}
          className="absolute top-0 border-0 bg-white shadow-lg origin-top-left"
          style={{
            width: design,
            height: size.h / scale,
            transform: `scale(${scale})`,
            left: device === 'mobile' ? Math.max(0, (size.w - design * scale) / 2) : 0,
          }}
        />
      </div>
    </aside>
  );
}
