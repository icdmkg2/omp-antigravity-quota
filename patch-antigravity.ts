#!/usr/bin/env bun
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const agentPkgDir = path.join(os.homedir(), ".bun/install/global/node_modules/@oh-my-pi/pi-coding-agent");
if (!fs.existsSync(agentPkgDir)) {
	console.error("OMP package directory not found at:", agentPkgDir);
	process.exit(1);
}

console.log("Applying Antigravity Quota patch to OMP...");

// 1. Patch settings-schema.ts
const schemaPath = path.join(agentPkgDir, "src/config/settings-schema.ts");
let schema = fs.readFileSync(schemaPath, "utf-8");
if (!schema.includes('"antigravity_quota"')) {
	schema = schema.replace('| "collab";', '| "collab"\n\t| "antigravity_quota";');
	fs.writeFileSync(schemaPath, schema, "utf-8");
	console.log("✔ Patched settings-schema.ts");
}

// 2. Patch types.ts
const typesPath = path.join(agentPkgDir, "src/modes/components/status-line/types.ts");
let types = fs.readFileSync(typesPath, "utf-8");
if (!types.includes("antigravityQuota")) {
	types = types.replace(
		/usage:\s*\{[\s\S]*?\}\s*\|\s*null;/,
		`usage: {
\t\ttier?: string;
\t\tfiveHour?: { percent: number; resetMinutes?: number };
\t\tsevenDay?: { percent: number; resetHours?: number };
\t\tmonthly?: { percent: number; resetHours?: number };
\t} | null;
\tantigravityQuota: AntigravityQuotaSnapshot | null;
}

export interface AntigravityQuotaWindow {
\tlabel: string;
\tremainingPercent: number;
\tresetMinutes?: number;
\tresetHours?: number;
}

export interface AntigravityQuotaSnapshot {
\tstatus: "ok" | "warning" | "exhausted" | "unavailable";
\tshortWindow?: AntigravityQuotaWindow;
\tweekWindow?: AntigravityQuotaWindow;`,
	);
	fs.writeFileSync(typesPath, types, "utf-8");
	console.log("✔ Patched types.ts");
}

// 3. Patch presets.ts
const presetsPath = path.join(agentPkgDir, "src/modes/components/status-line/presets.ts");
let presets = fs.readFileSync(presetsPath, "utf-8");
if (!presets.includes('"antigravity_quota"')) {
	presets = presets.replace(
		'leftSegments: ["pi", "model", "mode", "collab", "path", "git", "pr", "context_pct", "cost"],',
		'leftSegments: ["pi", "model", "mode", "collab", "path", "git", "pr", "context_pct", "cost", "antigravity_quota"],',
	);
	presets = presets.replace(
		'leftSegments: ["model", "mode", "path", "git", "pr"],\n\t\trightSegments: ["session_name", "token_total", "cost", "context_pct"],\n\t\tseparator: "powerline-thin",\n\t\tsegmentOptions: {},',
		`leftSegments: ["pi", "model", "mode", "collab", "path", "git", "pr", "context_pct", "cost", "antigravity_quota"],
\t\trightSegments: ["session_name"],
\t\tseparator: "powerline-thin",
\t\tsegmentOptions: {
\t\t\tmodel: { showThinkingLevel: true },
\t\t\tpath: { abbreviate: true, maxLength: 40, stripWorkPrefix: true },
\t\t\tgit: { showBranch: true, showStaged: true, showUnstaged: true, showUntracked: true },
\t\t},`,
	);
	fs.writeFileSync(presetsPath, presets, "utf-8");
	console.log("✔ Patched presets.ts");
}

// 4. Patch component.ts
const compPath = path.join(agentPkgDir, "src/modes/components/status-line/component.ts");
let comp = fs.readFileSync(compPath, "utf-8");
if (!comp.includes("antigravityQuota")) {
	comp = comp.replace(
		"import type {\n\tCollabStatus,",
		"import type {\n\tAntigravityQuotaSnapshot,\n\tAntigravityQuotaWindow,\n\tCollabStatus,",
	);
	comp = comp.replace(
		"#cachedUsage: {\n\t\ttier?: string;\n\t\tfiveHour?: { percent: number; resetMinutes?: number };\n\t\tsevenDay?: { percent: number; resetHours?: number };\n\t\tmonthly?: { percent: number; resetHours?: number };\n\t} | null = null;",
		`#cachedUsage: {
\t\ttier?: string;
\t\tfiveHour?: { percent: number; resetMinutes?: number };
\t\tsevenDay?: { percent: number; resetHours?: number };
\t\tmonthly?: { percent: number; resetHours?: number };
\t} | null = null;
\t#cachedAntigravityQuota: AntigravityQuotaSnapshot | null = null;`,
	);
	comp = comp.replace(
		"if (this.#usageFetchedAt > 0 && now - this.#usageFetchedAt < 5 * 60_000) return;",
		"if (this.#usageFetchedAt > 0 && now - this.#usageFetchedAt < 60_000) return;",
	);
	comp = comp.replace(
		"const usageChanged = this.#cachedUsage !== normalized;\n\t\tthis.#cachedUsage = normalized;\n\t\tthis.#usageFetchedAt = Date.now();\n\t\t// Usage fetch is async; without a repaint the top border stays blank until\n\t\t// some unrelated event (git resolve, keystroke, …) rebuilds it.\n\t\tif (usageChanged) this.#onBranchChange?.();",
		`const normalizedAntigravity = this.#normalizeAntigravityQuota(reports, {
\t\t\tprovider: activeProvider,
\t\t\tmodelId: activeModelId,
\t\t\tidentity: activeIdentity,
\t\t});
\t\tconst usageChanged = this.#cachedUsage !== normalized;
\t\tconst antigravityChanged = this.#cachedAntigravityQuota !== normalizedAntigravity;
\t\tthis.#cachedUsage = normalized;
\t\tthis.#cachedAntigravityQuota = normalizedAntigravity;
\t\tthis.#usageFetchedAt = Date.now();
\t\t// Usage fetch is async; without a repaint the top border stays blank until
\t\t// some unrelated event (git resolve, keystroke, …) rebuilds it.
\t\tif (usageChanged || antigravityChanged) this.#onBranchChange?.();`,
	);
	comp = comp.replace(
		"getCachedContextBreakdown(): { usedTokens: number; contextWindow: number } {",
		`#normalizeAntigravityQuota(
\t\treports: unknown,
\t\tcontext: { provider?: string; modelId?: string; identity?: OAuthAccountIdentity },
\t): AntigravityQuotaSnapshot | null {
\t\tif (!Array.isArray(reports)) return { status: "unavailable" };
\t\tconst activeProvider = context.provider?.toLowerCase();
\t\tconst isGoogleFamily =
\t\t\tactiveProvider === "google-antigravity" ||
\t\t\t(typeof context.modelId === "string" &&
\t\t\t\t(context.modelId.startsWith("google-antigravity/") || context.modelId.startsWith("gemini-")));
\t\tif (!isGoogleFamily) {
\t\t\treturn { status: "unavailable" };
\t\t}

\t\tconst report = reports.find(
\t\t\t(r: unknown): r is UsageReport =>
\t\t\t\tBoolean(
\t\t\t\t\tr &&
\t\t\t\t\t\ttypeof r === "object" &&
\t\t\t\t\t\t"provider" in r &&
\t\t\t\t\t\tr.provider === "google-antigravity" &&
\t\t\t\t\t\t"limits" in r &&
\t\t\t\t\t\tArray.isArray(r.limits),
\t\t\t\t),
\t\t);
\t\tif (!report || report.limits.length === 0) {
\t\t\treturn { status: "unavailable" };
\t\t}

\t\tconst googleLimits = report.limits.filter(limit => {
\t\t\tif (!limit || typeof limit !== "object") return false;
\t\t\tconst id = typeof limit.id === "string" ? limit.id.toLowerCase() : "";
\t\t\tconst label = typeof limit.label === "string" ? limit.label.toLowerCase() : "";
\t\t\tif (
\t\t\t\tid.includes(":google:") ||
\t\t\t\tid.includes("gemini") ||
\t\t\t\tlabel.includes("google") ||
\t\t\t\tlabel.includes("gemini")
\t\t\t) {
\t\t\t\treturn true;
\t\t\t}
\t\t\treturn !id.includes(":anthropic:") && !id.includes(":openai:");
\t\t});

\t\tconst limitsToUse = googleLimits.length > 0 ? googleLimits : report.limits;
\t\tconst now = Date.now();

\t\tlet shortWindow: AntigravityQuotaWindow | undefined;
\t\tlet weekWindow: AntigravityQuotaWindow | undefined;

\t\tfor (const limit of limitsToUse) {
\t\t\tif (!limit || typeof limit !== "object" || !limit.amount || typeof limit.amount !== "object") continue;
\t\t\tconst amount = limit.amount;
\t\t\tconst window = limit.window;
\t\t\tconst scope = limit.scope;

\t\t\tlet remainingPercent: number | undefined;
\t\t\tif (typeof amount.remainingFraction === "number" && Number.isFinite(amount.remainingFraction)) {
\t\t\t\tremainingPercent = amount.remainingFraction * 100;
\t\t\t} else if (typeof amount.remaining === "number" && Number.isFinite(amount.remaining)) {
\t\t\t\tremainingPercent = amount.remaining;
\t\t\t} else if (typeof amount.usedFraction === "number" && Number.isFinite(amount.usedFraction)) {
\t\t\t\tremainingPercent = (1 - amount.usedFraction) * 100;
\t\t\t} else if (typeof amount.used === "number" && Number.isFinite(amount.used)) {
\t\t\t\tremainingPercent = 100 - amount.used;
\t\t\t}
\t\t\tif (remainingPercent === undefined) continue;
\t\t\tremainingPercent = Math.max(0, Math.min(100, Math.round(remainingPercent)));

\t\t\tlet resetMinutes: number | undefined;
\t\t\tlet resetHours: number | undefined;
\t\t\tif (window && typeof window.resetsAt === "number" && Number.isFinite(window.resetsAt)) {
\t\t\t\tconst diffMs = Math.max(0, window.resetsAt - now);
\t\t\t\tresetMinutes = Math.round(diffMs / 60_000);
\t\t\t\tresetHours = Math.round(diffMs / 3_600_000);
\t\t\t}

\t\t\tconst windowId = (
\t\t\t\tscope && typeof scope.windowId === "string" ? scope.windowId : (window?.id ?? "")
\t\t\t).toLowerCase();
\t\t\tconst windowLabel = (window && typeof window.label === "string" ? window.label : "").toLowerCase();
\t\t\tconst durationMs = window && typeof window.durationMs === "number" ? window.durationMs : undefined;

\t\t\tconst is5h =
\t\t\t\twindowId === "5h" ||
\t\t\t\t(durationMs !== undefined && Math.abs(durationMs - 5 * 3_600_000) <= 60_000);
\t\t\tconst is24hOrDaily =
\t\t\t\twindowId === "24h" ||
\t\t\t\twindowId === "daily" ||
\t\t\t\twindowId === "1d" ||
\t\t\t\twindowLabel.includes("day") ||
\t\t\t\twindowLabel.includes("daily") ||
\t\t\t\t(durationMs !== undefined && Math.abs(durationMs - 24 * 3_600_000) <= 60_000);
\t\t\tconst isWeek =
\t\t\t\twindowId === "weekly" ||
\t\t\t\twindowId === "7d" ||
\t\t\t\twindowId === "week" ||
\t\t\t\twindowLabel.includes("week") ||
\t\t\t\t(durationMs !== undefined && Math.abs(durationMs - 7 * 86_400_000) <= 60_000);

\t\t\tif ((is5h || is24hOrDaily) && !shortWindow) {
\t\t\t\tshortWindow = {
\t\t\t\t\tlabel: "5h",
\t\t\t\t\tremainingPercent,
\t\t\t\t\tresetMinutes,
\t\t\t\t\tresetHours,
\t\t\t\t};
\t\t\t} else if (isWeek && !weekWindow) {
\t\t\t\tweekWindow = {
\t\t\t\t\tlabel: "week",
\t\t\t\t\tremainingPercent,
\t\t\t\t\tresetMinutes,
\t\t\t\t\tresetHours,
\t\t\t\t};
\t\t\t}
\t\t}

\t\tif (!shortWindow && !weekWindow) {
\t\t\treturn { status: "unavailable" };
\t\t}

\t\tlet status: "ok" | "warning" | "exhausted" = "ok";
\t\tconst minPercent = Math.min(
\t\t\tshortWindow?.remainingPercent ?? 100,
\t\t\tweekWindow?.remainingPercent ?? 100,
\t\t);
\t\tif (minPercent <= 0) {
\t\t\tstatus = "exhausted";
\t\t} else if (minPercent <= 10) {
\t\t\tstatus = "warning";
\t\t}

\t\treturn {
\t\t\tstatus,
\t\t\tshortWindow,
\t\t\tweekWindow,
\t\t};
\t}

\tgetCachedContextBreakdown(): { usedTokens: number; contextWindow: number } {`,
	);
	comp = comp.replace(
		"usage: this.#cachedUsage,",
		"usage: this.#cachedUsage,\n\t\t\tantigravityQuota: this.#cachedAntigravityQuota,",
	);
	comp = comp.replace(
		"const leftSegments = useCustomSegments\n\t\t\t? (this.#settings.leftSegments ?? presetDef.leftSegments)\n\t\t\t: presetDef.leftSegments;",
		"const leftSegments = useCustomSegments\n\t\t\t? (this.#settings.leftSegments && this.#settings.leftSegments.length > 0 ? this.#settings.leftSegments : presetDef.leftSegments)\n\t\t\t: presetDef.leftSegments;",
	);
	comp = comp.replace(
		"const rightSegments = useCustomSegments\n\t\t\t? (this.#settings.rightSegments ?? presetDef.rightSegments)\n\t\t\t: presetDef.rightSegments;",
		"const rightSegments = useCustomSegments\n\t\t\t? (this.#settings.rightSegments && this.#settings.rightSegments.length > 0 ? this.#settings.rightSegments : presetDef.rightSegments)\n\t\t\t: presetDef.rightSegments;",
	);
	fs.writeFileSync(compPath, comp, "utf-8");
	console.log("✔ Patched component.ts");
}

// 5. Patch segments.ts
const segPath = path.join(agentPkgDir, "src/modes/components/status-line/segments.ts");
let seg = fs.readFileSync(segPath, "utf-8");
if (!seg.includes("antigravity_quota")) {
	seg = seg.replace(
		"// ═══════════════════════════════════════════════════════════════════════════\n// Segment Registry",
		`const antigravityQuotaSegment: StatusLineSegment = {
\tid: "antigravity_quota",
\trender(ctx) {
\t\tconst q = ctx.antigravityQuota;
\t\tconst prefix = theme.fg("statusLineModel", "Gemini");
\t\tif (!q || q.status === "unavailable" || (!q.shortWindow && !q.weekWindow)) {
\t\t\treturn { content: "", visible: false };
\t\t}
\t\tconst parts: string[] = [];
\t\tconst includeReset = (ctx.width ?? 120) >= 90;
\t\tif (q.shortWindow) {
\t\t\tconst pct = q.shortWindow.remainingPercent;
\t\t\tconst pctText = theme.fg(pct <= 10 ? "error" : pct <= 25 ? "warning" : "muted", \`\${Math.round(pct)}%\`);
\t\t\tlet resetStr = "";
\t\t\tif (includeReset && q.shortWindow.resetMinutes !== undefined) {
\t\t\t\tconst m = q.shortWindow.resetMinutes;
\t\t\t\tconst formatted =
\t\t\t\t\tm < 60 ? \`\${m}m\` : m % 60 > 0 ? \`\${Math.floor(m / 60)}h\${m % 60}m\` : \`\${Math.floor(m / 60)}h\`;
\t\t\t\tresetStr = theme.fg("muted", \` (\${formatted})\`);
\t\t\t}
\t\t\tparts.push(\`\${q.shortWindow.label}:\${pctText}\${resetStr}\`);
\t\t}
\t\tif (q.weekWindow) {
\t\t\tconst pct = q.weekWindow.remainingPercent;
\t\t\tconst pctText = theme.fg(pct <= 10 ? "error" : pct <= 25 ? "warning" : "muted", \`\${Math.round(pct)}%\`);
\t\t\tlet resetStr = "";
\t\t\tif (includeReset && q.weekWindow.resetHours !== undefined) {
\t\t\t\tconst h = q.weekWindow.resetHours;
\t\t\t\tconst formatted =
\t\t\t\t\th < 24 ? \`\${h}h\` : h % 24 > 0 ? \`\${Math.floor(h / 24)}d\${h % 24}h\` : \`\${Math.floor(h / 24)}d\`;
\t\t\t\tresetStr = theme.fg("muted", \` (\${formatted})\`);
\t\t\t}
\t\t\tparts.push(\`\${q.weekWindow.label}:\${pctText}\${resetStr}\`);
\t\t}
\t\tif (parts.length === 0) {
\t\t\treturn { content: "", visible: false };
\t\t}
\t\treturn { content: \`\${prefix} \${parts.join(theme.sep.dot)}\`, visible: true };
\t},
};

// ═══════════════════════════════════════════════════════════════════════════
// Segment Registry`,
	);
	seg = seg.replace(
		"collab: collabSegment,\n};",
		"collab: collabSegment,\n\tantigravity_quota: antigravityQuotaSegment,\n};",
	);
	fs.writeFileSync(segPath, seg, "utf-8");
	console.log("✔ Patched segments.ts");
}

// 6. Rebuild dist/cli.js
const outDir = path.join(agentPkgDir, "dist");
const cliPath = path.join(outDir, "cli.js");

const ALWAYS_EXTERNAL = [
	"@oh-my-pi/pi-natives",
	"@huggingface/transformers",
	"fastembed",
	"onnxruntime-node",
	"omp-legacy-pi-modules",
];
const RUNTIME_EXTERNAL = ["puppeteer-core", "@babel/parser"];

console.log("Compiling OMP bundle...");
const output = await Bun.build({
	entrypoints: [path.join(agentPkgDir, "src/cli.ts")],
	outdir: outDir,
	target: "bun",
	external: [...ALWAYS_EXTERNAL, ...RUNTIME_EXTERNAL],
	minify: { identifiers: false, syntax: true, whitespace: false },
	sourcemap: "none",
	throw: false,
});

if (output.success) {
	const shebang = "#!/usr/bin/env bun\n";
	const text = await Bun.file(cliPath).text();
	if (!text.startsWith(shebang)) {
		const withoutExisting = text.startsWith("#!") ? text.slice(text.indexOf("\n") + 1) : text;
		await Bun.write(cliPath, shebang + withoutExisting);
	}
	console.log("✔ Rebuilt dist/cli.js successfully!");
	console.log("Done! You can now run `omp`.");
} else {
	console.error("Build failed:", output.logs);
	process.exit(1);
}
