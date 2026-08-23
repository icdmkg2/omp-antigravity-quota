export declare const commitTypeSchema: import("@oh-my-pi/omptype").FluentType<"build" | "chore" | "ci" | "docs" | "feat" | "fix" | "perf" | "refactor" | "revert" | "style" | "test", "build" | "chore" | "ci" | "docs" | "feat" | "fix" | "perf" | "refactor" | "revert" | "style" | "test">;
export declare const detailSchema: import("@oh-my-pi/omptype").FluentType<{
    changelog_category?: "Added" | "Breaking Changes" | "Changed" | "Deprecated" | "Fixed" | "Removed" | "Security" | undefined;
    text: string;
    user_visible?: boolean | undefined;
}, {
    changelog_category?: "Added" | "Breaking Changes" | "Changed" | "Deprecated" | "Fixed" | "Removed" | "Security" | undefined;
    text: string;
    user_visible?: boolean | undefined;
}>;
