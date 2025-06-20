// stores/useCheckoutStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Range } from 'react-date-range'
import { safeListing } from '@/types'

type CheckoutData = {
  listingId: string
  totalPrice: number
  dateRange: Range
  listing: safeListing
}

type CheckoutStore = {
  data: CheckoutData | null
  setData: (data: CheckoutData) => void
  clear: () => void
}

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      data: null,
      setData: (data) => set({ data }),
      clear: () => set({ data: null }),
    }),
    {
      name: 'checkout-storage', // tên key lưu vào localStorage
    }
  )
)
