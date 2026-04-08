import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  preferred_locale: string;
  created_at: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  loadFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  register: async (email, name, password) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8001'}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Registration failed');
    }
    const data = await res.json();
    localStorage.setItem('manas_token', data.access_token);
    localStorage.setItem('manas_user', JSON.stringify(data.user));
    set({ user: data.user, token: data.access_token, isAuthenticated: true, isLoading: false });
  },

  login: async (email, password) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8001'}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Login failed');
    }
    const data = await res.json();
    localStorage.setItem('manas_token', data.access_token);
    localStorage.setItem('manas_user', JSON.stringify(data.user));
    set({ user: data.user, token: data.access_token, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem('manas_token');
    localStorage.removeItem('manas_user');
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  loadFromStorage: async () => {
    try {
      const token = localStorage.getItem('manas_token');
      const userStr = localStorage.getItem('manas_user');
      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));
