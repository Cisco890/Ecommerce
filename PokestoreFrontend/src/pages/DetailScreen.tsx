import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

import ButtonMain from "../components/ui/ButtonMain"
import ButtonCarrito from "../components/ui/ButtonCarrito"
import ButtonCapturadoDetalles from "../components/ui/ButtonCapturadoDetalles"
import Card from "../components/Card"
import {
  fetchPokemonDetailByName,
  fetchPokemonEvolutionsByName,
} from "../services/api/apidetails"
import "../index.css"
import "../app.css"

interface PokemonDetail {
  id: number
  name: string
  price: number
  img: string
  description: string
  type: string
  weight: string
  height: string
  stats: {
    Ataque: number
    Defensa: number
    Resistencia: number
  }
}

interface Evolution {
  id: number
  name: string
  price: number
  img: string
  evolutionStage: "primera" | "segunda" | "tercera" | "legendario"
}

const DetailScreen: React.FC = () => {
  const { name } = useParams<{ name: string }>()
  const navigate = useNavigate()

  const [pokemonDetail, setPokemonDetail] = useState<PokemonDetail | null>(null)
  const [evolutions, setEvolutions] = useState<Evolution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [captured, setCaptured] = useState(false)
  const [evoCaptured, setEvoCaptured] = useState<boolean[]>([])

  // Bloquear scroll al montar
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  useEffect(() => {
    if (!name) return

    const loadPokemonData = async () => {
      setLoading(true)
      setError(null)

      try {
        const detail = await fetchPokemonDetailByName(name)
        if (!detail) {
          setError("Pokémon no encontrado")
          return
        }
        setPokemonDetail(detail)

        const evos = await fetchPokemonEvolutionsByName(name)
        const filtered = evos.filter(
          (evo) => evo.name.toLowerCase() !== detail.name.toLowerCase(),
        )
        setEvolutions(filtered)
        setEvoCaptured(filtered.map(() => false))
      } catch (err) {
        setError("Error al cargar los datos del Pokémon")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadPokemonData()
  }, [name])

  const toggleEvo = (idx: number) => {
    setEvoCaptured((prev) => {
      const next = [...prev]
      next[idx] = !next[idx]
      return next
    })
  }

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f55151",
    padding: "1rem",
    position: "sticky" as const,
    top: 0,
    zIndex: 1000,
  }

  if (loading) {
    return (
      <div>
        <header style={headerStyle}>
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
          <ButtonCarrito count={3} />
        </header>
        <main style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Cargando...</h2>
        </main>
      </div>
    )
  }

  if (error || !pokemonDetail) {
    return (
      <div>
        <header style={headerStyle}>
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
        <main style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Error: {error}</h2>
        </main>
      </div>
    )
  }

  return (
    <div>
      <header style={headerStyle}>
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

      <main style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: "2rem" }}>
          <img
            src={pokemonDetail.img}
            alt={pokemonDetail.name}
            style={{ width: 250 }}
            onError={(e) => {
              ;(e.target as HTMLImageElement).src =
                `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonDetail.id}.png`
            }}
          />
          <div style={{ textAlign: "left" }}>
            <h1>
              {pokemonDetail.name} — ${pokemonDetail.price}
            </h1>
            <p>{pokemonDetail.description}</p>
            <p>
              <strong>Tipo:</strong> {pokemonDetail.type}
            </p>
            <p>
              <strong>Peso:</strong> {pokemonDetail.weight} &nbsp;
              <strong>Altura:</strong> {pokemonDetail.height}
            </p>
            <p>
              <strong>Ataque:</strong> {pokemonDetail.stats.Ataque} &nbsp;
              <strong>Defensa:</strong> {pokemonDetail.stats.Defensa} &nbsp;
              <strong>Resistencia:</strong> {pokemonDetail.stats.Resistencia}
            </p>
          </div>
        </div>

        <ButtonCapturadoDetalles
          captured={captured}
          fullWidth
          onClick={() => setCaptured((v) => !v)}
        />

        {/* Evoluciones */}
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <h3 style={{ marginBottom: "1rem" }}>Evoluciones</h3>
          {evolutions.length === 0 ? (
            <p>Pokémon en su única forma</p>
          ) : (
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {evolutions.map((evo, i) => (
                <div
                  key={evo.name}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/pokemon/${evo.name.toLowerCase()}`)}
                >
                  <Card
                    name={evo.name}
                    price={evo.price}
                    img={evo.img}
                    captured={evoCaptured[i]}
                    onToggle={() => toggleEvo(i)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default DetailScreen
