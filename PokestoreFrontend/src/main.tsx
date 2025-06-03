import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import { CarritoProvider } from "./hooks/useContextCarrito"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <CarritoProvider>
        <App />
      </CarritoProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
