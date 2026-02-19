import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Importar assets
import './assets/css/index.css';
import './assets/css/responsive.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
