/**
 * Review-finding shapes and priority helpers.
 *
 * The `report_finding` tool was removed; reviewers now record findings through
 * incremental `yield` sections (`type: ["findings"]`). These parsers and
 * priority-display helpers back the reviewer render path in `task/render.ts`.
 */
import type { ThemeColor } from "../modes/theme/theme.js";
export type FindingPriority = "P0" | "P1" | "P2" | "P3";
export interface FindingPriorityInfo {
    ord: 0 | 1 | 2 | 3;
    symbol: "status.error" | "status.warning" | "status.info";
    color: ThemeColor;
}
export declare const PRIORITY_LABELS: FindingPriority[];
export declare function isFindingPriority(value: unknown): value is FindingPriority;
export declare function getPriorityInfo(priority: FindingPriority): FindingPriorityInfo;
interface FindingDetails {
    title: string;
    body: string;
    priority: FindingPriority;
    confidence: number;
    file_path: string;
    line_start: number;
    line_end: number;
}
export declare function parseFindingDetails(value: unknown): FindingDetails | undefined;
/** SubmitReviewDetails - used for rendering review results from yield tool */
export interface SubmitReviewDetails {
    overall_correctness: "correct" | "incorrect";
    explanation: string;
    confidence: number;
}
export type { FindingDetails };
