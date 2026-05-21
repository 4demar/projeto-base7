import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@/app/App';
import { registerSW } from 'virtual:pwa-register';

// Service worker auto-update
registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
