// Font families prioritizing system fonts and popular coding fonts
export const fontFamilies = {
  // Modern sans-serif stack similar to macOS
  sans: [
    "-apple-system",
    "BlinkMacSystemFont",
    "SF Pro Text",
    "Segoe UI",
    "Roboto",
    "Oxygen",
    "Ubuntu",
    "Cantarell",
    "Helvetica Neue",
    "sans-serif",
  ].join(", "),

  // Monospace stack similar to Cursor IDE and popular code editors
  mono: [
    "SF Mono",
    "JetBrains Mono",
    "Fira Code",
    "Menlo",
    "Monaco",
    "Consolas",
    "Liberation Mono",
    "Courier New",
    "monospace",
  ].join(", "),

  // Display font for headings
  display: [
    "SF Pro Display",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "sans-serif",
  ].join(", "),
} as const;

// Font sizes following a modular scale
export const fontSizes = {
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  base: "1rem", // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
} as const;

// Font weights
export const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

// Line heights
export const lineHeights = {
  tight: 1.25,
  base: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

// Letter spacing
export const letterSpacing = {
  tighter: "-0.05em",
  tight: "-0.025em",
  normal: "0",
  wide: "0.025em",
  wider: "0.05em",
} as const;

// Common text styles
export const textStyles = {
  h1: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes["4xl"],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
  },
  h2: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes["3xl"],
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.tight,
  },
  h3: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes["2xl"],
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.tight,
  },
  body: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.base,
  },
  code: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.base,
  },
} as const;
