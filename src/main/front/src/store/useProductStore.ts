import { create } from "zustand";
import { ProductItemProps } from "../types/product.types";

interface ProductState {
  products: ProductItemProps[];
  addProduct: (product: ProductItemProps) => void;
}

const useProductStore = create<ProductState>((set) => ({
  products: [],
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
}));

export default useProductStore;
