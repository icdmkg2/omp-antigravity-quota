#!/usr/bin/env bun
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execSync } from "node:child_process";

console.log("\x1b[36m=====================================================\x1b[0m");
console.log("\x1b[1;32m  OMP Live Google Antigravity Quota Installer\x1b[0m");
console.log("\x1b[36m=====================================================\x1b[0m\n");

const homeDir = os.homedir();
const agentDir = path.join(homeDir, ".omp/agent");
const agentPkgDir = path.join(homeDir, ".bun/install/global/node_modules/@oh-my-pi/pi-coding-agent");

if (!fs.existsSync(agentDir)) {
	fs.mkdirSync(agentDir, { recursive: true });
}

if (!fs.existsSync(agentPkgDir)) {
	console.error("\x1b[31m[ERROR] OMP package not found at:\x1b[0m", agentPkgDir);
	console.error("Please ensure OMP is installed globally via `bun install -g @oh-my-pi/pi-coding-agent` or `omp`.");
	process.exit(1);
}

// 1. Copy patcher script to ~/.omp/agent/
const currentPatchScript = path.join(import.meta.dir, "patch-antigravity.ts");
const targetPatchScript = path.join(agentDir, "patch-antigravity.ts");

if (fs.existsSync(currentPatchScript)) {
	fs.copyFileSync(currentPatchScript, targetPatchScript);
	console.log("\x1b[32m✔\x1b[0m Saved permanent updater script to ~/.omp/agent/patch-antigravity.ts");
}

// 2. Run the patcher script
console.log("\x1b[33m⏳\x1b[0m Patching and compiling OMP status-line...");
try {
	execSync(`bun "${targetPatchScript}"`, { stdio: "inherit" });
} catch (error) {
	console.error("\x1b[31m[ERROR] Patch failed:\x1b[0m", error);
	process.exit(1);
}

// 3. Configure statusLine in ~/.omp/agent/config.yml
console.log("\x1b[33m⏳\x1b[0m Configuring status line in config.yml...");
try {
	execSync("omp config set statusLine.preset custom", { stdio: "ignore" });
	execSync(
		'omp config set statusLine.leftSegments \'["pi","model","mode","collab","path","git","pr","context_pct","cost","antigravity_quota"]\'',
		{ stdio: "ignore" },
	);
	execSync('omp config set statusLine.rightSegments \'["session_name"]\'', { stdio: "ignore" });
	console.log("\x1b[32m✔\x1b[0m Configured statusLine with antigravity_quota segment");
} catch {
	// Fallback direct YAML edit if CLI invocation failed
	const configPath = path.join(agentDir, "config.yml");
	let content = fs.existsSync(configPath) ? fs.readFileSync(configPath, "utf-8") : "";
	if (!content.includes("antigravity_quota")) {
		if (content.includes("statusLine:")) {
			content = content.replace(/statusLine:\s*\n([\s\S]*?)(?=\n\S|$)/, `statusLine: 
  preset: custom
  separator: powerline-thin
  compactThinkingLevel: false
  showHookStatus: true
  leftSegments: 
    - pi
    - model
    - mode
    - collab
    - path
    - git
    - pr
    - context_pct
    - cost
    - antigravity_quota
  rightSegments: 
    - session_name`);
		} else {
			content += `\nstatusLine: 
  preset: custom
  separator: powerline-thin
  compactThinkingLevel: false
  showHookStatus: true
  leftSegments: 
    - pi
    - model
    - mode
    - collab
    - path
    - git
    - pr
    - context_pct
    - cost
    - antigravity_quota
  rightSegments: 
    - session_name\n`;
		}
		fs.writeFileSync(configPath, content, "utf-8");
	}
	console.log("\x1b[32m✔\x1b[0m Configured config.yml directly");
}

console.log("\n\x1b[1;32m=====================================================");
console.log("  Installation Complete! 🎉");
console.log("=====================================================\x1b[0m");
console.log("\nLaunch OMP by running: \x1b[1;36momp\x1b[0m");
console.log("You will now see your live Google Antigravity quota in the status bar:\n");
console.log("  \x1b[90mπ · ⬢ gemini-3.7-flash · 📁 iot · ⑂ main · ◫ 12.0%/200K · $0.00 · \x1b[36mGemini 5h:41% (2h16m)\x1b[90m · \x1b[36mweek:100%\x1b[0m\n");
