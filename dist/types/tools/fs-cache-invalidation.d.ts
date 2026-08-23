/**
 * Invalidate shared filesystem scan caches after a content write/update.
 */
export declare function invalidateFsScanAfterWrite(path: string): void;
/**
 * Invalidate shared filesystem scan caches after deleting a file.
 */
export declare function invalidateFsScanAfterDelete(path: string): void;
/**
 * Invalidate shared filesystem scan caches after a rename/move.
 *
 * Some watchers care about the disappearance at the old path; others about the
 * appearance at the new one. Bust both to keep callers honest.
 */
export declare function invalidateFsScanAfterRename(oldPath: string, newPath: string): void;
