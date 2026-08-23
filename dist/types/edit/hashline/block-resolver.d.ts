/**
 * Tree-sitter-backed {@link BlockResolver} for the hashline `N*` locator.
 * Bridges the pure hashline seam to the native `blockRangeAt` primitive in
 * `@oh-my-pi/pi-natives`, which infers the language from the file path and
 * returns the 1-indexed line span of the syntactic block beginning on the
 * requested line (or `null` when none can be resolved).
 */
import type { BlockResolver } from "@oh-my-pi/hashline";
export declare const nativeBlockResolver: BlockResolver;
