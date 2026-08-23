import type { CustomTool } from "../../../extensibility/custom-tools/types.js";
declare const gitHunkSchema: import("@oh-my-pi/omptype").FluentType<{
    file: string;
    hunks?: number[] | undefined;
    staged?: boolean | undefined;
}, {
    file: string;
    hunks?: number[] | undefined;
    staged?: boolean | undefined;
}>;
export declare function createGitHunkTool(cwd: string): CustomTool<typeof gitHunkSchema>;
export {};
