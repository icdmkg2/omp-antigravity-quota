import type { AgentToolContext } from "@oh-my-pi/pi-agent-core";
import { type OutputSummary } from "../session/streaming-output.js";
export interface BashInteractiveResult extends OutputSummary {
    exitCode: number | undefined;
    cancelled: boolean;
    timedOut: boolean;
}
export declare function runInteractiveBashPty(ui: NonNullable<AgentToolContext["ui"]>, options: {
    command: string;
    cwd: string;
    timeoutMs?: number;
    signal?: AbortSignal;
    env?: Record<string, string>;
    artifactPath?: string;
    artifactId?: string;
}): Promise<BashInteractiveResult>;
