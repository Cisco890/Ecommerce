import React from "react"

interface ButtonRightProps {
  onClick?: () => void
}

const ButtonRight: React.FC<ButtonRightProps> = ({ onClick }) => (
  <button
    className="btn-nav btn-right"
    onClick={onClick}
    aria-label="Siguiente"
  >
    <span>→</span>
  </button>
)

export default ButtonRight
