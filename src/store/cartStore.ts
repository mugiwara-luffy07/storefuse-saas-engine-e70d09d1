import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  tenant: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTenantItems: (tenant: string) => CartItem[];
  getTenantTotal: (tenant: string) => number;
  getTenantItemCount: (tenant: string) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const id = `${item.productId}-${item.size}-${item.tenant}`;
        set((state) => {
          const existingItem = state.items.find((i) => i.id === id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, id }] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTenantItems: (tenant) => {
        return get().items.filter((item) => item.tenant === tenant);
      },

      getTenantTotal: (tenant) => {
        return get()
          .items.filter((item) => item.tenant === tenant)
          .reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getTenantItemCount: (tenant) => {
        return get()
          .items.filter((item) => item.tenant === tenant)
          .reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'storefuse-cart',
    }
  )
);
