import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';
import { App as CapacitorApp } from '@capacitor/app';
import type { BackButtonListenerEvent } from '@capacitor/app';

// Initialize Capacitor app
CapacitorApp.addListener('backButton', (event: BackButtonListenerEvent) => {
  if (!event.canGoBack) {
    CapacitorApp.exitApp();
  } else {
    window.history.back();
  }
});

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App platform="android" />
  </React.StrictMode>
); 