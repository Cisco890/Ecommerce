import React from "react"
import leftarrow from "../../assets/leftarrow.png"

interface ButtonLeftProps {
  onClick?: () => void
}

const ButtonLeft: React.FC<ButtonLeftProps> = ({ onClick }) => (
  <button className="btn-nav btn-left" onClick={onClick} aria-label="Anterior">
    <img src={leftarrow} alt="Anterior" />
  </button>
)

export default ButtonLeft
