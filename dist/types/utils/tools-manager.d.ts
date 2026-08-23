export type ToolName = "sd" | "sg" | "yt-dlp" | "trafilatura";
export declare function getToolPath(tool: ToolName): string | null;
/** Download a tool asset without handing the streaming Response to Bun.write. */
export declare function downloadFile(url: string, dest: string, signal?: AbortSignal): Promise<void>;
type EnsureToolOptions = {
    signal?: AbortSignal;
    silent?: boolean;
    notify?: (message: string) => void;
};
export declare function ensureTool(tool: ToolName, silentOrOptions?: EnsureToolOptions): Promise<string | undefined>;
export {};
