import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/client';
import useAuthStore from './authStore';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      fetchCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return;
        try {
          const res = await api.get('/cart/');
          set({ items: res.data });
        } catch { /* ignore */ }
      },

      addToCart: async (productId, quantity = 1) => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return false;
        await api.post('/cart/', { product_id: productId, quantity });
        await get().fetchCart();
        return true;
      },

      updateItem: async (itemId, quantity) => {
        await api.put(`/cart/${itemId}`, { quantity });
        await get().fetchCart();
      },

      removeItem: async (itemId) => {
        await api.delete(`/cart/${itemId}`);
        set((s) => ({ items: s.items.filter((i) => i.id !== itemId) }));
      },

      clearCart: async () => {
        await api.delete('/cart/');
        set({ items: [] });
      },

      getTotal: () => {
        return get().items.reduce((sum, item) => {
          const price = item.products?.price || 0;
          return sum + price * item.quantity;
        }, 0);
      },

      getCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'gtn_cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCartStore;
