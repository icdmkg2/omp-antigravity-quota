export type LocalImportResolution = {
    mode: "local";
    value: unknown;
} | {
    mode: "external";
    target: string;
};
export declare class LocalModuleLoader {
    #private;
    constructor(sessionId: string);
    resolveForRun(cwd: string, source: string): Promise<LocalImportResolution>;
    resolveForModule(moduleUrl: string, source: string, cwd: string): Promise<LocalImportResolution>;
    requireForFile(moduleUrlOrPath: string | undefined, cwd: string): NodeJS.Require;
    filenameForUrl(moduleUrlOrPath: string | undefined): string | null;
    dirnameForUrl(moduleUrlOrPath: string | undefined, cwd: string): string;
}
