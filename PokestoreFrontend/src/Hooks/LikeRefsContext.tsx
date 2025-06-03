import React, { createContext, useContext } from "react"
import useLikeRefs from "./useLikeRefs"

const LikeRefsContext = createContext<
  ReturnType<typeof useLikeRefs> | undefined
>(undefined)

export const LikeRefsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const likeRefs = useLikeRefs()
  return (
    <LikeRefsContext.Provider value={likeRefs}>
      {children}
    </LikeRefsContext.Provider>
  )
}

export const useLikeRefsContext = () => {
  const ctx = useContext(LikeRefsContext)
  if (!ctx)
    throw new Error("useLikeRefsContext debe usarse dentro de LikeRefsProvider")
  return ctx
}
