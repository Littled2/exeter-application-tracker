import React from 'react';
import ReactDOM from 'react-dom/client';
import './globals.css';
import './default-styles.css';
import './utils.css';
import 'react-tooltip/dist/react-tooltip.css'

import { AppWrapper } from './Interface/AppWrapper';

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => console.log("Service Worker Registered"))
      .catch((error) => console.log("Service Worker Registration Failed", error));
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <AppWrapper />
  // </React.StrictMode>
)
