export declare function rewriteImports(code: string): Promise<string>;
export declare function collectModuleSourceSpecifiers(code: string): Promise<string[]>;
export declare function rewriteModuleSourceSpecifiers(code: string, replacer: (source: string) => string): Promise<string>;
export declare function rewriteDynamicImports(code: string, callee?: string): Promise<string>;
/**
 * Strip TypeScript syntax (type annotations, type-only imports/exports, `interface`, `as`,
 * `satisfies`, generics in call expressions, etc.) before the import/lexical rewriters parse
 * the code. Bun's native transpiler preserves `import`/`export` declarations, so downstream
 * Babel rewrites still control module resolution.
 *
 * Eval cells use a cheap "looks like TS" heuristic to avoid transpiling ordinary JS. Known
 * TypeScript modules pass `force` because a file can contain TS-only module syntax such as
 * `import type` without any value-level type annotations.
 */
type TypeScriptStripLoader = "ts" | "tsx";
export declare function stripTypeScriptSyntax(code: string, options?: {
    force?: boolean;
    loader?: TypeScriptStripLoader;
}): string;
export declare function wrapCode(code: string): Promise<{
    source: string;
    asyncWrapped: boolean;
    finalExpressionReturned: boolean;
}>;
export {};
