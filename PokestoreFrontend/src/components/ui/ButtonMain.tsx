import React from "react"
import { useNavigate } from "react-router-dom"

interface ButtonMainProps {
  onClick?: () => void
}

const ButtonMain: React.FC<ButtonMainProps> = ({ onClick }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate("/") // navega a MainScreen
    onClick?.() // y ejecuta callback si existe
  }

  return (
    <button className="btn-main" onClick={handleClick}>
      PokeStore
    </button>
  )
}

export default ButtonMain
