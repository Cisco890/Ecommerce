import React, { createContext, useContext } from "react"
import { useStateCarrito } from "./useStateCarrito"

// Tipo para el contexto del carrito
type CarritoContextType = ReturnType<typeof useStateCarrito>

// Crear el contexto con tipo específico
const CarritoContext = createContext<CarritoContextType | null>(null)

// Provider del contexto
export const CarritoProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  // Usar el hook personalizado que maneja todo el estado
  const carritoState = useStateCarrito()

  return (
    <CarritoContext.Provider value={carritoState}>
      {children}
    </CarritoContext.Provider>
  )
}

// Hook personalizado para usar el contexto del carrito
export const useContextCarrito = () => {
  const context = useContext(CarritoContext)

  if (!context) {
    throw new Error(
      "useContextCarrito debe ser usado dentro de un CarritoProvider",
    )
  }

  return context
}

export default useContextCarrito
