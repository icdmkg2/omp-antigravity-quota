import type { MnemopiLlmCompleteOptions } from "@oh-my-pi/pi-mnemopi/core/runtime-options";
import type { MemoryBackend } from "../memory-backend/types.js";
import type { AgentSession } from "../session/agent-session.js";
/** Prompt turns for one Mnemopi completion. */
export interface MemoryCompletionInput {
    prompt: string;
    systemPrompt?: string;
}
/** Maps a Mnemopi completion into instruction and input turns.
 *
 *  Extraction is the only task with its own instructions, and it always supplies
 *  the raw text, so the instructions become the system turn and the text becomes
 *  the user turn. Every other task keeps the prompt Mnemopi rendered. */
export declare function resolveMemoryCompletionInput(prompt: string, options?: MnemopiLlmCompleteOptions): MemoryCompletionInput;
export declare const mnemopiBackend: MemoryBackend;
export declare function getMnemopiDbDirForTests(session: AgentSession): string | undefined;
