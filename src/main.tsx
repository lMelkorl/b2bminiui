import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';

async function enableMocking() {
  if (import.meta.env.MODE === 'development') {
    console.log('[MSW] Initializing Mock Service Worker...');
    const { worker } = await import('./mocks/browser');
    return worker.start({
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
      onUnhandledRequest: 'bypass',
      quiet: false,
    }).then(() => {
      console.log('[MSW] Mock Service Worker started successfully!');
    });
  }
}

enableMocking().then(() => {
  console.log('[App] Rendering application...');
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}).catch((error) => {
  console.error('[MSW] Failed to start:', error);
});
