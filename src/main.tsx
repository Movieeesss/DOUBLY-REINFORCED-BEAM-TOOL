import React from 'react'
import ReactDOM from 'react-dom/client'
import DoublyReinforcedTool from './DoublyReinforced'
import './style.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DoublyReinforcedTool />
  </React.StrictMode>,
)

// This registers the Service Worker so the INSTALL button appears in Chrome
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('App Installable: Service Worker Registered');
    }).catch(err => {
      console.log('Install logic failed: ', err);
    });
  });
}
