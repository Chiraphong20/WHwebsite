import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IS_PREVIEW_FRAME, allowedAdminOrigins, setDraft } from '../lib/previewDraft';

// ทำงานเฉพาะเมื่อหน้าเว็บถูกฝังใน iframe ของหน้าแอดมิน (?sj-preview=1)
// - รับร่างเนื้อหา/คำสั่งเปลี่ยนหน้า จาก origin ของแอดมินเท่านั้น
// - คลิกส่วนที่มี data-edit="<key>:<path>" แล้วบอกแอดมินให้ไปแก้ที่ฟอร์มนั้น (ไม่เปลี่ยนหน้า)
export default function PreviewBridge() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!IS_PREVIEW_FRAME) return;
    const origins = allowedAdminOrigins();
    const post = (msg: unknown) => origins.forEach(o => window.parent.postMessage(msg, o));
    document.body.classList.add('sj-preview');

    const onMessage = (e: MessageEvent) => {
      if (!origins.includes(e.origin) || e.source !== window.parent) return;
      const d = e.data;
      if (!d || typeof d !== 'object') return;
      if (d.type === 'sj-preview' && typeof d.key === 'string' && d.value && typeof d.value === 'object') setDraft(d.key, d.value);
      else if (d.type === 'sj-goto' && typeof d.path === 'string' && d.path.startsWith('/') && !d.path.startsWith('//')) navigate(d.path);
    };
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.('[data-edit]');
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      const [key, ...rest] = String(el.getAttribute('data-edit')).split(':');
      post({ type: 'sj-focus', key, path: rest.join(':') });
    };

    window.addEventListener('message', onMessage);
    document.addEventListener('click', onClick, true);
    post({ type: 'sj-ready' });
    return () => {
      window.removeEventListener('message', onMessage);
      document.removeEventListener('click', onClick, true);
      document.body.classList.remove('sj-preview');
    };
  }, [navigate]);

  useEffect(() => {
    if (!IS_PREVIEW_FRAME) return;
    allowedAdminOrigins().forEach(o => window.parent.postMessage({ type: 'sj-path', path: location.pathname }, o));
  }, [location.pathname]);

  return null;
}
