import { useState } from "react"

type CartItem = {
  id: number | string
  name: string
  price: number
  img: string
  quantity: number
}

type Pokemon = {
  id: number | string
  name: string
  price?: number
  cost?: number
  img?: string
  sprite?: string
}

// Hook personalizado para manejar el estado del carrito
export const useStateCarrito = () => {
  const [cart, setCart] = useState<CartItem[]>([])

  // Función para agregar un Pokémon al carrito
  const agregarAlCarrito = (pokemon: Pokemon) => {
    setCart((prevCart) => {
      // Verificar si el Pokémon ya está en el carrito
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === pokemon.id,
      )

      if (existingItemIndex !== -1) {
        // Si ya existe, aumentar la cantidad (máximo 9)
        return prevCart.map((item, index) =>
          index === existingItemIndex && item.quantity < 9
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      } else {
        // Si no existe, agregarlo con cantidad 1
        const newItem = {
          id: pokemon.id,
          name: pokemon.name,
          price: pokemon.price || pokemon.cost || 0, // Manejar ambos nombres de propiedad
          img: pokemon.img || pokemon.sprite || "", // Manejar ambos nombres de propiedad
          quantity: 1,
        }
        return [...prevCart, newItem]
      }
    })
  }

  // Función para remover un Pokémon del carrito
  const removerDelCarrito = (pokemonId: number | string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== pokemonId))
  }

  // Función para aumentar cantidad
  const aumentarCantidad = (pokemonId: number | string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === pokemonId && item.quantity < 9
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    )
  }

  // Función para disminuir cantidad
  const disminuirCantidad = (pokemonId: number | string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === pokemonId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    )
  }

  // Función para verificar si un Pokémon está en el carrito
  const estaEnCarrito = (pokemonId: number | string) => {
    return cart.some((item) => item.id === pokemonId)
  }

  // Función para obtener la cantidad de un Pokémon específico
  const obtenerCantidadPokemon = (pokemonId: number | string) => {
    const item = cart.find((item) => item.id === pokemonId)
    return item ? item.quantity : 0
  }

  // Función para limpiar el carrito
  const limpiarCarrito = () => {
    setCart([])
  }

  // Calcular totales
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  )

  // Retornar todas las funciones y valores que necesita el contexto
  return {
    cart,
    agregarAlCarrito,
    removerDelCarrito,
    aumentarCantidad,
    disminuirCantidad,
    estaEnCarrito,
    obtenerCantidadPokemon,
    limpiarCarrito,
    totalItems,
    totalPrice,
  }
}
