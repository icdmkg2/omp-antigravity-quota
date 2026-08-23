/**
 * Returns the user's preferred editor command, or a platform default.
 *
 * Resolution order:
 *   1. `$VISUAL`
 *   2. `$EDITOR`
 *   3. `notepad` on Windows (always present in `%SystemRoot%\System32`)
 *
 * POSIX returns `undefined` when neither variable is set so the caller can
 * surface a warning that nudges the user to configure one.
 */
export declare function getEditorCommand(): string | undefined;
export interface OpenInEditorOptions {
    /** File extension for the temp file (default: ".md"). */
    extension?: string;
    /** Keep the file's trailing newline instead of trimming it from the returned text. */
    trimTrailingNewline?: boolean;
}
/** Subprocess argv and Windows quoting mode used to launch an external editor. */
export interface EditorSpawnCommand {
    cmd: string[];
    windowsVerbatimArguments: boolean;
}
/** Resolves shell argv without letting the host runtime re-quote the editor command. */
export declare function resolveEditorSpawnCommand(editorCmd: string, tmpFile: string, platform?: NodeJS.Platform): EditorSpawnCommand;
/**
 * Opens `content` in the user's external editor and returns the edited text.
 * Returns `null` if the editor exits with a non-zero code.
 *
 * The caller is responsible for stopping/starting the TUI around this call.
 */
export declare function openInEditor(editorCmd: string, content: string, options?: OpenInEditorOptions): Promise<string | null>;
