import React from "react"

interface ButtonLeftProps {
  onClick?: () => void
}

const ButtonLeft: React.FC<ButtonLeftProps> = ({ onClick }) => (
  <button className="btn-nav btn-left" onClick={onClick} aria-label="Anterior">
    <span>←</span>
  </button>
)

export default ButtonLeft
