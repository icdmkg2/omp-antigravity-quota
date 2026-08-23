import { beforeAll, describe, expect, it } from "bun:test";
import { initThemeSync, theme } from "../../../modes/theme/theme";
import { ALL_SEGMENT_IDS, SEGMENTS, renderSegment } from "./segments";
import type { SegmentContext } from "./types";

function stripAnsi(text: string): string {
	return text.replace(/\x1b\[[0-9;]*m/g, "");
}

function createMockContext(overrides: Partial<SegmentContext> = {}): SegmentContext {
	return {
		session: {} as never,
		activeRepo: null,
		width: 120,
		options: {},
		compactThinkingLevel: false,
		planMode: null,
		prewalk: null,
		loopMode: null,
		goalMode: null,
		vibeMode: null,
		collab: null,
		usageStats: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			totalTokens: 0,
			orchestrationInput: 0,
			orchestrationOutput: 0,
			orchestrationCacheRead: 0,
			premiumRequests: 0,
			cost: 0,
			tokensPerSecond: null,
		},
		contextPercent: null,
		contextTokens: 0,
		contextWindow: 200_000,
		autoCompactEnabled: true,
		compactionSpeculation: "idle",
		speculationBlinkOn: false,
		subagentCount: 0,
		activeMs: 0,
		git: { branch: null, status: null, pr: null },
		worktree: null,
		usage: null,
		antigravityQuota: null,
		...overrides,
	};
}

describe("antigravity_quota segment", () => {
	beforeAll(() => {
		initThemeSync();
	});

	it("is registered in ALL_SEGMENT_IDS and SEGMENTS", () => {
		expect(ALL_SEGMENT_IDS).toContain("antigravity_quota");
		expect(SEGMENTS.antigravity_quota).toBeDefined();
		expect(SEGMENTS.antigravity_quota.id).toBe("antigravity_quota");
	});

	it("hides completely when quota is unavailable or offline", () => {
		const ctx = createMockContext({
			antigravityQuota: { status: "unavailable" },
		});
		const res = renderSegment("antigravity_quota", ctx);
		expect(res.visible).toBe(false);
		expect(res.content).toBe("");
	});

	it("hides completely when quota is null", () => {
		const ctx = createMockContext({ antigravityQuota: null });
		const res = renderSegment("antigravity_quota", ctx);
		expect(res.visible).toBe(false);
		expect(res.content).toBe("");
	});

	it("renders 5h and weekly remaining quota with reset countdowns at normal width", () => {
		const ctx = createMockContext({
			width: 120,
			antigravityQuota: {
				status: "ok",
				shortWindow: {
					label: "5h",
					remainingPercent: 44,
					resetMinutes: 95,
				},
				weekWindow: {
					label: "week",
					remainingPercent: 89,
					resetHours: 72,
				},
			},
		});
		const res = renderSegment("antigravity_quota", ctx);
		expect(res.visible).toBe(true);
		const plain = stripAnsi(res.content);
		expect(plain).toBe("Gemini 5h:44% (1h35m) · week:89% (3d)");
	});

	it("renders 5h and weekly remaining quota with live data shapes", () => {
		const ctx = createMockContext({
			width: 120,
			antigravityQuota: {
				status: "ok",
				shortWindow: {
					label: "5h",
					remainingPercent: 41,
					resetMinutes: 136,
				},
				weekWindow: {
					label: "week",
					remainingPercent: 100,
					resetHours: 140,
				},
			},
		});
		const res = renderSegment("antigravity_quota", ctx);
		expect(res.visible).toBe(true);
		const plain = stripAnsi(res.content);
		expect(plain).toBe("Gemini 5h:41% (2h16m) · week:100% (5d20h)");
	});

	it("omits reset countdowns when terminal width is narrow (< 90)", () => {
		const ctx = createMockContext({
			width: 80,
			antigravityQuota: {
				status: "ok",
				shortWindow: {
					label: "5h",
					remainingPercent: 44,
					resetMinutes: 95,
				},
				weekWindow: {
					label: "week",
					remainingPercent: 89,
					resetHours: 72,
				},
			},
		});
		const res = renderSegment("antigravity_quota", ctx);
		expect(res.visible).toBe(true);
		const plain = stripAnsi(res.content);
		expect(plain).toBe("Gemini 5h:44% · week:89%");
	});

	it("renders single 5h window when only daily/5h quota is present", () => {
		const ctx = createMockContext({
			width: 100,
			antigravityQuota: {
				status: "ok",
				shortWindow: {
					label: "5h",
					remainingPercent: 41,
					resetMinutes: 136,
				},
			},
		});
		const res = renderSegment("antigravity_quota", ctx);
		expect(res.visible).toBe(true);
		const plain = stripAnsi(res.content);
		expect(plain).toBe("Gemini 5h:41% (2h16m)");
	});

	it("applies warning color when remaining quota is low (<= 25%) and error when critical (<= 10%)", () => {
		const ctxWarning = createMockContext({
			antigravityQuota: {
				status: "warning",
				shortWindow: {
					label: "5h",
					remainingPercent: 20,
				},
			},
		});
		const resWarning = renderSegment("antigravity_quota", ctxWarning);
		expect(resWarning.content).toContain(theme.fg("warning", "20%"));

		const ctxError = createMockContext({
			antigravityQuota: {
				status: "exhausted",
				shortWindow: {
					label: "5h",
					remainingPercent: 5,
				},
			},
		});
		const resError = renderSegment("antigravity_quota", ctxError);
		expect(resError.content).toContain(theme.fg("error", "5%"));
	});
});
