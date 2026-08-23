import type { MemoryBackend } from "./types.js";
/**
 * Wraps the existing `memories/` module as a `MemoryBackend`.
 *
 * The rollout-summarisation pipeline (rollouts → SQLite → memory_summary.md) is
 * delegated unchanged. On top of it, `save()` persists `learn`-tool lessons to
 * `learned.md` (so `status()` reports `writable: true`); structured search is
 * still unavailable.
 */
export declare const localBackend: MemoryBackend;
