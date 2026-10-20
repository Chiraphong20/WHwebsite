// ตัวอย่างหน้าเว็บ (Preview) ในหน้า Admin — แกนกลางที่ใช้ร่วมกันทั้งฝั่งหน้าเว็บและฝั่งแอดมิน
//
// วิธีทำงาน: หน้า Admin ฝังหน้าเว็บจริงไว้ใน iframe (?sj-preview=1) แล้วส่ง "ร่าง" ของเนื้อหาที่กำลังพิมพ์ไปให้ (postMessage)
// หน้าเว็บเก็บร่างไว้ใน draft store ด้านล่าง ทำให้ useSiteContent() คืนค่าร่างแทนค่าที่บันทึกไว้ — เห็นผลทันทีโดยยังไม่บันทึกจริง
// และเมื่อคลิกส่วนที่มี data-edit="<key>:<path>" หน้าเว็บจะบอกแอดมินให้เปิดฟอร์มของส่วนนั้น

import { useSyncExternalStore } from 'react';

const drafts = new Map<string, unknown>();
const listeners = new Set<() => void>();

export function setDraft(key: string, value: unknown) {
  drafts.set(key, value);
  listeners.forEach(l => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => { listeners.delete(l); };
}

// คืนค่าร่างของ key นั้น (undefined ถ้าไม่มีร่าง) — เปลี่ยนค่าเฉพาะตอนมีการ setDraft จึงเสถียรสำหรับ React
export function useDraft<T>(key: string): T | undefined {
  return useSyncExternalStore(subscribe, () => drafts.get(key) as T | undefined, () => undefined);
}

// อยู่ใน iframe ของหน้าแอดมินและเปิดด้วย ?sj-preview=1 หรือไม่ (อ่านครั้งเดียวตอนโหลด เพราะ query หายเมื่อเปลี่ยนหน้าใน SPA)
export const IS_PREVIEW_FRAME =
  typeof window !== 'undefined' &&
  window.parent !== window &&
  new URLSearchParams(window.location.search).has('sj-preview');

const isLocalHost = (h: string) => h === 'localhost' || /^\d{1,3}(\.\d{1,3}){3}$/.test(h);

// origin ของหน้าแอดมินที่ "หน้าเว็บ" ยอมรับข้อความด้วย — admin.<โดเมนหลัก> (ตัด www. ออก) และ VITE_ADMIN_ORIGIN (คั่นด้วยจุลภาค)
// ตอนพัฒนาในเครื่อง (localhost) แอดมินอยู่ origin เดียวกับหน้าเว็บ
export function allowedAdminOrigins(loc: Location = window.location): string[] {
  const list = ((import.meta.env.VITE_ADMIN_ORIGIN as string | undefined) ?? '').split(',').map(s => s.trim()).filter(Boolean);
  if (isLocalHost(loc.hostname)) list.push(loc.origin);
  else list.push(`${loc.protocol}//admin.${loc.hostname.replace(/^www\./, '')}`);
  return list;
}

// ที่อยู่หน้าเว็บที่หน้าแอดมินจะฝังเป็นตัวอย่าง — จาก admin.wonghiran.com → https://wonghiran.com, ในเครื่อง → origin เดียวกัน
export function previewSiteUrl(loc: Location = window.location): string {
  const fromEnv = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  if (loc.hostname.startsWith('admin.')) return `${loc.protocol}//${loc.hostname.slice('admin.'.length)}`;
  return loc.origin;
}
