import { Platform } from "@/app/lib/platform";

interface StorageService {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}

class WebStorage implements StorageService {
  async getItem(key: string): Promise<string | null> {
    return localStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    localStorage.clear();
  }
}

class ElectronStorage implements StorageService {
  private electron: any;

  constructor() {
    this.electron = (window as any).electron;
  }

  async getItem(key: string): Promise<string | null> {
    return new Promise((resolve) => {
      this.electron.ipcRenderer
        .invoke("storage:get", key)
        .then((value: string | null) => {
          resolve(value);
        });
    });
  }

  async setItem(key: string, value: string): Promise<void> {
    return this.electron.ipcRenderer.invoke("storage:set", { key, value });
  }

  async removeItem(key: string): Promise<void> {
    return this.electron.ipcRenderer.invoke("storage:remove", key);
  }

  async clear(): Promise<void> {
    return this.electron.ipcRenderer.invoke("storage:clear");
  }
}

export function createStorage(platform: Platform): StorageService {
  if (platform.isElectron) {
    return new ElectronStorage();
  }
  return new WebStorage();
}
