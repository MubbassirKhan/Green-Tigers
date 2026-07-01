import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/client';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        const { access_token, user } = res.data;
        localStorage.setItem('gtn_token', access_token);
        set({ user, token: access_token, isAuthenticated: true });
        return user;
      },

      register: async (email, password, full_name, phone) => {
        const res = await api.post('/auth/register', { email, password, full_name, phone });
        const { access_token, user } = res.data;
        localStorage.setItem('gtn_token', access_token);
        set({ user, token: access_token, isAuthenticated: true });
        return user;
      },

      logout: () => {
        localStorage.removeItem('gtn_token');
        localStorage.removeItem('gtn_user');
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (updatedUser) => set({ user: { ...get().user, ...updatedUser } }),

      isAdmin: () => get().user?.role === 'admin',
    }),
    {
      name: 'gtn_auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
