"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import type { CartItem } from "@/lib/cart-types";

type CartResult = {
  ok: boolean;
  message: string;
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (item: CartItem) => CartResult;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "velvet-whisper-cart";

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const savedCart = window.localStorage.getItem(storageKey);

  if (!savedCart) {
    return [];
  }

  try {
    return JSON.parse(savedCart) as CartItem[];
  } catch {
    window.localStorage.removeItem(storageKey);
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readStoredCart);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: CartItem): CartResult => {
    if (item.stock <= 0) {
      return {
        ok: false,
        message: "Этот товар закончился."
      };
    }

    let result: CartResult = {
      ok: true,
      message: "Товар добавлен в корзину."
    };

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (currentItem) => currentItem.variantId === item.variantId
      );

      if (!existingItem) {
        return [...currentItems, item];
      }

      if (existingItem.quantity + item.quantity > existingItem.stock) {
        result = {
          ok: false,
          message: "В наличии меньше единиц, чем вы хотите добавить."
        };
        return currentItems;
      }

      return currentItems.map((currentItem) =>
        currentItem.variantId === item.variantId
          ? {
              ...currentItem,
              quantity: currentItem.quantity + item.quantity
            }
          : currentItem
      );
    });

    return result;
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.variantId === variantId
            ? {
                ...item,
                quantity: Math.min(Math.max(quantity, 1), item.stock)
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.variantId !== variantId)
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return {
      items,
      totalItems,
      subtotal,
      addItem,
      updateQuantity,
      removeItem,
      clearCart
    };
  }, [addItem, clearCart, items, removeItem, updateQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart должен использоваться внутри CartProvider");
  }

  return context;
}
