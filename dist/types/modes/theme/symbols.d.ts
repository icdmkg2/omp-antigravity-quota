export type SymbolPreset = "unicode" | "nerd" | "ascii";
/**
 * All available symbol keys organized by category.
 */
export type SymbolKey = "status.success" | "status.error" | "status.warning" | "status.info" | "status.pending" | "status.disabled" | "status.enabled" | "status.running" | "status.shadowed" | "status.aborted" | "status.done" | "nav.cursor" | "nav.selected" | "nav.expand" | "nav.collapse" | "nav.back" | "tree.branch" | "tree.last" | "tree.vertical" | "tree.horizontal" | "tree.hook" | "progress.filled" | "progress.empty" | "context.speculation" | "context.compaction" | "boxRound.topLeft" | "boxRound.topRight" | "boxRound.bottomLeft" | "boxRound.bottomRight" | "boxRound.horizontal" | "boxRound.vertical" | "boxSharp.topLeft" | "boxSharp.topRight" | "boxSharp.bottomLeft" | "boxSharp.bottomRight" | "boxSharp.horizontal" | "boxSharp.vertical" | "boxSharp.cross" | "boxSharp.teeDown" | "boxSharp.teeUp" | "boxSharp.teeRight" | "boxSharp.teeLeft" | "sep.powerline" | "sep.powerlineThin" | "sep.powerlineLeft" | "sep.powerlineRight" | "sep.powerlineThinLeft" | "sep.powerlineThinRight" | "sep.block" | "sep.space" | "sep.asciiLeft" | "sep.asciiRight" | "sep.dot" | "sep.slash" | "sep.pipe" | "icon.model" | "icon.plan" | "icon.prewalk" | "icon.goal" | "icon.pause" | "icon.loop" | "icon.folder" | "icon.worktree" | "icon.search" | "icon.scratchFolder" | "icon.file" | "icon.git" | "icon.branch" | "icon.pr" | "icon.pin" | "icon.tokens" | "icon.context" | "icon.cost" | "icon.subscription" | "icon.advisor" | "icon.time" | "icon.pi" | "icon.ghost" | "icon.agents" | "icon.job" | "icon.cache" | "icon.cacheMiss" | "icon.input" | "icon.output" | "icon.throughput" | "icon.host" | "icon.session" | "icon.package" | "icon.warning" | "icon.rewind" | "icon.auto" | "icon.fast" | "icon.extensionSkill" | "icon.extensionTool" | "icon.extensionSlashCommand" | "icon.extensionMcp" | "icon.extensionRule" | "icon.extensionHook" | "icon.extensionPrompt" | "icon.extensionContextFile" | "icon.extensionInstruction" | "cmd.action" | "cmd.prompt" | "cmd.extension" | "cmd.settings" | "cmd.gear" | "cmd.shield" | "cmd.wave" | "cmd.compass" | "cmd.inbox" | "cmd.swap" | "cmd.expand" | "cmd.computer" | "cmd.eye" | "cmd.todo" | "cmd.stats" | "cmd.news" | "cmd.keyboard" | "cmd.export" | "cmd.clipboard" | "cmd.share" | "cmd.broadcast" | "cmd.globe" | "cmd.copy" | "cmd.plus" | "cmd.restart" | "cmd.eraser" | "cmd.trash" | "cmd.compress" | "cmd.vibrate" | "cmd.handoff" | "cmd.history" | "cmd.question" | "cmd.rocket" | "cmd.stethoscope" | "cmd.redo" | "cmd.bug" | "cmd.memory" | "cmd.pencil" | "cmd.folderMove" | "cmd.folderPlus" | "cmd.folderMinus" | "cmd.hammer" | "cmd.power" | "cmd.cart" | "icon.mic" | "icon.camera" | "thinking.minimal" | "thinking.low" | "thinking.medium" | "thinking.high" | "thinking.xhigh" | "thinking.max" | "thinking.autoPending" | "checkbox.checked" | "checkbox.unchecked" | "radio.selected" | "radio.unselected" | "format.bullet" | "format.dash" | "format.bracketLeft" | "format.bracketRight" | "md.quoteBorder" | "md.hrChar" | "md.bullet" | "md.colorSwatch" | "advisor.rail" | "lang.default" | "lang.typescript" | "lang.javascript" | "lang.python" | "lang.rust" | "lang.go" | "lang.java" | "lang.c" | "lang.cpp" | "lang.csharp" | "lang.ruby" | "lang.julia" | "lang.php" | "lang.swift" | "lang.kotlin" | "lang.shell" | "lang.html" | "lang.css" | "lang.json" | "lang.yaml" | "lang.markdown" | "lang.sql" | "lang.docker" | "lang.lua" | "lang.text" | "lang.env" | "lang.toml" | "lang.xml" | "lang.ini" | "lang.conf" | "lang.log" | "lang.csv" | "lang.tsv" | "lang.image" | "lang.pdf" | "lang.archive" | "lang.binary" | "chip.image" | "chip.paste" | "tab.appearance" | "tab.model" | "tab.interaction" | "tab.context" | "tab.files" | "tab.shell" | "tab.tools" | "tab.memory" | "tab.tasks" | "tab.providers" | "tool.write" | "tool.edit" | "tool.bash" | "tool.ssh" | "tool.lsp" | "tool.gh" | "tool.webSearch" | "tool.exa" | "tool.browser" | "tool.eval" | "tool.debug" | "tool.mcp" | "tool.job" | "tool.launch" | "tool.task" | "tool.todo" | "tool.memory" | "tool.ask" | "tool.resolve" | "tool.review" | "tool.inspectImage" | "tool.goal" | "tool.irc" | "tool.delete" | "tool.move";
export type SymbolMap = Record<SymbolKey, string>;
/**
 * Icon vocabulary for slash-command autocomplete type indicators. Each name
 * resolves through `Theme.cmd` to either a dedicated `cmd.*` symbol or an
 * existing `icon.*` symbol shared with the rest of the UI.
 */
export type SlashCommandIconName = "action" | "prompt" | "extension" | "settings" | "gear" | "shield" | "wave" | "compass" | "inbox" | "swap" | "expand" | "computer" | "eye" | "todo" | "stats" | "news" | "keyboard" | "export" | "clipboard" | "share" | "broadcast" | "globe" | "copy" | "plus" | "restart" | "eraser" | "trash" | "compress" | "vibrate" | "handoff" | "history" | "question" | "rocket" | "stethoscope" | "redo" | "bug" | "memory" | "pencil" | "folderMove" | "folderPlus" | "folderMinus" | "hammer" | "power" | "cart" | "model" | "plan" | "prewalk" | "goal" | "pause" | "loop" | "session" | "jobs" | "gauge" | "context" | "agents" | "branch" | "tree" | "signIn" | "signOut" | "advisor" | "host" | "package" | "fast" | "voice" | "tools" | "rule" | "skill" | "mcp" | "pin";
export declare const SYMBOL_PRESETS: Record<SymbolPreset, SymbolMap>;
export type SpinnerType = "status" | "activity";
export declare const SPINNER_FRAMES: Record<SymbolPreset, Record<SpinnerType, string[]>>;
/**
 * Shape accepted by `themeJson.symbols.spinnerFrames`. A flat array applies to
 * both spinner types; an object lets a theme override `status` and/or
 * `activity` independently. Anything not specified falls back to the symbol
 * preset's default frames.
 */
export type SpinnerFramesOverride = string[] | {
    status?: string[];
    activity?: string[];
};
export declare function normalizeSpinnerFramesOverride(value: SpinnerFramesOverride | undefined): Partial<Record<SpinnerType, string[]>>;
/**
 * Get available symbol presets.
 */
export declare function getAvailableSymbolPresets(): SymbolPreset[];
/**
 * Check if a string is a valid symbol preset.
 */
export declare function isValidSymbolPreset(preset: string): preset is SymbolPreset;
