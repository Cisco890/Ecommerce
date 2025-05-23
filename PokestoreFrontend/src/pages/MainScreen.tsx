import React, { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import ButtonMain from "../components/ui/ButtonMain"
import ButtonCarrito from "../components/ui/ButtonCarrito"
import ButtonLeft from "../components/ui/ButtonLeft"
import ButtonRight from "../components/ui/ButtonRight"
import Card from "../components/Card"
import "../index.css"
import "../app.css"

interface Pokemon {
  name: string
  price: number
  img: string
}

// Iniciales y evoluciones para Generaciones 1 y 2
const generations: { title: string; pokemons: Pokemon[] }[] = [
  {
    title: "Primera Generación",
    pokemons: [
      {
        name: "Bulbasaur",
        price: 50,
        img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
      },
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
      {
        name: "Charmander",
        price: 50,
        img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
      },
      {
        name: "Charmeleon",
        price: 100,
        img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png",
      },
      {
        name: "Charizard",
        price: 150,
        img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
      },
      {
        name: "Squirtle",
        price: 50,
        img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
      },
      {
        name: "Wartortle",
        price: 100,
        img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png",
      },
      {
        name: "Blastoise",
        price: 150,
        img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png",
      },
    ],
  },
  {
    title: "Segunda Generación",
    pokemons: [
      {
        name: "Chikorita",
        price: 50,
        img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/152.png",
      },
      {
        name: "Bayleef",
        price: 100,
        img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/153.png",
      },
      {
        name: "Meganium",
        price: 150,
        img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/154.png",
      },
      {
        name: "Cyndaquil",
        price: 50,
        img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/155.png",
      },
      {
        name: "Quilava",
        price: 100,
        img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/156.png",
      },
      {
        name: "Typhlosion",
        price: 150,
        img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/157.png",
      },
      {
        name: "Totodile",
        price: 50,
        img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/158.png",
      },
      {
        name: "Croconaw",
        price: 100,
        img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/159.png",
      },
      {
        name: "Feraligatr",
        price: 150,
        img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/160.png",
      },
    ],
  },
]

const MainScreen: React.FC = () => {
  const navigate = useNavigate()
  const [capturedStates, setCapturedStates] = useState(
    generations.map((gen) => gen.pokemons.map(() => false)),
  )
  const refs = generations.map(() => useRef<HTMLDivElement>(null))

  const toggleCapture = (genIdx: number, idx: number) => {
    setCapturedStates((prev) => {
      const next = prev.map((arr) => [...arr])
      next[genIdx][idx] = !next[genIdx][idx]
      return next
    })
  }

  const scroll = (genIdx: number, offset: number) => {
    const container = refs[genIdx].current
    if (container) container.scrollBy({ left: offset, behavior: "smooth" })
  }

  return (
    <div>
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

      <main style={{ padding: "2rem" }}>
        {generations.map((gen, genIdx) => (
          <section key={gen.title} style={{ marginBottom: "3rem" }}>
            <h2 style={{ marginBottom: "1rem", textAlign: "left" }}>
              {gen.title}
            </h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
              }}
            >
              <ButtonLeft onClick={() => scroll(genIdx, -660)} />

              <div
                ref={refs[genIdx]}
                style={{
                  display: "flex",
                  gap: "1rem",
                  overflowX: "auto",
                  padding: "1rem 0",
                  scrollSnapType: "x mandatory",
                  justifyContent: "flex-start",
                  width: "680px",
                  margin: "0 auto",
                }}
              >
                {gen.pokemons.map((p, i) => (
                  <div
                    key={p.name}
                    style={{ scrollSnapAlign: "center", cursor: "pointer" }}
                    onClick={() => navigate(`/pokemon/${p.name}`)}
                  >
                    <Card
                      name={p.name}
                      price={p.price}
                      img={p.img}
                      captured={capturedStates[genIdx][i]}
                      onToggle={() => toggleCapture(genIdx, i)}
                    />
                  </div>
                ))}
              </div>

              <ButtonRight onClick={() => scroll(genIdx, 660)} />
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}

export default MainScreen
