import type { SplitCommitGroup } from "./state.js";
export declare function computeDependencyOrder(groups: SplitCommitGroup[]): number[] | {
    error: string;
};
