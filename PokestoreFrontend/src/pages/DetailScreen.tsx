// src/pages/DetailScreen.tsx
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
import { useEstrellaRefsContext } from "../hooks/EstrellaRefsContext"
import "./DetailScreen.css" // Importamos el CSS responsive

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

  const { agregarAlCarrito, removerDelCarrito, estaEnCarrito, totalItems } =
    useContextCarrito()
  const { isLiked, toggleLike } = useLikeRefsContext()
  const { getRating, setRating } = useEstrellaRefsContext()

  // <-- Eliminamos este useEffect para no bloquear el scroll:
  // useEffect(() => {
  //   document.body.style.overflow = "hidden";
  //   return () => {
  //     document.body.style.overflow = "auto";
  //   };
  // }, []);

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

  const toggleEvolutionCapture = (evo: Evolution) => {
    if (estaEnCarrito(evo.id)) {
      removerDelCarrito(evo.id)
    } else {
      const pokemonParaCarrito = {
        id: evo.id,
        name: evo.name,
        price: evo.price,
        img: evo.img,
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
        <main className="detail-loading">
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
        <main className="detail-loading">
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

      <main className="detail-content">
        {/* Bloque superior: Imagen + detalles */}
        <div className="detail-top">
          <img
            src={pokemonDetail.img}
            alt={pokemonDetail.name}
            className="detail-image"
            onError={(e) => {
              ;(e.target as HTMLImageElement).src =
                `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonDetail.id}.png`
            }}
          />

          <div className="detail-info">
            <h1>
              {pokemonDetail.name} — ${pokemonDetail.price}
            </h1>
            <p className="detail-desc">{pokemonDetail.description}</p>
            <p>
              <strong>Tipo:</strong> {pokemonDetail.type}
            </p>
            <p>
              <strong>Peso:</strong> {pokemonDetail.weight} &nbsp;
              <strong>Altura:</strong> {pokemonDetail.height}
            </p>
            <p className="detail-stats">
              <strong>Ataque:</strong> {pokemonDetail.stats.Ataque} &nbsp;
              <strong>Defensa:</strong> {pokemonDetail.stats.Defensa} &nbsp;
              <strong>Resistencia:</strong> {pokemonDetail.stats.Resistencia}
            </p>
            <div className="detail-actions">
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
        <div className="capture-button-wrapper">
          <ButtonCapturadoDetalles
            captured={estaEnCarrito(pokemonDetail.id)}
            fullWidth
            onClick={toggleMainPokemonCapture}
          />
        </div>

        {/* Evoluciones */}
        <section className="evolutions-section">
          <h3>Evoluciones</h3>
          {evolutions.length === 0 ? (
            <p>Pokémon en su única forma</p>
          ) : (
            <div className="evolutions-container">
              {evolutions.map((evo) => (
                <div
                  key={evo.name}
                  className="evolution-item"
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
                    onToggle={() => toggleEvolutionCapture(evo)}
                  />
                  <div style={{ height: 40 }} /> {/* espacio para el botón */}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default DetailScreen
