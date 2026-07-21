import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PRODUCTS } from '@/data/products';

function calculatePrice(productId: string, quantity: number): number {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return 0;
  
  if (!product.quantityOptions || product.quantityOptions.length === 0) {
    return (product.basePrice || 0) * quantity;
  }
  
  // Büyükten küçüğe sırala (Örn: 10, 5, 3, 1)
  const sortedOptions = [...product.quantityOptions].sort((a, b) => b.quantity - a.quantity);
  
  let remaining = quantity;
  let total = 0;
  
  for (const opt of sortedOptions) {
    if (remaining >= opt.quantity) {
      const count = Math.floor(remaining / opt.quantity);
      total += count * opt.price;
      remaining -= count * opt.quantity;
    }
  }
  
  return total;
}

export interface CartItem {
  id: string; // Unique id for the cart item (e.g. productId + selected variants hash)
  productId: string;
  name: string;
  price: number;
  quantity: number;
  customImage: string | null;
  variants: Record<string, string>;
}

interface CartState {
  cart: CartItem[];
  isOpen: boolean;
  isAuthModalOpen: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      isOpen: false,
      isAuthModalOpen: false,
      
      addToCart: (item) => set((state) => {
        // Sepette aynı ürün (aynı varyantlar ve görselle) var mı kontrol et
        const existingItemIndex = state.cart.findIndex(i => i.id === item.id);
        
        if (existingItemIndex >= 0) {
          // Varsa sadece miktarını ve fiyatını güncelle
          const newCart = [...state.cart];
          const newQuantity = newCart[existingItemIndex].quantity + item.quantity;
          
          newCart[existingItemIndex] = {
            ...newCart[existingItemIndex],
            quantity: newQuantity,
            price: calculatePrice(item.productId, newQuantity)
          };
          return { cart: newCart };
        } else {
          // Yoksa yeni olarak ekle, fiyatını doğrula
          const verifiedItem = {
            ...item,
            price: calculatePrice(item.productId, item.quantity)
          };
          return { cart: [...state.cart, verifiedItem] };
        }
      }),

      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== id)
      })),

      updateQuantity: (id, quantity) => set((state) => ({
        cart: state.cart.map((item) => {
          if (item.id === id) {
            const newQuantity = Math.max(1, quantity);
            return {
              ...item,
              quantity: newQuantity,
              price: calculatePrice(item.productId, newQuantity)
            };
          }
          return item;
        })
      })),

      clearCart: () => set({ cart: [] }),
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      openCart: () => set({ isOpen: true }),
      
      closeCart: () => set({ isOpen: false }),

      openAuthModal: () => set({ isAuthModalOpen: true }),

      closeAuthModal: () => set({ isAuthModalOpen: false }),
    }),
    {
      name: 'baski-cart-storage',
    }
  )
);
