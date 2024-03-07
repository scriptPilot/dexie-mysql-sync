import { StrictMode } from 'react'
import Provider from './provider.jsx'
import ReactDOM from 'react-dom/client'
import App from './components/App.jsx'
import './app.css'

ReactDOM
  .createRoot(document.getElementById('root'))
  .render(
    <StrictMode>
      <Provider>
        <App />
      </Provider>
    </StrictMode>
  )
