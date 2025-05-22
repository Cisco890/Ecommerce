import React from "react";

interface ButtonConfirmarCapturaProps {
  onClick?: () => void;
}

const ButtonConfirmarCaptura: React.FC<ButtonConfirmarCapturaProps> = ({
  onClick,
}) => (
  <button className="btn-confirmar-captura" onClick={onClick}>
    Confirmar Captura
  </button>
);

export default ButtonConfirmarCaptura;
