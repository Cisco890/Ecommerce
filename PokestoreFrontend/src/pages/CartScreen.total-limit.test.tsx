import { render, screen, fireEvent } from "@testing-library/react"
import CartScreen from "./CartScreen"
import { CarritoProvider } from "../hooks/useContextCarrito"
import { BrowserRouter } from "react-router-dom"

// Mock window.alert
const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {})

const customCart = [
  {
    id: 1,
    name: "Mewtwo",
    price: 500,
    originalPrice: 500,
    img: "mewtwo.png",
    quantity: 2, // 500 * 2 = 1000
  },
]

jest.mock("../hooks/useContextCarrito", () => {
  const actual = jest.requireActual("../hooks/useContextCarrito")
  return {
    ...actual,
    useContextCarrito: () => ({
      cart: customCart,
      aumentarCantidad: jest.fn(),
      disminuirCantidad: jest.fn(),
      removerDelCarrito: jest.fn(),
      limpiarCarrito: jest.fn(),
    }),
  }
})

test("muestra alerta si el total es mayor a 999 al confirmar captura", () => {
  render(
    <BrowserRouter>
      <CarritoProvider>
        <CartScreen />
      </CarritoProvider>
    </BrowserRouter>,
  )

  // El botón debe estar presente
  const confirmarBtn = screen.getByRole("button", {
    name: /confirmar captura/i,
  })
  fireEvent.click(confirmarBtn)

  // Debe mostrar la alerta de error
  expect(alertMock).toHaveBeenCalledWith("Error, monto mayor a 999")
})
