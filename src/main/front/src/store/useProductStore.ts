import { create } from "zustand";

interface ProductState {
  products: any[]; // 실제 프로젝트에서는 any 대신 구체적인 타입을 사용하세요.
  addProduct: (product: any) => void; // 실제 프로젝트에서는 any 대신 구체적인 타입을 사용하세요.
}

const useProductStore = create<ProductState>((set) => ({
  products: [],
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
}));

export default useProductStore;
