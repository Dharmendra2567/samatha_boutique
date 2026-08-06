'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('sr_cart');
      if (raw) setItems(JSON.parse(raw));

      const rawWish = localStorage.getItem('sr_wishlist');
      if (rawWish) setWishlist(JSON.parse(rawWish));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('sr_cart', JSON.stringify(items));
      localStorage.setItem('sr_wishlist', JSON.stringify(wishlist));
    }
  }, [items, wishlist, hydrated]);

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((p) => p.id === product.id);
      if (found) return prev.map((p) => (p.id === product.id ? { ...p, qty: p.qty + qty } : p));
      return [...prev, { id: product.id, name: product.name, price: product.price, mrp: product.mrp, image: product.images?.[0] || product.image, qty }];
    });
  };
  const removeItem = (id) => setItems((prev) => prev.filter((p) => p.id !== id));
  const updateQty = (id, qty) => setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p)));
  const clear = () => setItems([]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const found = prev.find((p) => p.id === product.id);
      if (found) {
        toast.success('Removed from wishlist', { description: product.name });
        return prev.filter((p) => p.id !== product.id);
      } else {
        toast.success('Added to wishlist', { description: product.name });
        return [...prev, { id: product.id, name: product.name, price: product.price, mrp: product.mrp, image: product.images?.[0] || product.image }];
      }
    });
  };

  const isInWishlist = (id) => wishlist.some((p) => p.id === id);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const savings = items.reduce((s, i) => s + Math.max(0, (i.mrp || i.price) - i.price) * i.qty, 0);
  const shipping = subtotal > 2999 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, wishlist, addItem, removeItem, updateQty, clear, toggleWishlist, isInWishlist, subtotal, savings, shipping, total, count, hydrated }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
