import React from 'react';
import ReactDOM from 'react-dom/client';
import DoublyReinforcedTool from './DoublyReinforced'; // Import your new tool
import './style.css'; //

// If you want this to be the main page when the site opens:
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DoublyReinforcedTool />
  </React.StrictMode>
);