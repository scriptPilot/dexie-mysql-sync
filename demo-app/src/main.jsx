import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App.jsx'
import './app.css'

ReactDOM
  .createRoot(document.getElementById('root'))
  .render(
    <StrictMode>
      <App />
    </StrictMode>
  )
