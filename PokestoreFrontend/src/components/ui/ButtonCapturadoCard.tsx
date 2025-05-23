import React from "react"

interface ButtonCapturadoCardProps {
  captured: boolean
  onClick?: () => void
}

const ButtonCapturadoCard: React.FC<ButtonCapturadoCardProps> = ({
  captured,
  onClick,
}) => (
  <button
    className={`btn ${captured ? "btn-capturado" : "btn-atrapar"} btn-small`}
    onClick={(e) => {
      e.stopPropagation()
      onClick?.()
    }}
  >
    {captured ? "Capturado" : "Atrapar"}
  </button>
)

export default ButtonCapturadoCard
