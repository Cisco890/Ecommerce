import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import CartScreen from "./CartScreen"
import { CarritoProvider } from "../hooks/useContextCarrito"
import { BrowserRouter } from "react-router-dom"

const mockCartItemsAtLimit = [
  {
    id: 150,
    name: "Mewtwo",
    price: 300,
    img: "mewtwo.png",
    quantity: 9, // Ya está en el límite máximo
  },
]

const mockAumentarCantidad = jest.fn()

jest.mock("../hooks/useContextCarrito", () => {
  const actual = jest.requireActual("../hooks/useContextCarrito")
  return {
    ...actual,
    useContextCarrito: () => ({
      cart: mockCartItemsAtLimit,
      aumentarCantidad: mockAumentarCantidad,
      disminuirCantidad: jest.fn(),
      removerDelCarrito: jest.fn(),
      limpiarCarrito: jest.fn(),
      totalItems: mockCartItemsAtLimit.reduce(
        (acc, item) => acc + item.quantity,
        0,
      ),
      totalPrice: mockCartItemsAtLimit.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      ),
    }),
  }
})

test("no se puede aumentar la cantidad de un Pokémon más allá del límite", () => {
  render(
    <BrowserRouter>
      <CarritoProvider>
        <CartScreen />
      </CarritoProvider>
    </BrowserRouter>,
  )

  // Buscar el botón de aumentar cantidad para Mewtwo
  const increaseButton = screen.getByLabelText("Aumentar cantidad")

  // Verificar que la cantidad actual es 9 en el span específico de cantidad
  const quantitySpan = screen.getByText((content, element) => {
    return element?.className === "card-carrito__quantity" && content === "9"
  })
  expect(quantitySpan).toBeInTheDocument()

  // Verificar que el botón de aumentar está deshabilitado (límite alcanzado)
  expect(increaseButton).toBeDisabled()

  // Intentar hacer click en el botón deshabilitado (no debería hacer nada)
  fireEvent.click(increaseButton)

  // Verificar que la función aumentarCantidad NO fue llamada porque el botón está disabled
  expect(mockAumentarCantidad).not.toHaveBeenCalled()

  // La cantidad debería seguir siendo 9
  expect(quantitySpan).toBeInTheDocument()
})
