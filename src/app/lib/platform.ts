export type Platform = "web" | "desktop" | "android";

declare global {
  interface Window {
    electron?: {
      ipcRenderer: {
        send: (channel: string, data?: any) => void;
        on: (channel: string, callback: (data: any) => void) => void;
        once: (channel: string, callback: (data: any) => void) => void;
      };
    };
    Capacitor?: {
      isNative: boolean;
      platform: string;
    };
  }
}

export const getPlatform = (): Platform => {
  // Check if we're in Electron
  if (window.electron) {
    return "desktop";
  }

  // Check if we're in Capacitor/Android
  if (window.Capacitor?.isNative && window.Capacitor.platform === "android") {
    return "android";
  }

  // Default to web platform
  return "web";
};
