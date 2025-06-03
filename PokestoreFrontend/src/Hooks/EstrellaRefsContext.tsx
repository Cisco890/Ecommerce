import React, { createContext, useContext } from "react"
import useEstrellaRefs from "./useEstrellaRefs"

const EstrellaRefsContext = createContext<
  ReturnType<typeof useEstrellaRefs> | undefined
>(undefined)

export const EstrellaRefsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const estrellaRefs = useEstrellaRefs()
  return (
    <EstrellaRefsContext.Provider value={estrellaRefs}>
      {children}
    </EstrellaRefsContext.Provider>
  )
}

export const useEstrellaRefsContext = () => {
  const ctx = useContext(EstrellaRefsContext)
  if (!ctx)
    throw new Error(
      "useEstrellaRefsContext debe usarse dentro de EstrellaRefsProvider",
    )
  return ctx
}
