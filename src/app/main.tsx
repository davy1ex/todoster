import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {App} from './App'
import { getPlatform } from './lib/platform';
import type { Platform } from './lib/platform';
import '@/shared/styles/index.css';

const platform: Platform = getPlatform();

// Initialize platform-specific features
const initializePlatform = async () => {
  try {
    await import(`./entrypoints/${platform}.tsx`);
  } catch (err) {
    console.error(`Failed to load ${platform} entrypoint:`, err);
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
