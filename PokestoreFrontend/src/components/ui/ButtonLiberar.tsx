import React from "react"

interface ButtonLiberarProps {
  onClick?: () => void
}

const ButtonLiberar: React.FC<ButtonLiberarProps> = ({ onClick }) => (
  <button className="btn-liberar" onClick={onClick}>
    Liberar Pókemon
  </button>
)

export default ButtonLiberar
