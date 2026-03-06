import React from 'react'
import ReactDOM from 'react-dom/client'
import DoublyReinforcedTool from './DoublyReinforced'
import './style.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DoublyReinforcedTool />
  </React.StrictMode>,
)

// Add this registration block
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('Service Worker Registered');
    }).catch(err => {
      console.log('Registration Failed', err);
    });
  });
}
