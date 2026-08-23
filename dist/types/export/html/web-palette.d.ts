/** omp web palette bundled into standalone exports and the share viewer. */
export type WebExportScheme = "dark" | "light";
export declare const WEB_EXPORT_PALETTES: {
    readonly dark: {
        readonly "--bg": "#0f0b14";
        readonly "--bg-raised": "#16111c";
        readonly "--bg-inset": "#09060c";
        readonly "--bg-overlay": "#211b28";
        readonly "--fg": "#e6e3ea";
        readonly "--fg-muted": "#a49faa";
        readonly "--fg-faint": "#6e6974";
        readonly "--accent": "#ed4abf";
        readonly "--accent-muted": "oklch(0.674 0.23 341 / 18%)";
        readonly "--ok": "#68ca80";
        readonly "--err": "#f05653";
        readonly "--warn": "#e4b33f";
        readonly "--border": "oklch(1 0 0 / 9%)";
        readonly "--border-strong": "oklch(1 0 0 / 13%)";
        readonly "--ring": "oklch(0.817 0.112 205 / 70%)";
        readonly "--link": "#5ad8e5";
        readonly "--syntaxComment": "#6e6974";
        readonly "--syntaxKeyword": "#945ff9";
        readonly "--syntaxFunction": "#e4b33f";
        readonly "--syntaxVariable": "#5ad8e5";
        readonly "--syntaxString": "#68ca80";
        readonly "--syntaxNumber": "#ed4abf";
        readonly "--syntaxType": "#b281d6";
    };
    readonly light: {
        readonly "--bg": "oklch(0.985 0.004 307)";
        readonly "--bg-raised": "oklch(1 0 0)";
        readonly "--bg-inset": "oklch(0.95 0.006 307)";
        readonly "--bg-overlay": "oklch(0.965 0.006 307)";
        readonly "--fg": "oklch(0.26 0.03 307)";
        readonly "--fg-muted": "oklch(0.46 0.03 307)";
        readonly "--fg-faint": "oklch(0.58 0.025 307)";
        readonly "--accent": "oklch(0.62 0.23 341)";
        readonly "--accent-muted": "oklch(0.62 0.23 341 / 14%)";
        readonly "--ok": "oklch(0.55 0.13 150)";
        readonly "--err": "oklch(0.55 0.19 25)";
        readonly "--warn": "oklch(0.6 0.13 85)";
        readonly "--border": "oklch(0 0 0 / 10%)";
        readonly "--border-strong": "oklch(0 0 0 / 15%)";
        readonly "--ring": "oklch(0.58 0.13 230 / 70%)";
        readonly "--link": "#0f7a88";
        readonly "--syntaxComment": "#77717c";
        readonly "--syntaxKeyword": "#6d35c7";
        readonly "--syntaxFunction": "#8a6000";
        readonly "--syntaxVariable": "#087f8c";
        readonly "--syntaxString": "#247a3d";
        readonly "--syntaxNumber": "#b51f88";
        readonly "--syntaxType": "#7b3fa2";
    };
};
/** Serialize one web color scheme as CSS custom-property declarations. */
export declare function webExportThemeVars(scheme: WebExportScheme): string;
