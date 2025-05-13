import { themes, getThemeColors, solarizedPalette } from "./colors";
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacing,
  textStyles,
} from "./typography";

export * from "./colors";
export * from "./typography";

// Create theme object based on mode
export const createTheme = (mode: "light" | "dark") =>
  ({
    colors: {
      solarized: solarizedPalette,
      theme: getThemeColors(mode),
    },
    typography: {
      fonts: fontFamilies,
      sizes: fontSizes,
      weights: fontWeights,
      lineHeights,
      letterSpacing,
      styles: textStyles,
    },
  } as const);

// Export themes for direct access if needed
export const themePresets = themes;
