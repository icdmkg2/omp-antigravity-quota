# OMP with Live Google Antigravity Quota Status-Line

This repository contains the complete `@oh-my-pi/pi-coding-agent` package modified with a native, real-time **`antigravity_quota`** status-line segment.

---

## 🌟 Feature Overview

The `antigravity_quota` status-line segment displays your authenticated **Google Antigravity** subscription quotas in real-time right inside your OMP status bar:

```text
π · ⬢ gemini-3.7-flash · 📁 iot · ⑂ main · ◫ 12.0%/200K · $0.00 · Gemini 5h:41% (2h16m) · week:100%
```

### Key Highlights
* **Remaining Percentages**: Shows real remaining capacity (e.g. `5h:41%` and `week:100%`) instead of used fractions.
* **Smart Countdown**: Shows live reset countdowns (e.g. `(2h16m)`, `(3d)`) when terminal width permits ($\ge 90$ cols), and compacts them when width is constrained.
* **Auto-Refresh**: Non-blocking 60-second background polling queries the Google Antigravity backend without stalling typing, tool calls, or streaming.
* **Color Thresholds**: Muted above $25\%$, warning below $25\%$, and error below $10\%$ remaining.
* **Graceful Degradation**: Shows `Gemini quota: —` when offline, unauthenticated, or on a non-Google provider.

---

## 🚀 Quick Setup / Installation

### 1. Apply to your local OMP installation
Run the included 1-click patcher:
```bash
bun patch-antigravity.ts
```

### 2. Configure your Status Line
Set your status line preset to `custom` and configure the segment list in `~/.omp/agent/config.yml`:

```bash
omp config set statusLine.preset custom
omp config set statusLine.leftSegments '["pi","model","mode","collab","path","git","pr","context_pct","cost","antigravity_quota"]'
omp config set statusLine.rightSegments '["session_name"]'
```

### 3. Restart OMP
Exit any running session and launch `omp`:
```bash
omp
```

---

## 🔄 What to do after running `omp update`

Whenever you update OMP via `omp update` or `bun update -g`:
1. Open this folder and run:
   ```bash
   bun patch-antigravity.ts
   ```
2. The patcher will automatically update OMP's sources, recompile `dist/cli.js`, and restore your status line in **under 1 second**.

---

## 🧪 Testing

Run the included unit test suite:
```bash
bun test
```
All tests, including `src/modes/components/status-line/antigravity-quota.test.ts`, run via Bun's native test runner.

---

## 📂 Project Structure

* `src/modes/components/status-line/`
  * `segments.ts` — `antigravityQuotaSegment` renderer with remaining percentage and countdown calculation.
  * `component.ts` — Background polling, 60s cache TTL, and `#normalizeAntigravityQuota`.
  * `types.ts` — `AntigravityQuotaSnapshot` and `AntigravityQuotaWindow` data structures.
  * `presets.ts` — Default and custom status line preset definitions.
  * `antigravity-quota.test.ts` — Unit tests for the segment.
* `src/config/settings-schema.ts` — `StatusLineSegmentId` schema and validation.
* `patch-antigravity.ts` — Standalone updater/patcher script.
* `dist/cli.js` — Compiled standalone executable bundle.
