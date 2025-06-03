import { useMemo } from "react"

export interface CartItem {
  id: number | string
  name: string
  price: number
  originalPrice?: number
  img: string
  quantity: number
}

export const useMemoTotal = (cart: CartItem[]) => {
  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  )

  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [cart],
  )

  return { totalItems, totalPrice }
}

export default useMemoTotal
