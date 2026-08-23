import type { TaskEffort } from "../thinking.js";
import type { ToolSession } from "../tools/index.js";
import { type DiscoveryResult } from "./discovery.js";
import { type AgentDefinition, type AgentProgress, type SingleResult, type StructuredSubagentOutput } from "./types.js";
/** Validation behavior requested for an effective output schema. */
export type StructuredSubagentSchemaMode = "permissive" | "strict";
/** Where an effective output schema came from. */
export type StructuredSubagentSchemaSource = "caller" | "agent" | "session" | "none";
/** Final structured completion metadata returned for a schema-bearing run. */
export type StructuredSubagentSchemaResult = StructuredSubagentOutput;
/** A schema validation or extraction error attached to structured completion metadata. */
export type StructuredSubagentSchemaError = NonNullable<StructuredSubagentOutput["error"]>;
/** A selected schema paired with its source and enforcement mode. */
export interface StructuredSubagentSchemaResolution {
    schema: unknown;
    source: StructuredSubagentSchemaSource;
    mode: StructuredSubagentSchemaMode;
    outputSchemaOverridesAgent: boolean;
}
/** Isolation controls shared by the task and eval surfaces. */
export interface StructuredSubagentIsolationControls {
    requested?: boolean;
    merge?: "patch" | "branch";
    apply?: boolean;
}
/** Identity and presentation metadata supplied by the calling surface. */
export interface StructuredSubagentIdentity {
    /** A previously reserved output/registry id. */
    id?: string;
    /** Stable user-facing label used when allocating a new id. */
    label?: string;
}
/** One normalized child invocation. */
export interface StructuredSubagentRequest {
    session: ToolSession;
    invocationKind: "task" | "eval";
    assignment: string;
    context?: string;
    agent?: string;
    model?: string | string[];
    /** Presence, rather than truthiness, makes this the highest-priority schema. */
    outputSchema?: unknown;
    schemaMode?: StructuredSubagentSchemaMode;
    /** Per-spawn thinking effort mapped onto the resolved model's supported range; overrides the agent's default selector. */
    effort?: TaskEffort;
    identity?: StructuredSubagentIdentity;
    index?: number;
    parentToolCallId?: string;
    detached?: boolean;
    invokedAt?: number;
    acquiredAt?: number;
    isolation?: StructuredSubagentIsolationControls;
    /** The parent agent name forbidden from recursively spawning itself. */
    blockedAgent?: string;
    /** Preserve a completed temporary artifacts directory for an agent:// handle. */
    retainArtifacts?: boolean;
    /** Task UI agents keep live registry references; eval one-shots normally do not. */
    keepAlive?: boolean;
    /** Task subagents share their parent's eval kernel; eval bridge children must not. */
    shareEvalSession?: boolean;
    /** Task frontends may inherit LSP; eval frontends normally set this false. */
    enableLsp?: boolean;
    /** Explicitly pass false for plan mode or invocation kinds that must not use IRC. */
    enableIrc?: boolean;
    /** `0` disables executor wall-clock timeout. Undefined inherits settings. */
    maxRuntimeMs?: number;
    signal?: AbortSignal;
    onProgress?: (progress: AgentProgress) => void;
}
/** A normalized preflight result, reusable by tests and adapters. */
export interface EffectiveSubagentPolicy {
    discovery: DiscoveryResult;
    agentName: string;
    agent: AgentDefinition;
    effectiveAgent: AgentDefinition;
    modelOverride?: string | string[];
    /** Explicit pre-expansion model role alias selected for this run. */
    modelRole?: string;
    parentActiveModelPattern?: string;
    schema: StructuredSubagentSchemaResolution;
    planMode: boolean;
    isIsolated: boolean;
    mergeMode: "patch" | "branch";
    applyChanges: boolean;
    enableLsp: boolean;
    enableIrc: boolean;
}
/** Settled child execution plus data needed by the frontends' own rendering. */
export interface StructuredSubagentResult {
    result: SingleResult;
    policy: EffectiveSubagentPolicy;
    mergeSummary: string;
    changesApplied: boolean | null;
    artifactsDir: string;
    temporaryArtifacts: boolean;
}
/** Machine-readable failure category so adapters can retain their native errors. */
export declare class StructuredSubagentError extends Error {
    readonly kind: "preflight" | "isolation" | "execution";
    constructor(kind: "preflight" | "isolation" | "execution", message: string, options?: ErrorOptions);
}
/**
 * Resolve every policy shared by task and eval before allocating artifacts or
 * dispatching work. Callers translate {@link StructuredSubagentError} into
 * their own wire-level error surface.
 */
export declare function resolveEffectiveSubagentPolicy(request: StructuredSubagentRequest): Promise<EffectiveSubagentPolicy>;
/** Reserve a session-global agent id only after preflight has succeeded. */
export declare function reserveStructuredSubagentId(session: ToolSession, identity: StructuredSubagentIdentity | undefined): Promise<string>;
/**
 * Execute a validated subagent. Preflight errors occur before any artifact
 * lease or child dispatch; callers keep responsibility for their result text.
 */
export declare function runStructuredSubagent(request: StructuredSubagentRequest): Promise<StructuredSubagentResult>;
/** Build the recovery suffix used by adapters after an isolated failure. */
export declare function buildStructuredSubagentRecoveryHint(result: SingleResult, artifactsDir: string): Promise<string>;
