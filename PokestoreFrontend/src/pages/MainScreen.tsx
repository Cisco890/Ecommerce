// src/pages/MainScreen.tsx
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ButtonMain from "../components/ui/ButtonMain"
import ButtonCarrito from "../components/ui/ButtonCarrito"
import ButtonLeft from "../components/ui/ButtonLeft"
import ButtonRight from "../components/ui/ButtonRight"
import Card from "../components/Card"
import { fetchPokemonByGeneration } from "../services/api/apimain"
import type { GenerationPokemon } from "../services/api/apimain"
import { useContextCarrito } from "../hooks/useContextCarrito"
import "./MainScreen.css" // Conservamos las clases para el resto del layout

const POKEMON_PER_PAGE = 6

const MainScreen: React.FC = () => {
  const navigate = useNavigate()
  const [sections, setSections] = useState<GenerationPokemon[]>([])
  const [currentPages, setCurrentPages] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  // Contexto del carrito
  const { agregarAlCarrito, removerDelCarrito, estaEnCarrito, totalItems } =
    useContextCarrito()

  useEffect(() => {
    setLoading(true)
    fetchPokemonByGeneration()
      .then((data: GenerationPokemon[]) => {
        setSections(data)
        setCurrentPages(data.map(() => 0))
      })
      .catch((error) => {
        console.error("Error cargando Pokémon:", error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // Alterna captura/liberación
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toggleCapture = (pokemon: any) => {
    if (estaEnCarrito(pokemon.id)) {
      removerDelCarrito(pokemon.id)
    } else {
      const pokemonParaCarrito = {
        id: pokemon.id,
        name: pokemon.name,
        price: pokemon.cost || 50,
        img: pokemon.sprite,
      }
      agregarAlCarrito(pokemonParaCarrito)
    }
  }

  // Retroceder página dentro de la generación
  const goToPreviousPage = (generationIndex: number) => {
    setCurrentPages((prev) => {
      const newPages = [...prev]
      if (newPages[generationIndex] > 0) {
        newPages[generationIndex]--
      }
      return newPages
    })
  }

  // Avanzar página dentro de la generación
  const goToNextPage = (generationIndex: number) => {
    const generation = sections[generationIndex]
    const maxPages = Math.ceil(generation.pokemons.length / POKEMON_PER_PAGE)

    setCurrentPages((prev) => {
      const newPages = [...prev]
      if (newPages[generationIndex] < maxPages - 1) {
        newPages[generationIndex]++
      }
      return newPages
    })
  }

  // Obtener los pokémon que corresponden a la página activa
  const getPokemonForCurrentPage = (
    generation: GenerationPokemon,
    pageIndex: number,
  ) => {
    const start = pageIndex * POKEMON_PER_PAGE
    const end = start + POKEMON_PER_PAGE
    return generation.pokemons.slice(start, end)
  }

  // Estilos inline para el header (igual que en DetailScreen)
  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f55151",
    padding: "1rem",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  }

  if (loading) {
    return (
      <div>
        <header style={headerStyle}>
          <ButtonMain />
          <ButtonCarrito count={totalItems} />
        </header>
        <main
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            fontSize: "1.5rem",
          }}
        >
          Cargando Pokémon...
        </main>
      </div>
    )
  }

  if (!sections.length) {
    return (
      <div>
        <header style={headerStyle}>
          <ButtonMain />
          <ButtonCarrito count={totalItems} />
        </header>
        <main
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            fontSize: "1.5rem",
          }}
        >
          Cargando Pokémon...
        </main>
      </div>
    )
  }

  return (
    <div>
      {/* ========== HEADER PRINCIPAL ========== */}
      <header style={headerStyle}>
        <ButtonMain />
        <ButtonCarrito count={totalItems} />
      </header>

      {/* ========== CONTENIDO PRINCIPAL ========== */}
      <main className="main-content">
        {sections.map((gen, sidx) => {
          const currentPage = currentPages[sidx] || 0
          const currentPokemon = getPokemonForCurrentPage(gen, currentPage)
          const totalPages = Math.ceil(gen.pokemons.length / POKEMON_PER_PAGE)

          return (
            <section key={gen.generation} className="gen-section">
              {/* 1) TÍTULO DE GENERACIÓN (FUERA DEL GRID) */}
              <h2 className="gen-heading">{gen.generation}</h2>

              {/* 2) SLIDER CON TARJETAS */}
              <div className="slider-container">
                <ButtonLeft onClick={() => goToPreviousPage(sidx)} />

                <div className="pokemon-grid">
                  {currentPokemon.map((p) => (
                    <div
                      key={p.id}
                      className="card-wrapper"
                      onClick={() => navigate(`/pokemon/${p.id}`)}
                    >
                      <Card
                        name={p.name}
                        price={p.cost}
                        img={p.sprite}
                        captured={estaEnCarrito(p.id)}
                        onToggle={() => toggleCapture(p)}
                      />
                    </div>
                  ))}

                  {/* Espacios vacíos para mantener el grid consistente */}
                  {Array.from({
                    length: POKEMON_PER_PAGE - currentPokemon.length,
                  }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="empty-card" />
                  ))}
                </div>

                <ButtonRight onClick={() => goToNextPage(sidx)} />
              </div>

              {/* 3) INDICADOR DE PÁGINAS */}
              <div className="page-indicator">
                {Array.from({ length: totalPages }).map((_, pageIdx) => (
                  <button
                    key={pageIdx}
                    onClick={() =>
                      setCurrentPages((prev) => {
                        const newPages = [...prev]
                        newPages[sidx] = pageIdx
                        return newPages
                      })
                    }
                    className={pageIdx === currentPage ? "dot active" : "dot"}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </main>
    </div>
  )
}

export default MainScreen
