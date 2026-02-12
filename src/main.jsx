import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { pluginManager } from './core/pluginManager'
import { availablePlugins } from './plugins'

availablePlugins.forEach((plugin) => pluginManager.registerPlugin(plugin))

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
