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
import "../index.css"
import "../app.css"

const POKEMON_PER_PAGE = 6

const MainScreen: React.FC = () => {
  const navigate = useNavigate()
  const [sections, setSections] = useState<GenerationPokemon[]>([])
  const [captured, setCaptured] = useState<boolean[][]>([])
  const [currentPages, setCurrentPages] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchPokemonByGeneration()
      .then((data: GenerationPokemon[]) => {
        setSections(data)
        // Inicializa capturas para todos los pokémon
        setCaptured(data.map((gen) => gen.pokemons.map(() => false)))
        // Inicializa todas las páginas en 0 (primeros pokémon)
        setCurrentPages(data.map(() => 0))
      })
      .catch((error) => {
        console.error("Error cargando Pokémon:", error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const toggle = (sec: number, globalIdx: number) => {
    setCaptured((prev) => {
      const next = prev.map((arr) => [...arr])
      next[sec][globalIdx] = !next[sec][globalIdx]
      return next
    })
  }

  const goToPreviousPage = (generationIndex: number) => {
    setCurrentPages((prev) => {
      const newPages = [...prev]
      if (newPages[generationIndex] > 0) {
        newPages[generationIndex]--
      }
      return newPages
    })
  }

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

  const getPokemonForCurrentPage = (
    generation: GenerationPokemon,
    pageIndex: number,
  ) => {
    const start = pageIndex * POKEMON_PER_PAGE
    const end = start + POKEMON_PER_PAGE
    return generation.pokemons.slice(start, end)
  }

  const getTotalCapturedCount = () => {
    return captured.flat().filter(Boolean).length
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.5rem",
        }}
      >
        Cargando Pokémon...
      </div>
    )
  }

  if (!sections.length) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.5rem",
        }}
      >
        Cargando Pokémon...
      </div>
    )
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
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <ButtonMain />
        <input
          type="search"
          placeholder="Buscar..."
          style={{
            borderRadius: 9999,
            border: "none",
            padding: "0.5rem 1rem",
            width: 300,
          }}
        />
        <ButtonCarrito count={getTotalCapturedCount()} />
      </header>

      <main style={{ padding: "2rem", position: "relative" }}>
        {sections.map((gen, sidx) => {
          const currentPage = currentPages[sidx] || 0
          const currentPokemon = getPokemonForCurrentPage(gen, currentPage)
          const totalPages = Math.ceil(gen.pokemons.length / POKEMON_PER_PAGE)

          return (
            <section key={gen.generation} style={{ marginBottom: "3rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              ></div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2rem",
                  position: "relative",
                  width: "100%",
                }}
              >
                <ButtonLeft onClick={() => goToPreviousPage(sidx)} />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(6, 1fr)",
                    gap: "1rem",
                    width: "100%",
                    maxWidth: "1400px",
                    minHeight: "200px", // Para mantener altura consistente
                  }}
                >
                  <div style={{ gridColumn: "1 / -1", marginBottom: "0.5rem" }}>
                    <h2 style={{ margin: 0 }}>{gen.generation}</h2>
                  </div>

                  {currentPokemon.map((p, localIdx) => {
                    const globalIdx = currentPage * POKEMON_PER_PAGE + localIdx
                    return (
                      <div
                        key={p.id}
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/pokemon/${p.id}`)}
                      >
                        <Card
                          name={p.name}
                          price={p.cost}
                          img={p.sprite}
                          captured={captured[sidx]?.[globalIdx] || false}
                          onToggle={() => toggle(sidx, globalIdx)}
                        />
                      </div>
                    )
                  })}

                  {/* Espacios vacíos para mantener el grid consistente */}
                  {Array.from({
                    length: POKEMON_PER_PAGE - currentPokemon.length,
                  }).map((_, idx) => (
                    <div key={`empty-${idx}`} style={{ minHeight: "200px" }} />
                  ))}
                </div>

                <ButtonRight onClick={() => goToNextPage(sidx)} />
              </div>

              {/* Indicador de páginas */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "0.5rem",
                  marginTop: "1rem",
                }}
              >
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
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      border: "none",
                      backgroundColor:
                        pageIdx === currentPage ? "#f55151" : "#ccc",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
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
