const BASE_URL = "https://pokeapi.co/api/v2"

// Interfaces adicionales para los detalles
export interface PokemonDetail {
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

export interface Evolution {
  id: number
  name: string
  price: number
  img: string
  evolutionStage: "primera" | "segunda" | "tercera" | "legendario"
}
function extractIdFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/$/)
  return match ? parseInt(match[1], 10) : 0
}
// Lista de Pokémon legendarios (ya la tienes en tu código, pero aquí está por completitud)
const legendaryPokemonIds = new Set([
  144,
  145,
  146,
  150,
  151, // Gen 1
  243,
  244,
  245,
  249,
  250,
  251, // Gen 2
  377,
  378,
  379,
  380,
  381,
  382,
  383,
  384,
  385,
  386, // Gen 3
  480,
  481,
  482,
  483,
  484,
  485,
  486,
  487,
  488,
  489,
  490,
  491,
  492,
  493, // Gen 4
  494,
  638,
  639,
  640,
  641,
  642,
  643,
  644,
  645,
  646,
  647,
  648,
  649, // Gen 5
  716,
  717,
  718,
  719,
  720,
  721, // Gen 6
  772,
  773,
  785,
  786,
  787,
  788,
  789,
  790,
  791,
  792,
  800,
  801,
  802,
  807,
  808,
  809, // Gen 7
  888,
  889,
  890,
  891,
  892,
  893,
  894,
  895,
  896,
  897,
  898, // Gen 8
  905,
  1007,
  1008,
  1009,
  1010, // Gen 9
])

/**
 * Calcula el costo basado en la etapa evolutiva
 */
function calculateCost(
  stage: "primera" | "segunda" | "tercera" | "legendario",
): number {
  switch (stage) {
    case "primera":
      return 50
    case "segunda":
      return 100
    case "tercera":
      return 150
    case "legendario":
      return 200
    default:
      return 50
  }
}

/**
 * Obtiene información detallada de un Pokémon por nombre
 */
export async function fetchPokemonDetailByName(
  pokemonName: string,
): Promise<PokemonDetail | null> {
  try {
    // Obtener datos básicos del Pokémon
    const pokemonRes = await fetch(
      `${BASE_URL}/pokemon/${pokemonName.toLowerCase()}`,
    )
    if (!pokemonRes.ok) return null
    const pokemonData = await pokemonRes.json()

    // Obtener información de la especie para descripción
    const speciesRes = await fetch(
      `${BASE_URL}/pokemon-species/${pokemonData.id}`,
    )
    if (!speciesRes.ok) return null
    const speciesData = await speciesRes.json()
    /* eslint-disable @typescript-eslint/no-explicit-any */

    // Determinar etapa evolutiva
    let evolutionStage: "primera" | "segunda" | "tercera" | "legendario" =
      "primera"
    if (legendaryPokemonIds.has(pokemonData.id)) {
      evolutionStage = "legendario"
    } else if (speciesData.evolution_chain?.url) {
      try {
        const evolutionRes = await fetch(speciesData.evolution_chain.url)
        if (evolutionRes.ok) {
          const evolutionData = await evolutionRes.json()

          function findPokemonInChain(
            chain: any,
            targetId: number,
            level: number = 1,
          ): number {
            const currentId = extractIdFromUrl(chain.species.url)
            if (currentId === targetId) return level

            for (const evolution of chain.evolves_to || []) {
              const result = findPokemonInChain(evolution, targetId, level + 1)
              if (result > 0) return result
            }
            return 0
          }

          const evolutionLevel = findPokemonInChain(
            evolutionData.chain,
            pokemonData.id,
          )
          switch (evolutionLevel) {
            case 2:
              evolutionStage = "segunda"
              break
            case 3:
              evolutionStage = "tercera"
              break
            default:
              evolutionStage = "primera"
          }
        }
      } catch (error) {
        console.warn("Error obteniendo cadena evolutiva:", error)
      }
    }

    // Encontrar descripción en español (o inglés como fallback)
    const description =
      speciesData.flavor_text_entries.find(
        (entry: any) => entry.language.name === "es",
      )?.flavor_text ||
      speciesData.flavor_text_entries.find(
        (entry: any) => entry.language.name === "en",
      )?.flavor_text ||
      "Descripción no disponible"

    // Formatear tipos
    const types = pokemonData.types
      .map((t: any) => {
        const typeNames: Record<string, string> = {
          normal: "Normal",
          fire: "Fuego",
          water: "Agua",
          electric: "Eléctrico",
          grass: "Planta",
          ice: "Hielo",
          fighting: "Lucha",
          poison: "Veneno",
          ground: "Tierra",
          flying: "Volador",
          psychic: "Psíquico",
          bug: "Bicho",
          rock: "Roca",
          ghost: "Fantasma",
          dragon: "Dragón",
          dark: "Siniestro",
          steel: "Acero",
          fairy: "Hada",
        }
        return typeNames[t.type.name] || t.type.name
      })
      .join(" ")

    return {
      id: pokemonData.id,
      name:
        pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1),
      price: calculateCost(evolutionStage),
      img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.id}.png`,
      description: description
        .replace(/\f/g, "\n")
        .replace(/\u00ad\n/g, "")
        .replace(/\u00ad/g, "")
        .replace(/\n/g, " "),
      type: types,
      weight: `${pokemonData.weight / 10} kg`,
      height: `${pokemonData.height / 10} m`,
      stats: {
        Ataque:
          pokemonData.stats.find((s: any) => s.stat.name === "attack")
            ?.base_stat || 0,
        Defensa:
          pokemonData.stats.find((s: any) => s.stat.name === "defense")
            ?.base_stat || 0,
        Resistencia:
          pokemonData.stats.find((s: any) => s.stat.name === "hp")?.base_stat ||
          0,
      },
    }
  } catch (error) {
    console.error("Error fetching Pokemon details:", error)
    return null
  }
}

/**
 * Obtiene las evoluciones de un Pokémon por nombre
 */
export async function fetchPokemonEvolutionsByName(
  pokemonName: string,
): Promise<Evolution[]> {
  try {
    // Obtener datos básicos para conseguir la especie
    const pokemonRes = await fetch(
      `${BASE_URL}/pokemon/${pokemonName.toLowerCase()}`,
    )
    if (!pokemonRes.ok) return []
    const pokemonData = await pokemonRes.json()

    // Obtener información de la especie
    const speciesRes = await fetch(
      `${BASE_URL}/pokemon-species/${pokemonData.id}`,
    )
    if (!speciesRes.ok) return []
    const speciesData = await speciesRes.json()

    if (!speciesData.evolution_chain?.url) return []

    // Obtener cadena evolutiva
    const evolutionRes = await fetch(speciesData.evolution_chain.url)
    if (!evolutionRes.ok) return []
    const evolutionData = await evolutionRes.json()

    // Extraer todas las evoluciones
    const evolutions: Evolution[] = []

    function extractEvolutions(chain: any, level: number = 1) {
      const id = extractIdFromUrl(chain.species.url)
      const name = chain.species.name

      // Solo agregar si no es el Pokémon actual
      if (name.toLowerCase() !== pokemonName.toLowerCase()) {
        let evolutionStage: "primera" | "segunda" | "tercera" | "legendario" =
          "primera"

        if (legendaryPokemonIds.has(id)) {
          evolutionStage = "legendario"
        } else {
          switch (level) {
            case 2:
              evolutionStage = "segunda"
              break
            case 3:
              evolutionStage = "tercera"
              break
            default:
              evolutionStage = "primera"
          }
        }

        evolutions.push({
          id,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          price: calculateCost(evolutionStage),
          img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
          evolutionStage,
        })
      }

      // Procesar evoluciones siguientes
      for (const evolution of chain.evolves_to || []) {
        extractEvolutions(evolution, level + 1)
      }
    }

    extractEvolutions(evolutionData.chain)
    return evolutions
  } catch (error) {
    console.error("Error fetching evolutions:", error)
    return []
  }
}
