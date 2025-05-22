import React from "react";

interface ButtonMasProps {
  onClick?: () => void;
  disabled?: boolean;
}

const ButtonMas: React.FC<ButtonMasProps> = ({ onClick, disabled }) => (
  <button
    className="btn-mas"
    onClick={onClick}
    disabled={disabled}
    aria-label="Aumentar cantidad"
  >
    +
  </button>
);

export default ButtonMas;
