import React from "react"
import ButtonMas from "./ui/ButtonMas"
import ButtonMenos from "./ui/ButtonMenos"
import ButtonBasura from "./ui/ButtonBasura"

interface CardCarritoProps {
  name: string
  price: number
  originalPrice?: number
  img: string
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
  onRemove: () => void
}

const CardCarrito: React.FC<CardCarritoProps> = ({
  name,
  price,
  originalPrice,
  img,
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
}) => (
  <div className="card-carrito">
    <img src={img} alt={name} className="card-carrito__img" />
    <div className="card-carrito__info">
      <p className="card-carrito__price">
        {originalPrice && originalPrice !== price && (
          <span
            style={{
              textDecoration: "line-through",
              color: "#888",
              marginRight: 6,
            }}
          >
            ${originalPrice}
          </span>
        )}
        ${price}
      </p>
      <h3 className="card-carrito__name">{name}</h3>
    </div>
    <div className="card-carrito__controls">
      <ButtonMenos onClick={onDecrease} disabled={quantity <= 1} />
      <span className="card-carrito__quantity">{quantity}</span>
      <ButtonMas onClick={onIncrease} disabled={quantity >= 9} />
      <ButtonBasura onClick={onRemove} />
    </div>
  </div>
)

export default CardCarrito
