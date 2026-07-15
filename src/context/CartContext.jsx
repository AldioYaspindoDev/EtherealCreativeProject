"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  // Optional: You could store the entire cart here if needed later
  // const [cart, setCart] = useState(null);

  const fetchCartCount = async () => {
    try {
      // Assuming the same endpoint /cart is used
      // We rely on cookie authentication
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        withCredentials: true,
      });

      if (res.data?.cart?.items) {
        setCartCount(res.data.cart.items.length);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      // If 401 or 404, user might not be logged in or no cart
      // ensure count is 0
      setCartCount(0);
      // We don't log error to console to avoid noise if user just isn't logged in
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  const refreshCart = () => {
    fetchCartCount();
  };

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
