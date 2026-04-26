import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", async () => {
//     try {
//       // Add { type: 'module' } to support ESM imports in the SW
//       const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
//         type: "module",
//       });
//       console.log("SW registered:", registration);
//     } catch (err) {
//       console.log("SW registration failed:", err);
//     }
//   });
// }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
