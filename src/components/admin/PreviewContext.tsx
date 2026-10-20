import { createContext, useContext, useEffect, useRef } from 'react';

// ตัวกลางระหว่างแท็บแก้ไข (ContentTab/PackagesTab) กับช่องตัวอย่างหน้าเว็บ
// แท็บส่ง "ร่าง" ที่กำลังพิมพ์ผ่าน pushDraft → Admin ส่งต่อให้หน้าเว็บใน iframe ทันที (ยังไม่บันทึกจริง)
interface PreviewCtx {
  pushDraft: (key: string, value: object) => void;
}

export const PreviewContext = createContext<PreviewCtx>({ pushDraft: () => {} });
export const usePreview = () => useContext(PreviewContext);

// ส่งร่างไปตัวอย่างทุกครั้งที่ค่าเปลี่ยนจากที่โหลดมา · ออกจากแท็บโดยไม่บันทึก → คืนตัวอย่างเป็นค่าที่บันทึกไว้
// คืนฟังก์ชัน markSaved(v) ให้เรียกหลังบันทึกสำเร็จ เพื่อให้ค่านั้นกลายเป็นค่าที่บันทึกไว้ล่าสุด
export function usePushDraft(key: string, value: object, ready: boolean) {
  const { pushDraft } = usePreview();
  const base = useRef<{ json: string; obj: object } | null>(null);
  const latest = useRef({ pushDraft, key });
  latest.current = { pushDraft, key };

  useEffect(() => {
    if (!ready) return;
    const json = JSON.stringify(value);
    if (!base.current) { base.current = { json, obj: JSON.parse(json) }; return; }
    if (json !== base.current.json) pushDraft(key, value);
  }, [value, ready, key, pushDraft]);

  useEffect(() => () => {
    const b = base.current;
    if (b) latest.current.pushDraft(latest.current.key, b.obj);
  }, []);

  return (v: object) => {
    const json = JSON.stringify(v);
    base.current = { json, obj: JSON.parse(json) };
  };
}
