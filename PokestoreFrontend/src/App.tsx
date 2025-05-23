import { Routes, Route, Navigate } from "react-router-dom"
import MainScreen from "./pages/MainScreen"
import DetailScreen from "./pages/DetailScreen"
import CartScreen from "./pages/CartScreen"

const App = () => (
  <Routes>
    <Route path="/" element={<MainScreen />} />
    <Route path="/pokemon/:name" element={<DetailScreen />} />
    <Route path="/cart" element={<CartScreen />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)
export default App
