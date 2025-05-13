// Solarized color palette
const solarized = {
  base03: "#002b36",
  base02: "#073642",
  base01: "#586e75",
  base00: "#657b83",
  base0: "#839496",
  base1: "#93a1a1",
  base2: "#eee8d5",
  base3: "#fdf6e3",

  // Accent colors (same for both themes)
  yellow: "#b58900",
  orange: "#cb4b16",
  red: "#dc322f",
  magenta: "#d33682",
  violet: "#6c71c4",
  blue: "#268bd2",
  cyan: "#2aa198",
  green: "#859900",
} as const;

// Theme-specific color mappings
export const themes = {
  dark: {
    // Dark theme uses darker background colors
    background: solarized.base03,
    backgroundHighlight: solarized.base02,
    textPrimary: solarized.base0,
    textSecondary: solarized.base01,
    textEmphasis: solarized.base1,
    border: solarized.base01,
    borderLight: solarized.base00,

    // Interactive colors
    primary: solarized.blue,
    success: solarized.green,
    warning: solarized.yellow,
    error: solarized.red,
    info: solarized.cyan,

    // Accents
    accent1: solarized.violet,
    accent2: solarized.magenta,
    accent3: solarized.orange,
  },

  light: {
    // Light theme uses lighter background colors
    background: solarized.base3,
    backgroundHighlight: solarized.base2,
    textPrimary: solarized.base00,
    textSecondary: solarized.base1,
    textEmphasis: solarized.base01,
    border: solarized.base1,
    borderLight: solarized.base0,

    // Interactive colors (slightly adjusted for light theme visibility)
    primary: solarized.blue,
    success: solarized.green,
    warning: solarized.yellow,
    error: solarized.red,
    info: solarized.cyan,

    // Accents
    accent1: solarized.violet,
    accent2: solarized.magenta,
    accent3: solarized.orange,
  },
} as const;

// Helper function to get current theme colors
export const getThemeColors = (mode: "light" | "dark") => themes[mode];

// Export the base palette for reference
export const solarizedPalette = solarized;
