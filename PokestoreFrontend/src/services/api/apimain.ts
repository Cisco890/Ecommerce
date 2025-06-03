/* eslint-disable @typescript-eslint/no-explicit-any */

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

// Cache global para evoluciones y especies
const evolutionCache = new Map<
  number,
  "primera" | "segunda" | "tercera" | "legendario"
>()
const speciesCache = new Map<string, any>()
const evolutionChainCache = new Map<string, any>()

/**
 * Delay mínimo optimizado
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Fetch optimizado con cache y retry rápido
 */
async function fastFetch(
  url: string,
  cacheMap?: Map<string, any>,
): Promise<any> {
  // Verificar cache si existe
  if (cacheMap && cacheMap.has(url)) {
    return cacheMap.get(url)
  }

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()

    // Guardar en cache si existe
    if (cacheMap) {
      cacheMap.set(url, data)
    }

    return data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  } catch (_error) {
    // Un solo retry rápido
    await delay(200)
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} after retry`)
    }

    const data = await response.json()
    if (cacheMap) {
      cacheMap.set(url, data)
    }

    return data
  }
}

/**
 * Obtiene el listado de generaciones
 */
async function fetchGenerationsList(): Promise<
  { name: string; url: string }[]
> {
  const data = await fastFetch(`${BASE_URL}/generation?limit=100`)
  return data.results
}

/**
 * Extrae ID de URL
 */
function extractIdFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\//)
  return match ? parseInt(match[1], 10) : 0
}

/**
 * Estrategia heurística rápida para determinar etapa evolutiva
 * Basada en patrones de nombres y IDs conocidos
 */
function getEvolutionStageHeuristic(
  pokemonId: number,
  pokemonName: string,
): "primera" | "segunda" | "tercera" | "legendario" {
  // Legendarios conocidos
  if (legendaryPokemonIds.has(pokemonId)) {
    return "legendario"
  }

  // Patrones de nombres que indican evoluciones
  const name = pokemonName.toLowerCase()

  // Terceras evoluciones comunes (por sufijos/prefijos conocidos)
  const thirdStagePatterns = [
    "charizard",
    "blastoise",
    "venusaur",
    "alakazam",
    "machamp",
    "golem",
    "gengar",
    "typhlosion",
    "feraligatr",
    "meganium",
    "crobat",
    "ampharos",
    "bellossom",
    "blaziken",
    "swampert",
    "sceptile",
    "gardevoir",
    "slaking",
    "exploud",
    "infernape",
    "empoleon",
    "torterra",
    "staraptor",
    "luxray",
    "roserade",
    "serperior",
    "emboar",
    "samurott",
    "stoutland",
    "simisage",
    "simisear",
    "simipour",
  ]

  // Segundas evoluciones comunes
  const secondStagePatterns = [
    "charmeleon",
    "wartortle",
    "ivysaur",
    "kakuna",
    "metapod",
    "pidgeotto",
    "quilava",
    "croconaw",
    "bayleef",
    "flaaffy",
    "skiploom",
    "weepinbell",
    "combusken",
    "marshtomp",
    "grovyle",
    "kirlia",
    "vigoroth",
    "loudred",
    "monferno",
    "prinplup",
    "grotle",
    "staravia",
    "luxio",
    "roselia",
  ]

  if (thirdStagePatterns.includes(name)) {
    return "tercera"
  }

  if (secondStagePatterns.includes(name)) {
    return "segunda"
  }

  // Heurística por rango de ID (aproximada)
  // Los iniciales y sus evoluciones suelen seguir patrones
  const mod3 = pokemonId % 3
  if (pokemonId <= 9) {
    // Primeros iniciales de Kanto
    if (mod3 === 1) return "primera"
    if (mod3 === 2) return "segunda"
    if (mod3 === 0) return "tercera"
  }

  // Por defecto, asumimos primera etapa
  return "primera"
}

/**
 * Obtiene etapa evolutiva de forma híbrida (heurística + API selectiva)
 */
async function getEvolutionStage(
  pokemonId: number,
  pokemonName: string,
): Promise<"primera" | "segunda" | "tercera" | "legendario"> {
  // Verificar cache
  if (evolutionCache.has(pokemonId)) {
    return evolutionCache.get(pokemonId)!
  }

  // Usar heurística primero (muy rápido)
  const heuristicStage = getEvolutionStageHeuristic(pokemonId, pokemonName)

  // Para legendarios, confiar en la heurística
  if (heuristicStage === "legendario") {
    evolutionCache.set(pokemonId, "legendario")
    return "legendario"
  }

  // Para casos dudosos o nombres no reconocidos, usar API (selectivamente)
  const shouldUseAPI =
    pokemonName.includes("unknown") ||
    pokemonName.includes("forme") ||
    pokemonId > 800 || // Generaciones nuevas
    heuristicStage === "primera" // Double-check primeras etapas

  if (shouldUseAPI) {
    try {
      // Solo hacer requests para casos específicos
      const speciesData = await fastFetch(
        `${BASE_URL}/pokemon-species/${pokemonId}`,
        speciesCache,
      )

      const chainUrl = speciesData.evolution_chain?.url
      if (!chainUrl) {
        evolutionCache.set(pokemonId, "primera")
        return "primera"
      }

      const evolutionData = await fastFetch(chainUrl, evolutionChainCache)

      // Función optimizada para encontrar nivel
      function findLevel(
        chain: any,
        targetId: number,
        level: number = 1,
      ): number {
        const currentId = extractIdFromUrl(chain.species.url)
        if (currentId === targetId) return level

        for (const evo of chain.evolves_to || []) {
          const found = findLevel(evo, targetId, level + 1)
          if (found) return found
        }
        return 0
      }

      const level = findLevel(evolutionData.chain, pokemonId)
      let stage: "primera" | "segunda" | "tercera" | "legendario"

      if (level === 1) stage = "primera"
      else if (level === 2) stage = "segunda"
      else if (level >= 3) stage = "tercera"
      else stage = heuristicStage // Fallback a heurística

      evolutionCache.set(pokemonId, stage)
      return stage
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    } catch (_error) {
      // Si falla API, usar heurística
      console.warn(
        `API fallback para ${pokemonName} (${pokemonId}), usando heurística`,
      )
      evolutionCache.set(pokemonId, heuristicStage)
      return heuristicStage
    }
  } else {
    // Usar heurística directamente
    evolutionCache.set(pokemonId, heuristicStage)
    return heuristicStage
  }
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
 * Procesamiento paralelo optimizado
 */
async function processInParallel<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  concurrency: number = 15,
): Promise<R[]> {
  const results: R[] = []

  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency)

    const batchResults = await Promise.allSettled(batch.map(processor))

    for (const result of batchResults) {
      if (result.status === "fulfilled") {
        results.push(result.value)
      } else {
        console.warn("Error en procesamiento:", result.reason)
      }
    }

    // Micro delay solo si no es el último lote
    if (i + concurrency < items.length) {
      await delay(50) // Solo 50ms
    }
  }

  return results
}

/**
 * Función principal optimizada
 */
export async function fetchPokemonByGeneration(): Promise<GenerationPokemon[]> {
  try {
    console.log(" Carga rápida iniciada...")
    const startTime = Date.now()

    const gens = await fetchGenerationsList()
    console.log(`${gens.length} generaciones encontradas`)

    // Obtener detalles de generaciones en paralelo
    const detailed = await Promise.allSettled(gens.map((g) => fastFetch(g.url)))

    const validGenerations = detailed
      .filter(
        (result): result is PromiseFulfilledResult<any> =>
          result.status === "fulfilled",
      )
      .map((result) => result.value)

    console.log(
      `⚡ Procesando ${validGenerations.length} generaciones en paralelo...`,
    )

    // Procesar generaciones en paralelo
    const result = await Promise.allSettled(
      validGenerations.map(async (genData: any) => {
        const speciesList: { name: string; url: string }[] =
          genData.pokemon_species || []
        const sorted = speciesList
          .slice()
          .sort((a, b) => extractIdFromUrl(a.url) - extractIdFromUrl(b.url))

        // Procesamiento híbrido super rápido
        const pokemons = await processInParallel(
          sorted,
          async (ps) => {
            const id = extractIdFromUrl(ps.url)
            const stage = await getEvolutionStage(id, ps.name)
            const cost = calculateCost(stage)

            return {
              id,
              name: ps.name,
              sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
              cost,
              evolutionStage: stage,
            }
          },
          20,
        ) // 20 concurrent requests

        return {
          generation: generationNames[genData.name] || genData.name,
          pokemons: pokemons.filter(Boolean),
        }
      }),
    )

    const validResults = result
      .filter(
        (result): result is PromiseFulfilledResult<GenerationPokemon> =>
          result.status === "fulfilled",
      )
      .map((result) => result.value)

    const endTime = Date.now()
    console.log(` Carga completada en ${(endTime - startTime) / 1000}s`)

    return validResults
  } catch (_error) {
    console.error("Error en carga rápida:", _error)
    throw _error
  }
}
