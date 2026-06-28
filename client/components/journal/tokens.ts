/** Direction D design tokens as JS constants (for inline styles / SVG). */
export const TOKENS = {
  bg: "#1b1714",
  surface: "#241f19",
  surface2: "#2c261f",
  line: "#352f28",
  text: "#ece3d4",
  muted: "#a89c89",
  faint: "#6f6557",
  accent: "#d8a657",
  accentGradient: "linear-gradient(135deg,#e0b366,#cb9a3c)",
  dangerGradient: "linear-gradient(135deg,#c25a48,#a8473a)",
  onAccent: "#1b1714",
} as const;

export const DEFAULT_NOTE_COLOR = "#868e96";

/** Curated swatch palette for the per-record color picker (from the design data). */
export const NOTE_COLOR_SWATCHES = [
  "#2664a3",
  "#2aa1b3",
  "#5fb14e",
  "#6aa0d8",
  "#c8922e",
  "#7a6cd8",
  "#3fae8f",
  "#a8552e",
  "#868e96",
] as const;
