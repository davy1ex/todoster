import { createContext } from "react";
import type { SettingsContextType } from "./types";

export const SettingsContext = createContext<SettingsContextType | null>(null);
