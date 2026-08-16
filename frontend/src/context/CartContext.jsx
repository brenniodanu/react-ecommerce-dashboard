import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // Inisialisasi state dari localStorage (jika ada)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Gagal memuat keranjang dari localStorage:', error);
      return [];
    }
  });

  // Simpan data keranjang ke localStorage setiap kali ada perubahan pada cartItems
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Gagal menyimpan keranjang ke localStorage:', error);
    }
  }, [cartItems]);

  // Tambah ke keranjang (bisa menentukan jumlah kuantitas)
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  // Ubah jumlah item (+1 atau -1)
  const updateQuantity = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Hapus item dari keranjang
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Kosongkan keranjang setelah checkout
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);