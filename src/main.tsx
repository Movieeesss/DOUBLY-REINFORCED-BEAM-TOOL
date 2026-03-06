import React from 'react'
import ReactDOM from 'react-dom/client'
import DoublyReinforcedTool from './DoublyReinforced'
import './style.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DoublyReinforcedTool />
  </React.StrictMode>,
)

// This registers the logic that tells Chrome to show the INSTALL button
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('App is ready for installation');
    }).catch(err => {
      console.log('Installation logic failed', err);
    });
  });
}
