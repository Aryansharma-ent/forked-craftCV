import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client' 
import { BrowserRouter, HashRouter } from 'react-router'
import App from './App.jsx'
import './index.css'

// Use HashRouter on GitHub Pages to guarantee zero 404s on subpaths & refresh across any repository name
const isStaticOrPages =
  window.location.hostname.endsWith('github.io') ||
  window.location.protocol === 'file:' ||
  import.meta.env.VITE_ROUTER === 'hash'

const Router = isStaticOrPages ? HashRouter : BrowserRouter

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)

