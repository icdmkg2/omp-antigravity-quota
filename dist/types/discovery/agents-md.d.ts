import { type ContextFile } from "../capability/context-file.js";
import type { LoadContext, LoadResult } from "../capability/types.js";
/**
 * Load standalone AGENTS.md files.
 *
 * When a repository is nested below the user's home directory, continue past
 * the Git root to discover workspace-level AGENTS.md files, but stop before
 * loading the home directory's own AGENTS.md as project context.
 */
export declare function loadAgentsMd(ctx: LoadContext): Promise<LoadResult<ContextFile>>;
