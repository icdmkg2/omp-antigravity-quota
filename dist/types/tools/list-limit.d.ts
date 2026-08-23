import type { LimitsMeta } from "./output-meta.js";
export interface ListLimitResult<T> {
    items: T[];
    limitReached?: number;
    meta: Partial<LimitsMeta>;
}
export interface ListLimitOptions {
    limit?: number;
    headLimit?: number;
    limitType?: "match" | "result";
}
export declare function applyListLimit<T>(items: T[], options: ListLimitOptions): ListLimitResult<T>;
