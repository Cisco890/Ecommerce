import React from "react"
import rightarrow from "../../assets/rightarrow.png"

interface ButtonRightProps {
  onClick?: () => void
}

const ButtonRight: React.FC<ButtonRightProps> = ({ onClick }) => (
  <button
    className="btn-nav btn-right"
    onClick={onClick}
    aria-label="Siguiente"
  >
    <img src={rightarrow} alt="Siguiente" />
  </button>
)

export default ButtonRight
