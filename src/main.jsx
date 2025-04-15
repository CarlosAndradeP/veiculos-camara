import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import MainMenu from './MainMenu'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter><MainMenu /></BrowserRouter>
  </StrictMode>,
)
