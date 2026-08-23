import type { AgentMessage } from "@oh-my-pi/pi-agent-core";
/**
 * Obfuscation surface the split renderer needs: a single text redaction pass.
 * Narrowed from the full SecretObfuscator class to the method actually
 * consumed, so tests can satisfy the contract with a typed helper instead of
 * an `as any` escape. A SecretObfuscator instance is structurally assignable.
 */
export interface AdvisorObfuscator {
    obfuscate(text: string, sharedRegexSecretValues?: ReadonlySet<string>): string;
}
/** Render options shared by the advisor single-block and multi-message paths. */
export declare const ADVISOR_RENDER_OPTIONS: {
    readonly includeToolIntent: true;
    readonly watchedRoles: true;
    readonly expandPrimaryContext: true;
    readonly expandEditDiffs: true;
};
export interface RenderAdvisorDeltaChunksOptions {
    wip: boolean;
    includeThinking: boolean;
    obfuscator?: AdvisorObfuscator;
    advisorRegexSecretValues: ReadonlySet<string>;
}
export declare function renderAdvisorDeltaChunks(delta: AgentMessage[], opts: RenderAdvisorDeltaChunksOptions): AgentMessage[] | null;
