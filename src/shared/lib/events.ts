type EventCallback = () => void;

class EventEmitter {
  private listeners: { [key: string]: EventCallback[] } = {};

  on(event: string, callback: EventCallback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners[event] = this.listeners[event].filter(
        (cb) => cb !== callback
      );
    };
  }

  emit(event: string) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback());
    }
  }
}

export const appEvents = new EventEmitter();

// Define event types as constants
export const APP_EVENTS = {
  OPEN_SETTINGS: "openSettings",
} as const;
