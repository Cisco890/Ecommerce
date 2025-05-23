import React from "react"
import ButtonCapturadoCard from "./ui/ButtonCapturadoCard"

export interface CardProps {
  name: string
  price: number
  img: string
  captured: boolean
  onToggle: () => void
}

const Card: React.FC<CardProps> = ({
  name,
  price,
  img,
  captured,
  onToggle,
}) => (
  <div
    style={{
      width: 200,
      background: "#fff",
      borderRadius: 8,
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      overflow: "hidden",
      textAlign: "center",
    }}
  >
    <img src={img} alt={name} style={{ width: "100%", display: "block" }} />
    <div style={{ padding: "1rem" }}>
      <p>${price}</p>
      <h3>{name}</h3>
      <ButtonCapturadoCard captured={captured} onClick={onToggle} />
    </div>
  </div>
)

export default Card
