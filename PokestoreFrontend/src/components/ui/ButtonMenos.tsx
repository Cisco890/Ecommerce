import React from "react";

interface ButtonMenosProps {
  onClick?: () => void;
  disabled?: boolean;
}

const ButtonMenos: React.FC<ButtonMenosProps> = ({ onClick, disabled }) => (
  <button
    className="btn-menos"
    onClick={onClick}
    disabled={disabled}
    aria-label="Disminuir cantidad"
  >
    −
  </button>
);

export default ButtonMenos;
