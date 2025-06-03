import { Routes, Route, Navigate } from "react-router-dom"
import MainScreen from "./pages/MainScreen"
import DetailScreen from "./pages/DetailScreen"
import CartScreen from "./pages/CartScreen"
import { CarritoProvider } from "./hooks/useContextCarrito"
import { LikeRefsProvider } from "./hooks/LikeRefsContext"
import { EstrellaRefsProvider } from "./hooks/EstrellaRefsContext" // <-- Importa el provider

const App = () => (
  <CarritoProvider>
    <LikeRefsProvider>
      <EstrellaRefsProvider>
        <Routes>
          <Route path="/" element={<MainScreen />} />
          <Route path="/pokemon/:name" element={<DetailScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </EstrellaRefsProvider>
    </LikeRefsProvider>
  </CarritoProvider>
)
export default App
