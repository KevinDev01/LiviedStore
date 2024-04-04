import { useContext } from "react";
import cartContext from "~/context/cart.context";

const useCart = () => {
  const context = useContext(cartContext);
  if (!context) {
    throw new Error("useCart its only used inside of CartProvider");
  }
  return context;
};
