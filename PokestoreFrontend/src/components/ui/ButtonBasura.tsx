import React from "react";

interface ButtonBasuraProps {
  onClick?: () => void;
}

const ButtonBasura: React.FC<ButtonBasuraProps> = ({ onClick }) => (
  <button
    className="btn-basura"
    onClick={onClick}
    aria-label="Eliminar artículo"
  >
    🗑️
  </button>
);

export default ButtonBasura;
