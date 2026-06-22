import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "bootstrap-icons/font/bootstrap-icons.css";
import MainRoute from "./routes/main_route"


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainRoute />
  </StrictMode>,
)
