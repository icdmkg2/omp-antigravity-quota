/**
 * Derive a stable CSS hex accent color from a session name and the active theme.
 *
 * Picks a hue from a **dark/light-specific range** so the accent feels natural
 * for the theme type (warm on dark, cool on light). The session name hash
 * determines the exact hue within the range. The result is checked against
 * all theme color hues and shifted if it lands within {@link MIN_HUE_DISTANCE}
 * of an existing theme hue, but is clamped to the hue band so it never
 * drifts into an unrelated part of the spectrum.
 *
 * On dark themes (`surfaceLuminance` undefined) the accent is vivid (high
 * saturation, high lightness). On light themes the lightness is reduced until the
 * accent's perceived luminance clears {@link ACCENT_MIN_CONTRAST} against the
 * actual surface it renders on — so it stays legible on near-white *and* mid-light
 * backgrounds.
 *
 * @param name — session name for per-session uniqueness.
 * @param themeColorHexes — all theme colors to check collision against.
 * @param surfaceLuminance — undefined on dark themes; WCAG luminance of the
 *   status-line background on light themes.
 */
export declare function getSessionAccentHex(name: string, themeColorHexes: string[], surfaceLuminance?: number): string;
/**
 * Convert a hex accent color to an ANSI-16m foreground escape sequence.
 * Returns `undefined` if `hex` is nullish or Bun.color conversion fails.
 */
export declare function getSessionAccentAnsi(hex: string | undefined): string | undefined;
