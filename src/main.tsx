import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { StoreProvider } from './state/store';
import './styles.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root container missing');

createRoot(container).render(
  <StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </StrictMode>,
);

// Offline shell. Registered only in a real browser build; no network calls beyond same-origin.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    /*
     * The build id rides along as a query. It gives the worker a cache name
     * that changes with the app — so a redeploy evicts the previous build's
     * assets instead of leaving them cached forever — and it makes the script
     * URL differ between deploys, which is what prompts the browser to install
     * the new worker rather than keep the installed one.
     */
    // Absolute: on a deep link like /details/wrist_hand a relative URL would
    // ask for /details/sw.js, and the app would silently lose offline support.
    const url = new URL('/sw.js', window.location.origin);
    url.searchParams.set('v', __SW_BUILD__);
    navigator.serviceWorker.register(url.pathname + url.search).catch(() => {
      /* offline support is optional; the app works without it */
    });
  });
}
