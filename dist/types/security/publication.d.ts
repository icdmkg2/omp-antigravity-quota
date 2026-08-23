import type { ToolDefinition } from "../extensibility/extensions/index.js";
import type { SecurityScanBundle, SecurityScanPlan } from "./contracts/index.js";
import { type SecurityStore } from "./store.js";
export declare const securityPublishSchema: import("@oh-my-pi/omptype").FluentType<{
    coverage: {
        completeness: "complete" | "partial" | "unknown";
        deferred?: {
            paths?: string[] | undefined;
            reason: string;
            surface_ids?: string[] | undefined;
        }[] | undefined;
        explicit_exclusions?: {
            pattern: string;
            reason: string;
        }[] | undefined;
        open_questions?: {
            follow_up_prompt?: string | undefined;
            question: string;
        }[] | undefined;
        surfaces?: {
            disposition: "needs_follow_up" | "no_issue_found" | "not_applicable" | "rejected" | "reported";
            label: string;
            notes?: string | undefined;
            receipt_refs?: string[] | undefined;
            risk_area?: string | undefined;
        }[] | undefined;
    };
    findings: {
        anchor?: string | undefined;
        category: string;
        confidence: "high" | "low" | "medium";
        cwe?: string[] | undefined;
        evidence?: {
            excerpt?: string | undefined;
            explanation: string;
            label: string;
            location?: {
                end_column?: number | undefined;
                end_line?: number | undefined;
                path: string;
                role?: string | undefined;
                start_column?: number | undefined;
                start_line: number;
            } | undefined;
        }[] | undefined;
        locations: {
            end_column?: number | undefined;
            end_line?: number | undefined;
            path: string;
            role?: string | undefined;
            start_column?: number | undefined;
            start_line: number;
        }[];
        remediation?: string | undefined;
        rule_id: string;
        severity: "critical" | "high" | "informational" | "low" | "medium";
        summary: string;
        title: string;
        validation?: "partial" | "unvalidated" | "validated" | undefined;
    }[];
    report: string;
}, {
    coverage: {
        completeness: "complete" | "partial" | "unknown";
        deferred?: {
            paths?: string[] | undefined;
            reason: string;
            surface_ids?: string[] | undefined;
        }[] | undefined;
        explicit_exclusions?: {
            pattern: string;
            reason: string;
        }[] | undefined;
        open_questions?: {
            follow_up_prompt?: string | undefined;
            question: string;
        }[] | undefined;
        surfaces?: {
            disposition: "needs_follow_up" | "no_issue_found" | "not_applicable" | "rejected" | "reported";
            label: string;
            notes?: string | undefined;
            receipt_refs?: string[] | undefined;
            risk_area?: string | undefined;
        }[] | undefined;
    };
    findings: {
        anchor?: string | undefined;
        category: string;
        confidence: "high" | "low" | "medium";
        cwe?: string[] | undefined;
        evidence?: {
            excerpt?: string | undefined;
            explanation: string;
            label: string;
            location?: {
                end_column?: number | undefined;
                end_line?: number | undefined;
                path: string;
                role?: string | undefined;
                start_column?: number | undefined;
                start_line: number;
            } | undefined;
        }[] | undefined;
        locations: {
            end_column?: number | undefined;
            end_line?: number | undefined;
            path: string;
            role?: string | undefined;
            start_column?: number | undefined;
            start_line: number;
        }[];
        remediation?: string | undefined;
        rule_id: string;
        severity: "critical" | "high" | "informational" | "low" | "medium";
        summary: string;
        title: string;
        validation?: "partial" | "unvalidated" | "validated" | undefined;
    }[];
    report: string;
}>;
export type SecurityPublishParams = typeof securityPublishSchema.infer;
export interface SecurityPublishDetails {
    scanId: string;
    findingCount: number;
    status: "completed";
}
export interface SecurityPublicationOptions {
    plan: SecurityScanPlan;
    scanId: string;
    store: SecurityStore;
    startedAt: string;
    sessionId?: string;
    operationId?: string;
    onPublished?: (bundle: SecurityScanBundle) => void | Promise<void>;
}
export declare function createSecurityPublicationTool(options: SecurityPublicationOptions): ToolDefinition<typeof securityPublishSchema, SecurityPublishDetails>;
