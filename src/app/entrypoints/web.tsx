import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';

// Web-specific initialization can go here
// For example, service worker registration, web-specific feature detection, etc.

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App platform="web" />
  </React.StrictMode>
); 