import React from "react"

interface ButtonCapturadoDetallesProps {
  captured: boolean
  fullWidth?: boolean
  onClick?: () => void
}

const ButtonCapturadoDetalles: React.FC<ButtonCapturadoDetallesProps> = ({
  captured,
  fullWidth = false,
  onClick,
}) => (
  <button
    className={`btn ${captured ? "btn-capturado" : "btn-atrapar"} btn-large ${fullWidth ? "btn-block" : ""}`}
    onClick={onClick}
  >
    {captured ? "Capturado" : "Atrapar"}
  </button>
)

export default ButtonCapturadoDetalles
