import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';

// Access Electron IPC renderer from the preload script
declare global {
    interface Window {
        electron: {
            ipcRenderer: {
                send: (channel: string, data?: any) => void;
                on: (channel: string, callback: (data: any) => void) => void;
                once: (channel: string, callback: (data: any) => void) => void;
            };
        };
    }
}

// Initialize Electron-specific features
const initializeDesktopFeatures = () => {
    // Listen for app update events
    window.electron?.ipcRenderer.on('app-update-available', () => {
        console.log('A new update is available');
        // Handle update notification
    });

    // Example of sending message to main process
    window.electron?.ipcRenderer.send('app-ready');
};

// Initialize desktop features if we're in Electron context
if (window.electron) {
    initializeDesktopFeatures();
}

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App platform="desktop" />
  </React.StrictMode>
); 