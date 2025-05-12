interface ElectronAPI {
  getAppVersion: () => Promise<string>;
  getPlatform: () => Promise<string>;
  onWindowStateChange: (callback: (state: string) => void) => void;
}

declare interface Window {
  api: ElectronAPI;
}
