import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';
import { markProductAsSold } from '@/services/productMutations';
import { siteAnalyticsService } from '@/services/siteAnalyticsService';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  processCheckout: () => Promise<void>;
  isProductInCart: (productId: string) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product: Product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.product.id === product.id);
          
          if (existingItem) {
            console.log(`⚠️ Produto ${product.name} já está no carrinho`);
            return state;
          }
          
          // Track add to cart event with product code
          siteAnalyticsService.trackAddToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            productCode: product.meta?.productId,
          });
          
          console.log(`✅ Adicionando produto ${product.name} ao carrinho`);
          return {
            items: [...state.items, { product, quantity: 1 }],
          };
        });
      },

      removeFromCart: (productId: string) => {
        const state = get();
        const item = state.items.find(i => i.product.id === productId);
        
        if (item) {
          // Track remove from cart event with product code
          siteAnalyticsService.trackRemoveFromCart({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            productCode: item.product.meta?.productId,
          });
        }
        
        console.log(`🗑️ Removendo produto ${productId} do carrinho`);
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        
        // Para produtos únicos, a quantidade sempre será 1
        if (quantity > 1) {
          console.log(`⚠️ Produto único: quantidade limitada a 1`);
          quantity = 1;
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: 1 }
              : item
          ),
        }));
      },

      clearCart: () => {
        console.log("🧹 Limpando carrinho");
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.length; // Para produtos únicos, conta o número de produtos
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.product.price, 0);
      },

      isProductInCart: (productId: string) => {
        return get().items.some((item) => item.product.id === productId);
      },

      processCheckout: async () => {
        const items = get().items;
        console.log("🔄 Processing checkout for items:", items);
        
        try {
          // Mark all products in cart as sold
          for (const item of items) {
            console.log(`🔄 Marking product ${item.product.id} as sold...`);
            await markProductAsSold(item.product.id);
          }
          
          // Clear the cart after successful checkout
          get().clearCart();
          console.log("✅ Checkout processed successfully");
        } catch (error) {
          console.error("❌ Error processing checkout:", error);
          throw error;
        }
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
