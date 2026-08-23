# OMP with Live Google Antigravity Quota Status-Line

This repository contains the complete `@oh-my-pi/pi-coding-agent` package modified with a native, real-time **`antigravity_quota`** status-line segment and 1-click automated installers for Windows, macOS, and Linux.

---

## ⚡ 1-Click Instant Install

Clone the repository and run the installer for your system:

### 🪟 Windows
```powershell
# In PowerShell:
./install.ps1

# Or in Command Prompt:
install.bat

# Or using Bun directly:
bun install.ts
```

### 🍎 macOS & 🐧 Linux
```bash
./install.sh

# Or using Bun directly:
bun install.ts
```

The installer will automatically:
1. Patch your local OMP installation.
2. Compile the standalone CLI bundle.
3. Configure your status line in `~/.omp/agent/config.yml`.
4. Install the auto-updater so future `omp update` runs automatically re-apply the feature.

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

## 🔄 Self-Healing / What to do after running `omp update`

`omp update` is hooked to automatically re-apply the patch in the background.

If you ever need to manually re-apply or repair after a full package reinstall:
```bash
bun install.ts
```

---

## 🧪 Testing

Run the included unit test suite:
```bash
bun test
```
All tests, including `src/modes/components/status-line/antigravity-quota.test.ts`, run via Bun's native test runner.

---

## 📂 Project Structure

* `install.ts` / `install.ps1` / `install.sh` / `install.bat` — 1-click cross-platform installer scripts.
* `src/modes/components/status-line/`
  * `segments.ts` — `antigravityQuotaSegment` renderer with remaining percentage and countdown calculation.
  * `component.ts` — Background polling, 60s cache TTL, and `#normalizeAntigravityQuota`.
  * `types.ts` — `AntigravityQuotaSnapshot` and `AntigravityQuotaWindow` data structures.
  * `presets.ts` — Default and custom status line preset definitions.
  * `antigravity-quota.test.ts` — Unit tests for the segment.
* `src/config/settings-schema.ts` — `StatusLineSegmentId` schema and validation.
* `patch-antigravity.ts` — Standalone updater/patcher script.
* `dist/cli.js` — Compiled standalone executable bundle.
