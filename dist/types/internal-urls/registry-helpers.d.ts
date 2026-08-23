/**
 * Shared helpers for internal-url protocol handlers that resolve IDs against
 * registered agent sessions.
 */
export declare function registerArtifactsDir(dir: string): () => void;
export declare function resetRegisteredArtifactDirsForTests(): void;
/**
 * Snapshot of artifacts dirs for every registered session, deduped.
 *
 * Collects TWO candidate dirs per ref, because a subagent reads from its
 * adopted (root-wide) `ArtifactManager.dir` but its own children are written
 * one level deeper, under `sessionFile.slice(0, -6)` (`task/index.ts`). A
 * depth-2+ subagent's output therefore lives in the write-time dir, not the
 * adopted one, so `agent://` must scan both or it 404s a live nested peer.
 * `addDir` dedup collapses the depth-0 case (both formulas agree) back to a
 * single entry.
 */
export declare function artifactsDirsFromRegistry(): string[];
/**
 * Recursively scan artifacts dirs for agent session transcripts, keyed by
 * agent id (the `.jsonl` basename). Used by `history://` so transcripts of
 * agents no longer in the registry (unregistered one-shot helpers, released
 * agents, or any agent after session resume) remain reachable — mirroring how
 * `agent://` reads `.md` outputs straight off disk.
 *
 * Layout follows `task/index.ts`: a subagent's transcript is
 * `<artifactsDir>/<AgentId>.jsonl`, and its own children nest one level deeper
 * under `<artifactsDir>/<AgentId>/<AgentId>.<ChildId>.jsonl`. Advisor
 * transcripts (`__advisor*.jsonl`) are observability-only and excluded;
 * EPERM-rewrite backups (`.bak`) are skipped. When the same id appears in
 * multiple dirs, the first hit wins (registry dirs are scanned first).
 */
export declare function sessionFilesFromDisk(): Promise<Map<string, string>>;
/**
 * Availability half of the `history://` resolution semantics: true when a
 * transcript for `agentId` can be served from a registered ref's live session
 * or retained session file, or from an on-disk `.jsonl` under a known
 * artifacts dir. Hint surfaces use this so they only advertise
 * `history://<agentId>` links that `HistoryProtocolHandler` can actually
 * resolve. A retained sessionFile path is verified on disk before it counts,
 * and probing never throws: a stale path or unreadable artifacts subtree
 * reads as unavailable instead of disturbing the caller's delivery path.
 */
export declare function hasResolvableTranscript(agentId: string): Promise<boolean>;
