// src/pages/CartScreen.tsx
import React from "react"
import { useContextCarrito } from "../hooks/useContextCarrito"
import ButtonMain from "../components/ui/ButtonMain"
import ButtonCarrito from "../components/ui/ButtonCarrito"
import CardCarrito from "../components/CardCartito"
import ButtonConfirmarCaptura from "../components/ui/ButtonConfirmarCaptura"
import ButtonLiberar from "../components/ui/ButtonLiberar"
import useMemoTotal from "../hooks/useMemoTotal"
import "./CartScreen.css" // Estilos responsive
import "../index.css"
import "../app.css"

const CartScreen: React.FC = () => {
  const {
    cart,
    aumentarCantidad,
    disminuirCantidad,
    removerDelCarrito,
    limpiarCarrito,
  } = useContextCarrito()

  const { totalItems, totalPrice } = useMemoTotal(cart)

  // Estilos inline para el header (igual al de MainScreen/DetailScreen)
  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f55151",
    padding: "1rem",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  }

  return (
    <div className="cart-screen">
      <header style={headerStyle}>
        <ButtonMain />
        <ButtonCarrito count={totalItems} />
      </header>

      <main className="cart-content">
        <section className="cart-section">
          <div className="cart-title">
            <h2>Carrito de Compras</h2>
          </div>

          <div className="cart-grid-container">
            {cart.length === 0 ? (
              <div className="cart-empty">
                <p>Tu carrito está vacío</p>
                <p className="cart-empty-subtext">
                  ¡Atrapa algunos Pokémon para empezar tu aventura!
                </p>
              </div>
            ) : (
              <div className="cart-grid">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item-wrapper">
                    <CardCarrito
                      name={item.name}
                      price={item.price}
                      img={item.img}
                      quantity={item.quantity}
                      onIncrease={() => aumentarCantidad(item.id)}
                      onDecrease={() => disminuirCantidad(item.id)}
                      onRemove={() => removerDelCarrito(item.id)}
                    />
                  </div>
                ))}
                {cart.length % 6 !== 0 &&
                  Array.from({ length: 6 - (cart.length % 6) }).map(
                    (_, idx) => (
                      <div key={`empty-${idx}`} className="cart-empty-slot" />
                    ),
                  )}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="cart-summary-wrapper">
              <div className="cart-summary">
                <h3>Resumen de Captura</h3>
                <div className="cart-summary-details">
                  <p>
                    <strong>Pokémon capturados:</strong> {totalItems}
                  </p>
                  <p className="cart-summary-total">
                    <strong>Total a pagar:</strong> ${totalPrice}
                  </p>
                </div>

                <ButtonConfirmarCaptura
                  onClick={() => {
                    if (totalPrice > 999) {
                      alert("Error, monto mayor a 999")
                      return
                    }
                    alert("¡Captura confirmada!")
                    limpiarCarrito()
                  }}
                />

                <div className="cart-liberar-wrapper">
                  <ButtonLiberar
                    onClick={() => {
                      if (
                        window.confirm(
                          "¿Estás seguro de que quieres liberar todos los Pokémon?",
                        )
                      ) {
                        limpiarCarrito()
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default CartScreen
