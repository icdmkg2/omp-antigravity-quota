export interface ActiveRepoContext {
    cwd: string;
    repoRoot: string;
    relativeRepoRoot: string;
    source: "single-direct-child-repo";
}
export declare function resolveActiveRepoContext(cwd: string): Promise<ActiveRepoContext | null>;
export declare function resolveActiveRepoContextSync(cwd: string): ActiveRepoContext | null;
