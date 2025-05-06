
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';

type CartItem = {
  product: Product;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartQuantity: () => number;
};

// This will record the cart interactions for analytics
const recordCartInteraction = (action: string, product: Product, quantity: number = 1) => {
  const now = new Date().toISOString();
  const analyticsData = JSON.parse(localStorage.getItem('cartAnalytics') || '[]');
  
  analyticsData.push({
    timestamp: now,
    action,
    productId: product.id,
    productName: product.name,
    quantity,
    price: product.price,
    referrer: document.referrer || 'direct'
  });
  
  localStorage.setItem('cartAnalytics', JSON.stringify(analyticsData));
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);
        
        if (existingItemIndex > -1) {
          // Item already in cart, update quantity
          const newItems = [...currentItems];
          newItems[existingItemIndex].quantity += quantity;
          set({ items: newItems });
        } else {
          // New item
          set({ items: [...currentItems, { product, quantity }] });
        }
        
        // Record analytics
        recordCartInteraction('add_to_cart', product, quantity);
      },
      
      removeFromCart: (productId) => {
        const currentItems = get().items;
        const itemToRemove = currentItems.find(item => item.product.id === productId);
        
        if (itemToRemove) {
          // Record analytics before removing
          recordCartInteraction('remove_from_cart', itemToRemove.product, itemToRemove.quantity);
          
          set({
            items: currentItems.filter(item => item.product.id !== productId)
          });
        }
      },
      
      updateQuantity: (productId, quantity) => {
        const currentItems = get().items;
        const itemToUpdate = currentItems.find(item => item.product.id === productId);
        
        if (itemToUpdate) {
          // Record analytics
          recordCartInteraction('update_quantity', itemToUpdate.product, quantity - itemToUpdate.quantity);
          
          set({
            items: currentItems.map(item => 
              item.product.id === productId ? { ...item, quantity } : item
            )
          });
        }
      },
      
      clearCart: () => {
        // Record analytics for clearing cart
        const currentItems = get().items;
        if (currentItems.length > 0) {
          recordCartInteraction('clear_cart', { id: 'all', name: 'All Items' } as Product, 0);
          set({ items: [] });
        }
      },
      
      getCartQuantity: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'pet-serpentes-cart', // unique name for localStorage
      version: 1,
    }
  )
);
