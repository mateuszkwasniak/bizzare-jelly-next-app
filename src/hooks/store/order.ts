import { create } from "zustand";

interface OrderState {
  order: Order | null;
  updateOrder: (data: Order) => void;
  processingOrder: boolean;
  setProcessingOrder: (processing: boolean) => void;
}

export const useOrderState = create<OrderState>((set) => ({
  order: null,
  updateOrder: (data: Order | null) =>
    set(() => ({ order: data ? { ...data } : null })),
  processingOrder: false,
  setProcessingOrder: (processing: boolean) =>
    set(() => ({ processingOrder: processing })),
}));
