import React from "react";
import { useNavigate } from "react-router-dom";
import masterball from "../../assets/masterball.png";

interface ButtonCarritoProps {
  onClick?: () => void;
  count?: number;
}

const ButtonCarrito: React.FC<ButtonCarritoProps> = ({ onClick, count }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/cart");
    onClick?.();
  };

  return (
    <button className="btn-carrito" onClick={handleClick}>
      <img src={masterball} alt="Carrito" />
      {typeof count === "number" && (
        <span className="btn-carrito__badge">{count}</span>
      )}
    </button>
  );
};

export default ButtonCarrito;
