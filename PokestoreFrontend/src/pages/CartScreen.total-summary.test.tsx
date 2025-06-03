import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import CartScreen from "./CartScreen"
import { CarritoProvider } from "../hooks/useContextCarrito"
import { BrowserRouter } from "react-router-dom"

const mockCartItems = [
  {
    id: 25,
    name: "Pikachu",
    price: 200,
    img: "pikachu.png",
    quantity: 2, // 200 * 2 = 400
  },
  {
    id: 4,
    name: "Charmander",
    price: 150,
    img: "charmander.png",
    quantity: 3, // 150 * 3 = 450
  },
]

jest.mock("../hooks/useContextCarrito", () => {
  const actual = jest.requireActual("../hooks/useContextCarrito")
  return {
    ...actual,
    useContextCarrito: () => ({
      cart: mockCartItems,
      aumentarCantidad: jest.fn(),
      disminuirCantidad: jest.fn(),
      removerDelCarrito: jest.fn(),
      limpiarCarrito: jest.fn(),
      totalItems: mockCartItems.reduce((acc, item) => acc + item.quantity, 0), // = 5
      totalPrice: mockCartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      ), // = 850
    }),
  }
})

test("verifica cálculos correctos del carrito de compras", () => {
  render(
    <BrowserRouter>
      <CarritoProvider>
        <CartScreen />
      </CarritoProvider>
    </BrowserRouter>,
  )

  // Verificar que aparece "Total a pagar:" y "$850" por separado
  expect(screen.getByText("Total a pagar:")).toBeInTheDocument()
  expect(screen.getByText("$850")).toBeInTheDocument()

  // Verificar "Pokémon capturados:" y buscar el párrafo específico que contiene ambos
  expect(screen.getByText("Pokémon capturados:")).toBeInTheDocument()

  // Buscar el contenedor que tiene tanto "Pokémon capturados:" como "5"
  const pokemonCountElement = screen.getByText((_, element) => {
    return element?.textContent === "Pokémon capturados: 5"
  })
  expect(pokemonCountElement).toBeInTheDocument()
})
