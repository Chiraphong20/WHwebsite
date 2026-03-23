import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LineUser {
  userId: string;
  displayName: string;
  pictureUrl?: string;
}

interface AuthContextType {
  user: LineUser | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const LIFF_ID = import.meta.env.VITE_LIFF_ID as string;
const REDIRECT_URI = import.meta.env.VITE_LINE_REDIRECT_URI || (window.location.origin + '/products');
const LINE_LOGIN_URL = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${import.meta.env.VITE_LINE_LOGIN_CHANNEL_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=wonghiran&scope=profile%20openid`;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LineUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to restore user from localStorage
    try {
      const stored = localStorage.getItem('line_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {}
    setIsLoading(false);

    // Try to init LIFF if available
    const tryLiff = async () => {
      try {
        const liff = (window as any).liff;
        if (!liff || !LIFF_ID) return;
        await liff.init({ liffId: LIFF_ID });
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          const u: LineUser = {
            userId: profile.userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl,
          };
          setUser(u);
          localStorage.setItem('line_user', JSON.stringify(u));
        }
      } catch (e) {
        // LIFF not available or not in LINE app — fallback to LINE Login OAuth
      }
    };
    tryLiff();
  }, []);

  const login = () => {
    // Redirect to LINE Login
    window.location.href = LINE_LOGIN_URL;
  };

  const logout = () => {
    localStorage.removeItem('line_user');
    setUser(null);
    try {
      const liff = (window as any).liff;
      if (liff?.isLoggedIn?.()) liff.logout();
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
