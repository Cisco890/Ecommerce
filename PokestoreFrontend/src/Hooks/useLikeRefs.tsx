import { useRef } from "react"

type LikeRefs = {
  [pokemonId: string]: boolean
}

/**
 * Hook para manejar el estado de "like" de cada Pokémon usando useRef.
 * El estado no causa re-render, pero puedes forzar uno si lo necesitas.
 */
export const useLikeRefs = () => {
  // Guarda el estado de like por id de Pokémon
  const likeRefs = useRef<LikeRefs>({})

  // Obtener el estado de like de un Pokémon
  const isLiked = (pokemonId: number | string) => {
    return !!likeRefs.current[pokemonId]
  }

  // Cambiar el estado de like de un Pokémon
  const toggleLike = (pokemonId: number | string) => {
    likeRefs.current[pokemonId] = !likeRefs.current[pokemonId]
  }

  // Establecer el estado de like de un Pokémon
  const setLike = (pokemonId: number | string, liked: boolean) => {
    likeRefs.current[pokemonId] = liked
  }

  return {
    isLiked,
    toggleLike,
    setLike,
    likeRefs, // por si necesitas acceso directo
  }
}

export default useLikeRefs
