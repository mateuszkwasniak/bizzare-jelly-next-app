import { create } from "zustand";

// const testState = {
//   id: 123123,
//   createdAt: "13.04.2024",
//   updatedAt: "13.04.2024",
//   total: 1029,
//   status: "awaiting" as
//     | "awaiting"
//     | "paid"
//     | "fulfilling"
//     | "transport"
//     | "delivered"
//     | "cancelled",
//   delivery: "free",
//   payment: "card",
//   ordered: [
//     {
//       id: 1,
//       count: 3,
//       product: {
//         id: 1,
//         name: "",
//         price: 0,
//         category: "",
//         pictures: [
//           {
//             id: 1,
//             url: "",
//           },
//         ],
//       },
//     },
//     {
//       id: 1,
//       count: 3,
//       product: {
//         id: 1,
//         name: "",
//         price: 0,
//         category: "",
//         pictures: [
//           {
//             id: 1,
//             url: "",
//           },
//         ],
//       },
//     },
//     {
//       id: 1,
//       count: 3,
//       product: {
//         id: 1,
//         name: "",
//         price: 0,
//         category: "",
//         pictures: [
//           {
//             id: 1,
//             url: "",
//           },
//         ],
//       },
//     },
//   ],
// };

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
