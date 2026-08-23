import { type SessionTitleSlotEntry, type SessionTitleSource } from "./session-entries.js";
/** Semantic title update persisted by session storage backends. */
export interface SessionTitleUpdate {
    title?: string;
    source?: SessionTitleSource;
    updatedAt: string;
}
/** Parse a physical title slot JSONL line. Returns undefined for legacy headers. */
export declare function parseTitleSlotLine(line: string): SessionTitleSlotEntry | undefined;
/** Parse the fixed-width title slot from a physical session body. */
export declare function parseTitleSlotFromContent(content: string): SessionTitleSlotEntry | undefined;
/** Convert a parsed title slot to the semantic storage update shape. */
export declare function titleUpdateFromSlot(slot: SessionTitleSlotEntry | undefined): SessionTitleUpdate | undefined;
/** Serialize the fixed-width first-line title slot, exactly 256 UTF-8 bytes including newline. */
export declare function serializeTitleSlot(options: SessionTitleUpdate): string;
/** Replace the physical fixed-width title slot in a full session body. */
export declare function overlayTitleSlotContent(content: string, update: SessionTitleUpdate): string;
/** Replace the physical fixed-width title slot in a prefix byte window. */
export declare function overlayTitleSlotPrefix(prefix: string, prefixBytes: number, update: SessionTitleUpdate): string;
