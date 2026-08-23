import type { UsageLimit, UsageReport } from "@oh-my-pi/pi-ai";
import type { OAuthAccountIdentity } from "../../session/auth-storage.js";
/**
 * Session marker label for an active OAuth identity: the base identifier
 * (email → accountId → projectId) suffixed with the organization when present
 * and distinct. Same-email Anthropic multi-org accounts share the base, so the
 * org suffix is the only field that tells the session's quota pool apart —
 * mirrors the account-list rows (`formatUsageReportAccount`) and login success.
 * Returns `undefined` when no identifier is recoverable.
 */
export declare function formatActiveAccountLabel(identity: OAuthAccountIdentity | undefined): string | undefined;
/**
 * True when a single usage-limit column belongs to the given OAuth identity.
 *
 * Single definition of the matching rules for both `/usage` renderers:
 * - `orgId`     ↔ report metadata `orgId` — a GATE that QUALIFIES the base
 *   identity, never a replacement for it. Mismatched org presence or
 *   different orgs never match: two subscriptions (orgs) can share one
 *   email, so an org-scoped identity matches only its own org's reports and
 *   an org-less legacy identity never claims an org-attributed report via
 *   the shared email. A SHARED org still requires the base-identity match
 *   below — Anthropic Team seats have per-user pools yet share the org id
 *   in report metadata. Only an org-only identity (no base identifiers
 *   recovered at all) matches on the org alone. When neither side carries
 *   an org, the base fallback applies unchanged (providers without orgs
 *   keep their former behavior).
 * - `accountId` ↔ report metadata `accountId`/`account_id` or `limit.scope.accountId`
 * - `email`     ↔ report metadata `email`
 * - `projectId` ↔ report metadata `projectId` or `limit.scope.projectId`
 *   (Google-style providers key usage on the GCP project, not an account id)
 */
export declare function limitMatchesActiveAccount(report: UsageReport, limit: UsageLimit, identity: OAuthAccountIdentity | undefined): boolean;
/** True when any limit column in `report` belongs to the given OAuth identity. */
export declare function reportMatchesActiveAccount(report: UsageReport, identity: OAuthAccountIdentity | undefined): boolean;
