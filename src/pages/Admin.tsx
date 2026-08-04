import React, { useState } from 'react';
import { Eye, EyeOff, LogOut, ImageIcon, Package, Layers, FileText, Newspaper } from 'lucide-react';
import { getToken, getStoredUser, setSession, clearSession, AdminUser } from '../lib/adminApi';
import ProductsTab from '../components/admin/ProductsTab';
import ContentTab from '../components/admin/ContentTab';
import ArticlesTab from '../components/admin/ArticlesTab';
import PackagesTab from '../components/admin/PackagesTab';

type Tab = 'products' | 'content' | 'packages' | 'articles';

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'products', label: 'สินค้า', icon: <Package size={16} /> },
  { key: 'content', label: 'เนื้อหาเว็บไซต์', icon: <FileText size={16} /> },
  { key: 'packages', label: 'แพ็กเกจ', icon: <Layers size={16} /> },
  { key: 'articles', label: 'บทความ', icon: <Newspaper size={16} /> },
];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getToken());
  const [user, setUser] = useState<AdminUser | null>(() => getStoredUser());
  const [activeTab, setActiveTab] = useState<Tab>('products');

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
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-dark">Admin Panel</h1>
            <p className="text-gray-500 mt-1 text-sm">
              {user ? `เข้าสู่ระบบเป็น ${user.name || user.username}` : 'วงษ์หิรัญ ค้าส่ง'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-red-500 transition-colors"
          >
            <LogOut size={16} />
            ออกจากระบบ
          </button>
        </div>

        <div className="flex gap-2 mb-8 border-b border-gray-200">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 -mb-px transition-colors ${
                activeTab === tab.key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'products' && <ProductsTab onSessionExpired={handleSessionExpired} />}
        {activeTab === 'content' && <ContentTab onSessionExpired={handleSessionExpired} />}
        {activeTab === 'packages' && <PackagesTab onSessionExpired={handleSessionExpired} />}
        {activeTab === 'articles' && <ArticlesTab onSessionExpired={handleSessionExpired} />}
      </div>
    </div>
  );
}
