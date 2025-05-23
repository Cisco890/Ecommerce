import React, { useState } from "react"
import ButtonMain from "../components/ui/ButtonMain"
import ButtonCarrito from "../components/ui/ButtonCarrito"
import CardCarrito from "../components/CardCartito"
import ButtonConfirmarCaptura from "../components/ui/ButtonConfirmarCaptura"
import "../index.css"
import "../app.css"

interface CartItem {
  name: string
  price: number
  img: string
  quantity: number
}

const initialCart: CartItem[] = [
  {
    name: "Chikorita",
    price: 50,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/152.png",
    quantity: 1,
  },
  {
    name: "Bulbasaur",
    price: 50,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    quantity: 1,
  },
  {
    name: "Venusaur",
    price: 150,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png",
    quantity: 1,
  },
]

const CartScreen: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>(initialCart)

  const increase = (idx: number) => {
    setCart((c) =>
      c.map((it, i) =>
        i === idx && it.quantity < 9
          ? { ...it, quantity: it.quantity + 1 }
          : it,
      ),
    )
  }
  const decrease = (idx: number) => {
    setCart((c) =>
      c.map((it, i) =>
        i === idx && it.quantity > 1
          ? { ...it, quantity: it.quantity - 1 }
          : it,
      ),
    )
  }
  const remove = (idx: number) => {
    setCart((c) => c.filter((_, i) => i !== idx))
  }

  const totalItems = cart.reduce((sum, it) => sum + it.quantity, 0)
  const totalPrice = cart.reduce((sum, it) => sum + it.quantity * it.price, 0)

  return (
    <div>
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f55151",
          padding: "1rem",
        }}
      >
        <ButtonMain />
        <input
          type="search"
          placeholder="Buscar..."
          style={{
            borderRadius: "9999px",
            border: "none",
            padding: "0.5rem 1rem",
            width: "300px",
          }}
        />
        <ButtonCarrito count={totalItems} />
      </header>

      {/* Carrito */}
      <main style={{ padding: "2rem", textAlign: "center" }}>
        <h2 style={{ textAlign: "left" }}>Carrito de Compras</h2>

        <div className="cart-container">
          {cart.map((item, i) => (
            <CardCarrito
              key={item.name}
              name={item.name}
              price={item.price}
              img={item.img}
              quantity={item.quantity}
              onIncrease={() => increase(i)}
              onDecrease={() => decrease(i)}
              onRemove={() => remove(i)}
            />
          ))}
        </div>

        {/* Resumen */}
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <p>
            <strong>Cantidad de Pokémon:</strong> {totalItems}
          </p>
          <p>
            <strong>Total:</strong> ${totalPrice}
          </p>
        </div>

        <ButtonConfirmarCaptura onClick={() => alert("¡Captura confirmada!")} />
      </main>
    </div>
  )
}

export default CartScreen
