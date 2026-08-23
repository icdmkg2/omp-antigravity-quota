/**
 * `/export` argument parsing, split from `./index.ts` so slash-command
 * registries can parse arguments without eagerly loading the export module's
 * embedded template/tool-view text.
 */
/** Dark and light TUI theme names bundled into a dual-theme export. */
export interface ExportThemeNames {
    dark: string;
    light: string;
}
/** Parse `/export [--themes] [path]`; paths containing spaces were never supported. */
export declare function parseExportArgs(args: string): {
    outputPath?: string;
    useUserThemes: boolean;
};
