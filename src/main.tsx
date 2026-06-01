import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

declare global {
  interface Window {
    deferredPrompt: any;
  }
}

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('reset') || urlParams.get('domain') === 'reset' || window.location.search.includes('reset')) {
  caches.keys().then((names) => {
    for (let name of names) {
      caches.delete(name);
    }
  }).finally(() => {
    alert('Cache sistem berhasil di-reset. Memuat ulang...');
    window.location.href = window.location.origin + window.location.pathname;
  });
}

window.addEventListener('error', (e) => {
  if (document.getElementById('root')?.innerHTML === '') {
    document.getElementById('root')!.innerHTML = `
      <div style="padding: 20px; color: white; background: #990000; font-family: monospace;">
        <h2>Runtime Error</h2>
        <p>${e.message}</p>
        <pre>${e.error?.stack || ''}</pre>
      </div>
    `;
  }
});

if ('serviceWorker' in navigator) {

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('SW registered with scope:', registration.scope);
      },
      (err) => {
        console.log('SW registration failed:', err);
      }
    );
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
