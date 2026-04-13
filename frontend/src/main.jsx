import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      console.log("SW registered:", registration);
    } catch (err) {
      console.log("SW registration failed:", err);
    }
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
