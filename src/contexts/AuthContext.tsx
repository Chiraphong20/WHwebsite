import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import liff from '@line/liff';

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LineUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initLiff = async () => {
      try {
        if (!LIFF_ID) {
          // No LIFF ID — try restoring from localStorage only
          const stored = localStorage.getItem('line_user');
          if (stored) setUser(JSON.parse(stored));
          setIsLoading(false);
          return;
        }

        await liff.init({ liffId: LIFF_ID });

        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          const u: LineUser = {
            userId: profile.userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl ?? undefined,
          };
          setUser(u);
          localStorage.setItem('line_user', JSON.stringify(u));
        } else {
          // Not logged in via LIFF — try localStorage fallback
          const stored = localStorage.getItem('line_user');
          if (stored) setUser(JSON.parse(stored));
        }
      } catch (e) {
        console.error('LIFF init error:', e);
        // Fallback: restore from localStorage
        try {
          const stored = localStorage.getItem('line_user');
          if (stored) setUser(JSON.parse(stored));
        } catch {}
      } finally {
        setIsLoading(false);
      }
    };

    initLiff();
  }, []);

  const login = () => {
    try {
      liff.login();
    } catch (e) {
      console.error('Login error:', e);
    }
  };

  const logout = () => {
    localStorage.removeItem('line_user');
    setUser(null);
    try {
      if (liff.isLoggedIn()) liff.logout();
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
