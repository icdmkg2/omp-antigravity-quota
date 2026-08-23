/**
 * Generate memorable two-word task identifiers.
 * Format: AdjectiveNoun (e.g., "SwiftFalcon", "CalmPanda")
 *
 * Dictionaries sourced from unique-names-generator (MIT license).
 * 1202 adjectives × 355 animals = 426,710 combinations.
 */
/**
 * Generate a unique two-word identifier (e.g., "SwiftFalcon").
 * Falls back to numeric suffix if all combinations exhausted.
 */
export declare function generateTaskName(): string;
/**
 * Reset name generator state (for testing).
 */
export declare function resetTaskNames(): void;
