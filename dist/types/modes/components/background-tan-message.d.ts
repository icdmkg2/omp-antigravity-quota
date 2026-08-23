import type { CustomMessage } from "../../session/messages.js";
import { TranscriptBlock } from "./transcript-container.js";
/**
 * Single-line transcript pill for a `/tan` background-dispatch breadcrumb,
 * styled as a sibling of the "Background job completed" line. The full
 * system-notice content (the persisted `content`) is for the model only — the
 * user sees one compact line, not the raw `<system-notice>` block.
 */
export declare function createBackgroundTanDispatchBlock(message: CustomMessage<unknown>): TranscriptBlock;
