import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Measurements {
  [key: string]: number | undefined;
}

export interface OrderData {
  fabric: {
    type: string;
    color: string;
  };
  garment: string;
  design: {
    neckDesign: string;
    embroidery: string;
    painting: string;
  };
  measurements: Measurements;
  unit: 'inches' | 'cm';
}

export interface CustomOrder {
  id: string;
  tenant: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  orderData: OrderData;
  price: number | null;
  status: 'pricing_pending' | 'price_sent' | 'processing' | 'packed' | 'dispatched' | 'delivered';
  createdAt: string;
  updatedAt: string;
}

interface OrderState {
  currentOrder: Partial<OrderData>;
  currentStep: number;
  setOrderData: (data: Partial<OrderData>) => void;
  setStep: (step: number) => void;
  resetOrder: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

const initialOrderData: Partial<OrderData> = {
  fabric: undefined,
  garment: undefined,
  design: undefined,
  measurements: {},
  unit: 'inches',
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      currentOrder: initialOrderData,
      currentStep: 1,

      setOrderData: (data) => {
        set((state) => ({
          currentOrder: { ...state.currentOrder, ...data },
        }));
      },

      setStep: (step) => set({ currentStep: step }),

      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 5) })),

      prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

      resetOrder: () => set({ currentOrder: initialOrderData, currentStep: 1 }),
    }),
    {
      name: 'storefuse-order',
    }
  )
);
