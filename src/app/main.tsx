import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { getPlatform } from './lib/platform';
import '@/shared/styles/index.css';
import "./main.css";

const platform = getPlatform();

// Initialize platform-specific features
const initializePlatform = async () => {
  try {
    await import(`./entrypoints/${platform.type}.tsx`);
  } catch (err) {
    console.error(`Failed to load ${platform.type} entrypoint:`, err);
    console.warn('Falling back to web platform');
  }
};

// Initialize platform features
initializePlatform();

// Render the app
const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

const root = createRoot(container);
root.render(
  <StrictMode>
    <App platform={platform} />
  </StrictMode>
);
