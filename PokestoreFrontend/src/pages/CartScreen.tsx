import React from "react"
import { useContextCarrito } from "../hooks/useContextCarrito"
import ButtonMain from "../components/ui/ButtonMain"
import ButtonCarrito from "../components/ui/ButtonCarrito"
import CardCarrito from "../components/CardCartito"
import ButtonConfirmarCaptura from "../components/ui/ButtonConfirmarCaptura"
import ButtonLiberar from "../components/ui/ButtonLiberar"
import useMemoTotal from "../hooks/useMemoTotal"
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

  return (
    <div>
      {/* Header igual al de MainScreen */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f55151",
          padding: "1rem",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <ButtonMain />

        <ButtonCarrito count={totalItems} />
      </header>

      {/* Main content */}
      <main style={{ padding: "2rem", position: "relative" }}>
        <section style={{ marginBottom: "3rem" }}>
          {/* Título de la sección */}
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ margin: 0, fontSize: "2rem" }}>Carrito de Compras</h2>
          </div>

          {/* Grid container igual al de MainScreen */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "2rem",
              position: "relative",
              width: "100%",
            }}
          >
            {/* Grid de productos */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                gap: "1rem",
                width: "100%",
                maxWidth: "1400px",
                minHeight: "200px",
              }}
            >
              {cart.length === 0 ? (
                // Mensaje cuando el carrito está vacío
                <div
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: "3rem",
                    fontSize: "1.2rem",
                    color: "#666",
                  }}
                >
                  <p>Tu carrito está vacío</p>
                  <p style={{ fontSize: "1rem", marginTop: "0.5rem" }}>
                    ¡Atrapa algunos Pokémon para empezar tu aventura!
                  </p>
                </div>
              ) : (
                // Cards del carrito
                cart.map((item) => (
                  <div key={item.id}>
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
                ))
              )}

              {cart.length > 0 &&
                cart.length % 6 !== 0 &&
                Array.from({
                  length: 6 - (cart.length % 6),
                }).map((_, idx) => (
                  <div key={`empty-${idx}`} style={{ minHeight: "200px" }} />
                ))}
            </div>
          </div>

          {/* Resumen del carrito */}
          {cart.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "2rem",
              }}
            >
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  textAlign: "center",
                  maxWidth: "400px",
                  width: "100%",
                }}
              >
                <h3 style={{ margin: "0 0 1rem 0", color: "#333" }}>
                  Resumen de Captura
                </h3>
                <div style={{ marginBottom: "1rem" }}>
                  <p style={{ margin: "0.5rem 0", fontSize: "1.1rem" }}>
                    <strong>Pokémon capturados:</strong> {totalItems}
                  </p>
                  <p
                    style={{
                      margin: "0.5rem 0",
                      fontSize: "1.3rem",
                      color: "#f55151",
                    }}
                  >
                    <strong>Total a pagar:</strong> ${totalPrice}
                  </p>
                </div>

                <ButtonConfirmarCaptura
                  onClick={() => {
                    // Validar que el monto no sea mayor a 999
                    if (totalPrice > 999) {
                      alert("Error, monto mayor a 999")
                      return
                    }
                    alert("¡Captura confirmada!")
                    limpiarCarrito()
                  }}
                />

                {/* Botón Liberar Pokémon */}
                <div style={{ marginTop: "1rem" }}>
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
