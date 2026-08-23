import type { GitSource } from "./git-url.js";
/** Fetches current heads and tags into Bun's matching cached bare clone before a plugin update. */
export declare function refreshBunGitCache(source: GitSource, cwd: string): Promise<void>;
