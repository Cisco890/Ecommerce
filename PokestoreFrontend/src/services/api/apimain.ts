// src/services/api/apimain.ts

const BASE_URL = "https://pokeapi.co/api/v2"

export interface GenerationPokemon {
  generation: string
  pokemons: {
    id: number
    name: string
    sprite: string
    cost: number
    evolutionStage: "primera" | "segunda" | "tercera" | "legendario"
  }[]
}

const generationNames: Record<string, string> = {
  "generation-i": "Kanto",
  "generation-ii": "Johto",
  "generation-iii": "Hoenn",
  "generation-iv": "Sinnoh",
  "generation-v": "Unova",
  "generation-vi": "Kalos",
  "generation-vii": "Alola",
  "generation-viii": "Galar",
  "generation-ix": "Paldea",
}

// Lista de Pokémon legendarios conocidos (por ID)
const legendaryPokemonIds = new Set<number>([
  // Gen 1
  144, 145, 146, 150, 151,
  // Gen 2
  243, 244, 245, 249, 250, 251,
  // Gen 3
  377, 378, 379, 380, 381, 382, 383, 384, 385, 386,
  // Gen 4
  480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493,
  // Gen 5
  494, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649,
  // Gen 6
  716, 717, 718, 719, 720, 721,
  // Gen 7
  772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 800, 801, 802, 807, 808,
  809,
  // Gen 8
  888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898,
  // Gen 9
  905, 1007, 1008, 1009, 1010,
])

/**
 * Obtiene el listado de generaciones disponibles en la API.
 */
async function fetchGenerationsList(): Promise<
  { name: string; url: string }[]
> {
  const res = await fetch(`${BASE_URL}/generation?limit=100`)
  if (!res.ok) throw new Error(`Error al listar generaciones: ${res.status}`)
  const data = await res.json()
  return data.results
}

/**
 * Para una URL de especie, extrae el ID numérico.
 */
function extractIdFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\//)
  return match ? parseInt(match[1], 10) : 0
}

/**
 * Obtiene información de la cadena evolutiva de un Pokémon
 */
async function getEvolutionStage(
  pokemonId: number,
): Promise<"primera" | "segunda" | "tercera" | "legendario"> {
  // Legendarios directos
  if (legendaryPokemonIds.has(pokemonId)) {
    return "legendario"
  }

  // Obtener información de especie y cadena evolutiva
  const speciesRes = await fetch(`${BASE_URL}/pokemon-species/${pokemonId}`)
  if (!speciesRes.ok) {
    throw new Error(`Error al obtener especie para ID ${pokemonId}`)
  }
  const speciesData = await speciesRes.json()

  const chainUrl = speciesData.evolution_chain?.url
  if (!chainUrl) {
    return "primera"
  }

  const evolutionRes = await fetch(chainUrl)
  if (!evolutionRes.ok) {
    throw new Error(`Error al obtener cadena evolutiva para ID ${pokemonId}`)
  }
  const evolutionData = await evolutionRes.json()

  // Busca profundidad de evolución
  function findLevel(chain: any, targetId: number, level: number = 1): number {
    const currentId = extractIdFromUrl(chain.species.url)
    if (currentId === targetId) return level
    for (const evo of chain.evolves_to || []) {
      const found = findLevel(evo, targetId, level + 1)
      if (found) return found
    }
    return 0
  }

  const level = findLevel(evolutionData.chain, pokemonId)
  if (level === 1) return "primera"
  if (level === 2) return "segunda"
  // Si level >=3 tratamos como tercera fase
  if (level >= 3) return "tercera"

  // Si no se encontró, asumimos primera fase
  return "primera"
}

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
  }
}

/**
 * Descarga todos los Pokémon de cada generación con sprite y costo evolutivo.
 */
export async function fetchPokemonByGeneration(): Promise<GenerationPokemon[]> {
  const gens = await fetchGenerationsList()

  const detailed = await Promise.all(
    gens.map(async (g) => {
      const res = await fetch(g.url)
      if (!res.ok) throw new Error(`Error al obtener generación ${g.name}`)
      return res.json()
    }),
  )

  const result = await Promise.all(
    detailed.map(async (genData: any) => {
      const speciesList: { name: string; url: string }[] =
        genData.pokemon_species || []
      const sorted = speciesList
        .slice()
        .sort((a, b) => extractIdFromUrl(a.url) - extractIdFromUrl(b.url))

      const pokemons = await Promise.all(
        sorted.map(async (ps) => {
          const id = extractIdFromUrl(ps.url)
          const stage = await getEvolutionStage(id)
          const cost = calculateCost(stage)
          return {
            id,
            name: ps.name,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
            cost,
            evolutionStage: stage,
          }
        }),
      )

      return {
        generation: generationNames[genData.name] || genData.name,
        pokemons,
      }
    }),
  )

  // Opcional: ordenar generaciones si lo deseas
  return result
}
