import { createContext, useState, useMemo, useCallback } from "react";

interface Product {
  id: string;
  name: string;
  price: string;
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeToCart: (productId: string) => void;
  updateCart: (productId: string) => void;
}

const cartContext = createContext<CartContextType | undefined>(undefined);

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = useCallback((product: Product) => {
    setCart([...cart, product]);
  }, []);

  const removeToCart = useCallback((productId: string) => {
    const updateCart = cart.filter((item) => item.id !== productId);
    setCart(updateCart);
  }, []);

  const updateCart = useCallback((productId: string) => {
    setCart((cart) =>
      cart.map((item) =>
        item.id === productId ? { ...item, cantidad: +1 } : item
      )
    );
  }, []);

  const valueContext: CartContextType = useMemo(
    () => ({
      cart,
      addToCart,
      removeToCart,
      updateCart,
    }),
    [cart, addToCart, removeToCart, updateCart]
  );

  return (
    <cartContext.Provider value={valueContext}>{children}</cartContext.Provider>
  );
};

export { CartProvider };
export default cartContext;
