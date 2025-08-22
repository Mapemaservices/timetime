export type { CartItem } from "@/context/CartContext";
import { useCartContext } from "@/context/CartContext";

export const useCart = () => useCartContext();