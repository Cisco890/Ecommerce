// src/Hooks/useContextCarrito.tsx
import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface PokemonCarrito {
  name: string
  price: number
  img: string
  quantity: number
}

interface CarritoContextType {
  cart: PokemonCarrito[]
  addToCart: (pokemon: Omit<PokemonCarrito, "quantity">) => void
  removeFromCart: (index: number) => void
  increaseQuantity: (index: number) => void
  decreaseQuantity: (index: number) => void
  totalItems: number
  totalPrice: number
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined)

export const CarritoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<PokemonCarrito[]>([])

  const addToCart = (pokemon: Omit<PokemonCarrito, "quantity">) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((p) => p.name === pokemon.name)
      if (existingIndex !== -1) {
        const newCart = [...prev]
        newCart[existingIndex].quantity += 1
        return newCart
      }
      return [...prev, { ...pokemon, quantity: 1 }]
    })
  }

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index))
  }

  const increaseQuantity = (index: number) => {
    setCart((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity: Math.min(item.quantity + 1, 9) } : item)),
    )
  }

  const decreaseQuantity = (index: number) => {
    setCart((prev) =>
      prev.map((item, i) =>
        i === index && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item,
      ),
    )
  }

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <CarritoContext.Provider
      value={{ cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, totalItems, totalPrice }}
    >
      {children}
    </CarritoContext.Provider>
  )
}

export const useContextCarrito = () => {
  const context = useContext(CarritoContext)
  if (!context) {
    throw new Error("useContextCarrito debe usarse dentro de un CarritoProvider")
  }
  return context
}
