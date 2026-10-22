import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import './tactile-theme.css'
import App from './App.jsx'
import { Analytics } from "@vercel/analytics/react"

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
    <Analytics/>
  </StrictMode>
)

if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
