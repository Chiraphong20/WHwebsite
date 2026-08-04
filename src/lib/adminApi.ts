const TOKEN_KEY = 'admin_token';
const USER_KEY = 'admin_user';

export interface AdminUser {
  id: number;
  username: string;
  name: string;
  role: string;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AdminUser | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setSession(token: string, user: AdminUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export class AdminSessionExpiredError extends Error {}

// fetch wrapper สำหรับเรียก API ที่ต้องใช้สิทธิ์แอดมิน — แปะ Authorization header ให้อัตโนมัติ
// และเด้ง error พิเศษถ้า token หมดอายุ/ไม่ถูกต้อง (401) เพื่อให้หน้า Admin เด้งกลับไปหน้า login
export async function adminFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers = new Headers(options.headers);
  headers.set('ngrok-skip-browser-warning', 'true');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(path, { ...options, headers, cache: 'no-store' });

  if (res.status === 401) {
    clearSession();
    throw new AdminSessionExpiredError('เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่');
  }

  return res;
}
