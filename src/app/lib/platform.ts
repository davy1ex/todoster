import { Platform } from "../App";
import { Capacitor } from "@capacitor/core";

export const getPlatform = (): Platform => {
  if (window.electron) {
    return "desktop";
  }

  if (Capacitor.isNativePlatform()) {
    return "android";
  }

  return "web";
};

export const isElectron = (): boolean => {
  return typeof window.electron !== "undefined";
};

export const isAndroid = (): boolean => {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android";
};

export const isWeb = (): boolean => {
  return !isElectron() && !isAndroid();
};
