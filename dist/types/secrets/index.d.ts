import { type SecretEntry, SecretObfuscator } from "./obfuscator.js";
/**
 * Per-install secret key for the placeholder digest. Persisted under XDG state
 * and never sent to a provider, so model-visible placeholders cannot be reversed
 * by dictionary-hashing candidate secrets. Stable across sessions so persisted
 * transcripts deobfuscate consistently. Defaults to `getSecretPlaceholderKeyPath()`
 * — `$XDG_STATE_HOME/omp/secret-placeholder.key` (or `~/.omp/agent/secret-placeholder.key`
 * without XDG), per docs/secrets.md.
 */
export declare function getSecretPlaceholderKey(keyDir?: string): Promise<string>;
/** Return an existing placeholder key for redaction without creating a new key file. */
export declare function getExistingSecretPlaceholderKey(keyDir?: string): Promise<string | undefined>;
/**
 * Synchronous variant of `getSecretPlaceholderKey` for the lazy key provider
 * `SecretObfuscator` invokes inside its synchronous `obfuscate()` path when a
 * built-in credential-pattern entry first matches session content. Never
 * throws: an unreadable or unwritable key file degrades to a process-ephemeral
 * key (with a warning) instead of breaking the session.
 */
export declare function getSecretPlaceholderKeySync(keyDir?: string): string;
export { deobfuscateSessionContext, deobfuscateToolArguments, obfuscateMessages, obfuscateProviderContext, } from "./message-transform.js";
export { type SecretEntry, SecretObfuscator } from "./obfuscator.js";
export { secretEntriesNeedPlaceholderKey, secretEntryNeedsPlaceholderKey } from "./placeholder.js";
/**
 * Load secrets from project-local and global secrets.yml files.
 * Project-local entries override global entries with matching content.
 */
export declare function loadSecrets(cwd: string, agentDir: string): Promise<SecretEntry[]>;
/** Collect environment variable values that look like secrets. */
export declare function collectEnvSecrets(): SecretEntry[];
/**
 * Built-in entries covering credential-shaped tokens (GitHub/GitLab/OpenAI-style
 * API keys) that are NOT configured via secrets.yml or the environment. Without
 * these, such a token in a tool result falls through to pi-ai's irreversible
 * provider-boundary redaction (`[openai_token_redacted]`); the model then echoes
 * that placeholder into edit-tool `old_string`, which can never match the real
 * bytes on disk (issue #6968). Routing the same shapes through the obfuscator
 * mints reversible keyed placeholders that `deobfuscateToolArguments` restores
 * before tool execution, keeping exact-match edits working while the credential
 * bytes still never reach the provider. Unlike the pi-ai redaction there is no
 * entropy gate here — a false positive only over-obfuscates, which stays
 * transparent because the round trip is lossless.
 */
export declare function builtinCredentialSecretEntries(): SecretEntry[];
/**
 * Build the session secret obfuscator from every configured source: secrets.yml
 * (project + global), secret-shaped environment variables, and the built-in
 * credential patterns. Callers gate on `secrets.enabled`.
 *
 * Only CONFIGURED entries force startup key creation: a configured
 * obfuscate-mode secret — or a default (no custom `replacement`) replace-mode
 * regex whose key-derived idempotent fallback marker needs a stable key across
 * restarts (see `secretEntryNeedsPlaceholderKey`) — mints placeholders as soon
 * as the obfuscator is built. The built-in credential-pattern entry matches
 * dynamically, so it resolves the persisted key lazily on first match instead
 * of creating the key file for every secrets-enabled session.
 *
 * When no configured entry produced an active secret but a persisted key
 * exists, returns a redaction-only obfuscator so a tool read of the key file
 * does not ship the reusable HMAC key to the provider. Returns undefined when
 * there is nothing to protect.
 *
 * `keyDir` is the explicit agent dir override for the placeholder-key file
 * (default XDG/agent location when omitted).
 */
export declare function buildSecretObfuscator(cwd: string, agentDir: string, keyDir?: string): Promise<SecretObfuscator | undefined>;
