import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'platform_pass' | 'world_pass';
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  // Initialize with the mandatory platform pass
  items: [
    {
      id: 'pass_base',
      name: 'Survivor Base Platform Pass',
      price: 250,
      type: 'platform_pass',
    }
  ],
  addItem: (item) => set((state) => {
    // Avoid duplicates
    if (state.items.find((i) => i.id === item.id)) return state;
    return { items: [...state.items, item] };
  }),
  removeItem: (id) => set((state) => ({
    // Do not allow removing the mandatory platform pass
    items: state.items.filter((i) => i.id !== id || i.type === 'platform_pass'),
  })),
  clearCart: () => set({ 
    items: [
      {
        id: 'pass_base',
        name: 'Survivor Base Platform Pass',
        price: 250,
        type: 'platform_pass',
      }
    ]
  }),
  getTotal: () => get().items.reduce((total, item) => total + item.price, 0),
}));
