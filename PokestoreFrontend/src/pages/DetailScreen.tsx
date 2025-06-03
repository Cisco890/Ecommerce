import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ButtonMain from "../components/ui/ButtonMain"
import ButtonCarrito from "../components/ui/ButtonCarrito"
import ButtonCapturadoDetalles from "../components/ui/ButtonCapturadoDetalles"
import ButtonLike from "../components/ui/ButtonLike"
import ButtonEstrella from "../components/ui/ButtonEstrella"
import Card from "../components/Card"
import {
  fetchPokemonDetailByName,
  fetchPokemonEvolutionsByName,
} from "../services/api/apidetails"
import { useContextCarrito } from "../hooks/useContextCarrito"
import { useLikeRefsContext } from "../hooks/LikeRefsContext"
import { useEstrellaRefsContext } from "../hooks/EstrellaRefsContext" // <-- Importa el contexto de estrella
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

  // Usar el contexto del carrito
  const { agregarAlCarrito, removerDelCarrito, estaEnCarrito, totalItems } =
    useContextCarrito()

  // Usar el contexto global de likes
  const { isLiked, toggleLike } = useLikeRefsContext()

  // Usar el contexto global de estrellas
  const { getRating, setRating } = useEstrellaRefsContext()

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
      } catch (err) {
        setError("Error al cargar los datos del Pokémon")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadPokemonData()
  }, [name])

  // Función para manejar captura del Pokémon principal
  const toggleMainPokemonCapture = () => {
    if (!pokemonDetail) return

    if (estaEnCarrito(pokemonDetail.id)) {
      removerDelCarrito(pokemonDetail.id)
    } else {
      const pokemonParaCarrito = {
        id: pokemonDetail.id,
        name: pokemonDetail.name,
        price: pokemonDetail.price,
        img: pokemonDetail.img,
      }
      agregarAlCarrito(pokemonParaCarrito)
    }
  }

  // Función para manejar captura de evoluciones
  const toggleEvolutionCapture = (evolution: Evolution) => {
    if (estaEnCarrito(evolution.id)) {
      removerDelCarrito(evolution.id)
    } else {
      const pokemonParaCarrito = {
        id: evolution.id,
        name: evolution.name,
        price: evolution.price,
        img: evolution.img,
      }
      agregarAlCarrito(pokemonParaCarrito)
    }
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
          <ButtonCarrito count={totalItems} />
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
          <ButtonCarrito count={totalItems} />
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
        <ButtonCarrito count={totalItems} />
      </header>

      <main style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: "2rem", position: "relative" }}>
          <img
            src={pokemonDetail.img}
            alt={pokemonDetail.name}
            style={{ width: 250 }}
            onError={(e) => {
              ;(e.target as HTMLImageElement).src =
                `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonDetail.id}.png`
            }}
          />
          <div style={{ textAlign: "left", flex: 1, position: "relative" }}>
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
            {/* Botón Like y Estrella justo debajo de los stats */}
            <div
              style={{
                margin: "1rem 0",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <ButtonLike
                size="large"
                liked={isLiked(pokemonDetail.id)}
                onToggle={() => toggleLike(pokemonDetail.id)}
              />
              <ButtonEstrella
                rating={getRating(pokemonDetail.id)}
                onRatingChange={(rating) => setRating(pokemonDetail.id, rating)}
              />
            </div>
          </div>
        </div>

        {/* Botón Capturar */}
        <ButtonCapturadoDetalles
          captured={estaEnCarrito(pokemonDetail.id)}
          fullWidth
          onClick={toggleMainPokemonCapture}
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
              {evolutions.map((evo) => (
                <div
                  key={evo.name}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    minWidth: 200, // Mantiene el tamaño de la card
                    maxWidth: 220,
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/pokemon/${evo.name.toLowerCase()}`)
                  }}
                >
                  <Card
                    name={evo.name}
                    price={evo.price}
                    img={evo.img}
                    captured={estaEnCarrito(evo.id)}
                    onToggle={() => {
                      toggleEvolutionCapture(evo)
                    }}
                  />
                  {/* Botones de like y estrella eliminados */}
                  <div style={{ height: 40 }} />{" "}
                  {/* Espacio para mantener altura */}
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
