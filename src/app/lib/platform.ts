export type Platform = {
  type: "web" | "electron" | "android";
  isElectron: boolean;
  isAndroid: boolean;
  isWeb: boolean;
  electron?: {
    ipcRenderer: {
      send: (channel: string, data?: any) => void;
      on: (channel: string, callback: (data: any) => void) => void;
      once: (channel: string, callback: (data: any) => void) => void;
      invoke: (channel: string, ...args: any[]) => Promise<any>;
    };
  };
};

declare global {
  interface Window {
    electron?: {
      ipcRenderer: {
        send: (channel: string, data?: any) => void;
        on: (channel: string, callback: (data: any) => void) => void;
        once: (channel: string, callback: (data: any) => void) => void;
        invoke: (channel: string, ...args: any[]) => Promise<any>;
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
    return {
      type: "electron",
      isElectron: true,
      isAndroid: false,
      isWeb: false,
      electron: window.electron,
    };
  }

  // Check if we're in Capacitor/Android
  if (window.Capacitor?.isNative && window.Capacitor.platform === "android") {
    return {
      type: "android",
      isElectron: false,
      isAndroid: true,
      isWeb: false,
    };
  }

  // Default to web platform
  return {
    type: "web",
    isElectron: false,
    isAndroid: false,
    isWeb: true,
  };
};
