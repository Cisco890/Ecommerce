import React, { useState } from "react";
import { useParams } from "react-router-dom";

import ButtonMain from "../components/ui/ButtonMain";
import ButtonCarrito from "../components/ui/ButtonCarrito";
import ButtonCapturadoDetalles from "../components/ui/ButtonCapturadoDetalles";
import Card from "../components/Card";
import "../index.css";
import "../app.css";

interface Pokemon {
  name: string;
  price: number;
  img: string;
}

// Datos de ejemplo sólo para Bulbasaur
const bulbaDetail = {
  name: "Bulbasaur",
  price: 50,
  img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
  description:
    "Una rara semilla fue plantada en su espalda al nacer. La planta brota y crece con este Pokémon.",
  type: "Planta Veneno",
  weight: "6,9 kg",
  height: "0,7 m",
  stats: { Ataque: 118, Defensa: 111, Resistencia: 128 },
};

// Evoluciones de Bulbasaur
const bulbaEvos: Pokemon[] = [
  {
    name: "Ivysaur",
    price: 100,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png",
  },
  {
    name: "Venusaur",
    price: 150,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png",
  },
];

const DetailScreen: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  // Estado local para Bulbasaur
  const [captured, setCaptured] = useState(false);
  // Estado local para cada evo
  const [evoCaptured, setEvoCaptured] = useState<boolean[]>(
    bulbaEvos.map(() => false)
  );

  const toggleEvo = (idx: number) => {
    setEvoCaptured((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  return (
    <div>
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f55151",
          padding: "1rem",
        }}
      >
        <ButtonMain />
        <input
          type="search"
          placeholder="Buscar..."
          style={{
            borderRadius: "9999px",
            border: "none",
            padding: "0.5rem 1rem",
            width: "300px",
          }}
        />
        <ButtonCarrito count={3} />
      </header>

      {/* Detalle */}
      <main style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>
          <img
            src={bulbaDetail.img}
            alt={bulbaDetail.name}
            style={{ width: 250 }}
          />
          <div style={{ textAlign: "left" }}>
            <h1>
              {bulbaDetail.name} — ${bulbaDetail.price}
            </h1>
            <p>{bulbaDetail.description}</p>
            <p>
              <strong>Tipo:</strong> {bulbaDetail.type}
            </p>
            <p>
              <strong>Peso:</strong> {bulbaDetail.weight} &nbsp;{" "}
              <strong>Altura:</strong> {bulbaDetail.height}
            </p>
            <p>
              <strong>Ataque:</strong> {bulbaDetail.stats.Ataque} &nbsp;{" "}
              <strong>Defensa:</strong> {bulbaDetail.stats.Defensa} &nbsp;{" "}
              <strong>Resistencia:</strong> {bulbaDetail.stats.Resistencia}
            </p>
          </div>
        </div>

        {/* Botón grande full-width */}
        <ButtonCapturadoDetalles
          captured={captured}
          fullWidth
          onClick={() => setCaptured((v) => !v)}
        />

        {/* Evoluciones abajo */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "2rem",
            justifyContent: "center",
          }}
        >
          {bulbaEvos.map((evo, i) => (
            <Card
              key={evo.name}
              name={evo.name}
              price={evo.price}
              img={evo.img}
              captured={evoCaptured[i]}
              onToggle={() => toggleEvo(i)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default DetailScreen;
