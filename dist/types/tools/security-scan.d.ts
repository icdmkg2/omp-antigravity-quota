import type { AgentTool, AgentToolResult, ToolTier } from "@oh-my-pi/pi-agent-core";
import { type CodexSecurityCloudConfiguration, type CodexSecurityCloudStats } from "../security/cloud.js";
import { type SecurityValidationStatus } from "../security/contracts/index.js";
import type { SecurityOperationSnapshot } from "../security/coordinator.js";
import type { ToolSession } from "./index.js";
declare const securityScanSchema: import("@oh-my-pi/omptype").FluentType<{
    action: "cancel" | "cloud_pull" | "cloud_scans" | "cloud_start" | "cloud_status" | "preflight" | "start" | "status" | "validate";
    archive_existing?: boolean | undefined;
    base_revision?: string | undefined;
    cloud_configuration_id?: string | undefined;
    credential_id?: number | undefined;
    environment_id?: string | undefined;
    exclude_paths?: string[] | undefined;
    finding_id?: string | undefined;
    head_revision?: string | undefined;
    include_paths?: string[] | undefined;
    knowledge_base_paths?: string[] | undefined;
    lookback_days?: number | "all" | undefined;
    operation_id?: string | undefined;
    output_root?: string | undefined;
    plan_id?: string | undefined;
    repository_id?: string | undefined;
    repository_url?: string | undefined;
    scan_id?: string | undefined;
    target_kind?: "ref_diff" | "repository" | "scoped_path" | "working_tree" | undefined;
    validation_evidence?: {
        explanation: string;
        label: string;
    }[] | undefined;
    validation_status?: "error" | "partial" | "rejected" | "unvalidated" | "validated" | undefined;
    validation_summary?: string | undefined;
}, {
    action: "cancel" | "cloud_pull" | "cloud_scans" | "cloud_start" | "cloud_status" | "preflight" | "start" | "status" | "validate";
    archive_existing?: boolean | undefined;
    base_revision?: string | undefined;
    cloud_configuration_id?: string | undefined;
    credential_id?: number | undefined;
    environment_id?: string | undefined;
    exclude_paths?: string[] | undefined;
    finding_id?: string | undefined;
    head_revision?: string | undefined;
    include_paths?: string[] | undefined;
    knowledge_base_paths?: string[] | undefined;
    lookback_days?: number | "all" | undefined;
    operation_id?: string | undefined;
    output_root?: string | undefined;
    plan_id?: string | undefined;
    repository_id?: string | undefined;
    repository_url?: string | undefined;
    scan_id?: string | undefined;
    target_kind?: "ref_diff" | "repository" | "scoped_path" | "working_tree" | undefined;
    validation_evidence?: {
        explanation: string;
        label: string;
    }[] | undefined;
    validation_status?: "error" | "partial" | "rejected" | "unvalidated" | "validated" | undefined;
    validation_summary?: string | undefined;
}>;
type SecurityScanParams = typeof securityScanSchema.infer;
export interface SecurityScanToolDetails {
    action: SecurityScanParams["action"];
    plan?: {
        id: string;
        fingerprint: string;
    };
    operation?: SecurityOperationSnapshot;
    cancelled?: boolean;
    finding?: {
        id: string;
        validationStatus: SecurityValidationStatus;
    };
    cloudConfigurations?: CodexSecurityCloudConfiguration[];
    cloudStats?: CodexSecurityCloudStats;
    cloudScan?: {
        id: string;
        repositoryUrl: string;
    };
    importedScan?: {
        id: string;
        findingCount: number;
    };
}
export declare class SecurityScanTool implements AgentTool<typeof securityScanSchema, SecurityScanToolDetails> {
    readonly session: ToolSession;
    readonly name = "security_scan";
    readonly approval: ToolTier;
    readonly label = "Security Scan";
    readonly loadMode = "discoverable";
    readonly summary = "Run OMP-native scans and explicit Codex Security cloud operations";
    readonly description: string;
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        action: "cancel" | "cloud_pull" | "cloud_scans" | "cloud_start" | "cloud_status" | "preflight" | "start" | "status" | "validate";
        archive_existing?: boolean | undefined;
        base_revision?: string | undefined;
        cloud_configuration_id?: string | undefined;
        credential_id?: number | undefined;
        environment_id?: string | undefined;
        exclude_paths?: string[] | undefined;
        finding_id?: string | undefined;
        head_revision?: string | undefined;
        include_paths?: string[] | undefined;
        knowledge_base_paths?: string[] | undefined;
        lookback_days?: number | "all" | undefined;
        operation_id?: string | undefined;
        output_root?: string | undefined;
        plan_id?: string | undefined;
        repository_id?: string | undefined;
        repository_url?: string | undefined;
        scan_id?: string | undefined;
        target_kind?: "ref_diff" | "repository" | "scoped_path" | "working_tree" | undefined;
        validation_evidence?: {
            explanation: string;
            label: string;
        }[] | undefined;
        validation_status?: "error" | "partial" | "rejected" | "unvalidated" | "validated" | undefined;
        validation_summary?: string | undefined;
    }, {
        action: "cancel" | "cloud_pull" | "cloud_scans" | "cloud_start" | "cloud_status" | "preflight" | "start" | "status" | "validate";
        archive_existing?: boolean | undefined;
        base_revision?: string | undefined;
        cloud_configuration_id?: string | undefined;
        credential_id?: number | undefined;
        environment_id?: string | undefined;
        exclude_paths?: string[] | undefined;
        finding_id?: string | undefined;
        head_revision?: string | undefined;
        include_paths?: string[] | undefined;
        knowledge_base_paths?: string[] | undefined;
        lookback_days?: number | "all" | undefined;
        operation_id?: string | undefined;
        output_root?: string | undefined;
        plan_id?: string | undefined;
        repository_id?: string | undefined;
        repository_url?: string | undefined;
        scan_id?: string | undefined;
        target_kind?: "ref_diff" | "repository" | "scoped_path" | "working_tree" | undefined;
        validation_evidence?: {
            explanation: string;
            label: string;
        }[] | undefined;
        validation_status?: "error" | "partial" | "rejected" | "unvalidated" | "validated" | undefined;
        validation_summary?: string | undefined;
    }>;
    readonly strict = true;
    constructor(session: ToolSession);
    execute(_toolCallId: string, params: SecurityScanParams, signal?: AbortSignal): Promise<AgentToolResult<SecurityScanToolDetails>>;
}
export {};
