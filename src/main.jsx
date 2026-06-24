import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

// Disable pointer-events on all cards during scroll so the browser doesn't
// recalculate hover states on every frame, which causes scroll jank.
let scrollEndTimer
window.addEventListener('scroll', () => {
  document.body.classList.add('is-scrolling')
  clearTimeout(scrollEndTimer)
  scrollEndTimer = setTimeout(() => document.body.classList.remove('is-scrolling'), 150)
}, { passive: true })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
