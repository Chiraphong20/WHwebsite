import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, LogOut, ImageIcon, Package, Layers, FileText, Newspaper, MonitorPlay } from 'lucide-react';
import { getToken, getStoredUser, setSession, clearSession, AdminUser } from '../lib/adminApi';
import ProductsTab from '../components/admin/ProductsTab';
import ContentTab from '../components/admin/ContentTab';
import ArticlesTab from '../components/admin/ArticlesTab';
import PackagesTab from '../components/admin/PackagesTab';
import PreviewPane from '../components/admin/PreviewPane';
import { PreviewContext } from '../components/admin/PreviewContext';
import { previewSiteUrl } from '../lib/previewDraft';

type Tab = 'products' | 'content' | 'packages' | 'articles';

// คลิกส่วนใดของเว็บในตัวอย่าง → เปิดแท็บที่แก้เนื้อหาชุดนั้น
const TAB_OF_KEY: Record<string, Tab> = {
  home_content: 'content', about_content: 'content', contact_content: 'content', packages_content: 'packages',
};

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'products', label: 'สินค้า', icon: <Package size={16} /> },
  { key: 'content', label: 'เนื้อหาเว็บไซต์', icon: <FileText size={16} /> },
  { key: 'packages', label: 'แพ็กเกจ', icon: <Layers size={16} /> },
  { key: 'articles', label: 'บทความ', icon: <Newspaper size={16} /> },
];

export default function Admin() {
  // เปิดผ่าน admin.* จะไม่มี Navbar หน้าร้าน (ดู App.tsx) — แถบเมนูแอดมินชิดบนสุดได้เลย
  const bare = window.location.hostname.split('.')[0] === 'admin';
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getToken());
  const [user, setUser] = useState<AdminUser | null>(() => getStoredUser());
  const [activeTab, setActiveTab] = useState<Tab>('products');

  // ---- ตัวอย่างหน้าเว็บ (Preview) ----
  const siteUrl = previewSiteUrl();
  const siteOrigin = (() => { try { return new URL(siteUrl).origin; } catch { return ''; } })();
  const [showPreview, setShowPreview] = useState(() => window.innerWidth >= 1100);
  const [pvPath, setPvPath] = useState('/');
  const frameRef = useRef<HTMLIFrameElement>(null);
  const drafts = useRef(new Map<string, object>());
  const [focusReq, setFocusReq] = useState<{ key: string; path: string; tick: number } | null>(null);

  const toFrame = useCallback((msg: unknown) => {
    if (siteOrigin) frameRef.current?.contentWindow?.postMessage(msg, siteOrigin);
  }, [siteOrigin]);
  const pushDraft = useCallback((key: string, value: object) => {
    drafts.current.set(key, value);
    toFrame({ type: 'sj-preview', key, value: JSON.parse(JSON.stringify(value)) });
  }, [toFrame]);

  useEffect(() => {
    if (!siteOrigin) return;
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== siteOrigin || e.source !== frameRef.current?.contentWindow) return;
      const d = e.data;
      if (!d || typeof d !== 'object') return;
      if (d.type === 'sj-ready') drafts.current.forEach((v, k) => toFrame({ type: 'sj-preview', key: k, value: JSON.parse(JSON.stringify(v)) }));
      else if (d.type === 'sj-path' && typeof d.path === 'string') setPvPath(d.path);
      else if (d.type === 'sj-focus' && typeof d.key === 'string' && TAB_OF_KEY[d.key]) {
        setActiveTab(TAB_OF_KEY[d.key]);
        setFocusReq({ key: d.key, path: String(d.path || ''), tick: Date.now() });
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [siteOrigin, toFrame]);

  // เลื่อนไปยังฟอร์มของส่วนที่ถูกคลิก (รอจนแท็บโหลดเสร็จ) แล้วกะพริบกรอบเพื่อให้เห็น
  useEffect(() => {
    if (!focusReq) return;
    let tries = 0;
    const timer = window.setInterval(() => {
      tries += 1;
      const scope = document.querySelector(`[data-focus-key="${focusReq.key}"]`);
      const group = focusReq.path.split('.')[0];
      const el = scope?.querySelector(`[data-path="${focusReq.path}"]`) ?? scope?.querySelector(`[data-path="${group}"]`) ?? scope;
      if (el) {
        window.clearInterval(timer);
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-4', 'ring-primary-300', 'rounded-xl');
        window.setTimeout(() => el.classList.remove('ring-4', 'ring-primary-300'), 1800);
      } else if (tries > 30) window.clearInterval(timer);
    }, 100);
    return () => window.clearInterval(timer);
  }, [focusReq]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoggingIn(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'เข้าสู่ระบบไม่สำเร็จ');
        return;
      }
      setSession(data.token, data.user);
      setUser(data.user);
      setIsAuthenticated(true);
    } catch {
      setAuthError('เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ กรุณาลองใหม่');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleSessionExpired = () => {
    clearSession();
    setIsAuthenticated(false);
    setUser(null);
  };

  // --- Login screen ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-3">
              <ImageIcon size={32} className="text-primary-500" />
            </div>
            <h1 className="text-2xl font-extrabold text-dark">Admin Panel</h1>
            <p className="text-gray-500 text-sm mt-1">วงษ์หิรัญ ค้าส่ง</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="ชื่อผู้ใช้"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 font-medium"
              autoComplete="username"
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="รหัสผ่าน"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 pr-12 font-medium"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {authError && (
              <p className="text-red-500 text-sm font-medium">{authError}</p>
            )}
            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-colors disabled:opacity-60"
            >
              {loggingIn ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Admin dashboard ---
  return (
    <PreviewContext.Provider value={{ pushDraft }}>
    <div className={`min-h-screen bg-gray-50 pb-20 ${bare ? '' : 'pt-28'}`}>
      {/* แถบเมนูด้านบน: ชื่อ + แท็บ + ปุ่มด้านขวา (เดิมมีช่องว่างด้านบนเผื่อ Navbar ของหน้าร้าน ซึ่งหน้า admin.* ไม่มี) */}
      <header className={`sticky z-30 bg-white/95 backdrop-blur border-b border-gray-200 ${bare ? 'top-0' : 'top-24'}`}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4 sm:gap-6">
          <div className="shrink-0 leading-tight">
            <h1 className="text-lg font-extrabold text-dark">Admin Panel</h1>
            <p className="text-gray-500 text-xs hidden sm:block">
              {user ? `เข้าสู่ระบบเป็น ${user.name || user.username}` : 'วงษ์หิรัญ ค้าส่ง'}
            </p>
          </div>
          <nav className="flex-1 min-w-0 h-full flex items-stretch gap-1 overflow-x-auto" aria-label="เมนูแอดมิน">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                aria-current={activeTab === tab.key ? 'page' : undefined}
                className={`flex items-center gap-2 px-4 font-bold text-sm border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="shrink-0 flex items-center gap-3 sm:gap-4">
            {!showPreview && (
              <button
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors"
              >
                <MonitorPlay size={16} />
                <span className="hidden md:inline">แสดงตัวอย่างหน้าเว็บ</span>
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </header>

      <div className={`mx-auto px-4 sm:px-6 lg:px-8 pt-6 ${showPreview ? 'max-w-none flex gap-6 items-start' : 'max-w-7xl'}`}>
        <div className={showPreview ? 'flex-1 min-w-0' : ''}>

        {activeTab === 'products' && <ProductsTab onSessionExpired={handleSessionExpired} />}
        {activeTab === 'content' && <ContentTab onSessionExpired={handleSessionExpired} />}
        {activeTab === 'packages' && <PackagesTab onSessionExpired={handleSessionExpired} />}
        {activeTab === 'articles' && <ArticlesTab onSessionExpired={handleSessionExpired} />}
        </div>

        {showPreview && (
          <div className="hidden lg:block w-[44%] shrink-0 sticky top-20 h-[calc(100vh-6rem)]">
            <PreviewPane siteUrl={siteUrl} frameRef={frameRef} path={pvPath} onGoto={p => toFrame({ type: 'sj-goto', path: p })} onClose={() => setShowPreview(false)} />
          </div>
        )}
      </div>
    </div>
    </PreviewContext.Provider>
  );
}
