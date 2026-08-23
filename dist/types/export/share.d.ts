import type { AgentState } from "@oh-my-pi/pi-agent-core";
import { DEFAULT_SHARE_URL } from "@oh-my-pi/pi-wire";
import type { SecretObfuscator } from "../secrets/obfuscator.js";
import type { SessionManager } from "../session/session-manager.js";
import { type SessionData } from "./html/index.js";
export { DEFAULT_SHARE_URL };
/** Hard cap for blobs accepted by the share server (mirrors relay shareMaxBytes). */
export declare const SERVER_MAX_SEALED_BYTES = 1000000;
export type ShareStore = "blob" | "gist";
export interface ShareSessionOptions {
    /** Share server/viewer base URL; defaults to {@link DEFAULT_SHARE_URL}. */
    serverUrl?: string;
    /**
     * Where to upload the sealed blob. `"blob"` (default) posts to the share
     * server; `"gist"` pushes to a secret GitHub gist first (needs an
     * authenticated `gh`) and falls back to the server.
     */
    store?: ShareStore;
    /** Agent state for system prompt + tool descriptions in the snapshot. */
    state?: AgentState;
    /**
     * Redacts the snapshot before sealing via a typed, per-field walk over the
     * session (header title/cwd, system prompt, tool descriptions, entry summaries,
     * labels, and message text — including tool-result output and `@file` mentions),
     * so secrets that landed in persisted entries (tool outputs reading .env, etc.)
     * never leave the machine. Inline image bytes are preserved (size-trimmed
     * separately); opaque provider-replay blobs (`providerPayload`,
     * `redactedThinking`, `compaction.preserveData`) and untyped extension payloads
     * (`details`/`data`/`outputSchema`) are dropped rather than walked. Pass
     * undefined to skip redaction entirely.
     */
    obfuscator?: SecretObfuscator;
}
export interface ShareSessionResult {
    /** Viewer link: `<serverUrl>/<id>#<key>`. */
    url: string;
    method: "gist" | "server";
    /** Underlying gist URL (gist method only). */
    gistUrl?: string;
    /** True when content was trimmed to fit the upload budget. */
    truncated: boolean;
    sealedBytes: number;
}
/** Build the snapshot that gets sealed and uploaded, redacted when an obfuscator is provided. */
export declare function buildShareSnapshot(sm: SessionManager, options?: ShareSessionOptions): SessionData;
/** Share the session; uploads to the share server unless `options.store` is `"gist"`. */
export declare function shareSession(sm: SessionManager, options?: ShareSessionOptions): Promise<ShareSessionResult>;
/** Strip trailing slashes so `<base>/<id>` composes cleanly. */
export declare function normalizeShareServerUrl(serverUrl?: string): string;
interface SealedSession {
    sealed: Uint8Array<ArrayBuffer>;
    truncated: boolean;
}
/** Seal `data`, trimming content until the sealed blob fits `maxBytes`. Exported for tests. */
export declare function sealToFit(key: CryptoKey, data: SessionData, maxBytes: number): Promise<SealedSession>;
