import React from 'react'
import ReactDOM from 'react-dom/client'
import { StateContextProvider } from './context';
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
  </React.StrictMode>,
)
