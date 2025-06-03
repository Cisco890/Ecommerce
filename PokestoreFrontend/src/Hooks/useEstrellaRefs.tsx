import { useRef } from "react"

type EstrellaRefs = {
  [pokemonId: string]: number // rating de 0 a 5
}

/**
 * Hook para manejar el estado de "estrella" (rating) de cada Pokémon usando useRef.
 * El estado no causa re-render, pero puedes forzar uno si lo necesitas.
 */
export const useEstrellaRefs = () => {
  // Guarda el rating por id de Pokémon
  const estrellaRefs = useRef<EstrellaRefs>({})

  // Obtener el rating de un Pokémon
  const getRating = (pokemonId: number | string) => {
    return estrellaRefs.current[pokemonId] || 0
  }

  // Cambiar el rating de un Pokémon
  const setRating = (pokemonId: number | string, rating: number) => {
    estrellaRefs.current[pokemonId] = rating
  }

  return {
    getRating,
    setRating,
    estrellaRefs, // por si necesitas acceso directo
  }
}

export default useEstrellaRefs
