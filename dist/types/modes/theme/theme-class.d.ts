import type { ThinkingLevel } from "@oh-my-pi/pi-agent-core";
import type { Effort } from "@oh-my-pi/pi-ai";
import type { ColorMode, ThemeBg, ThemeColor } from "./schema.js";
import { type SlashCommandIconName, type SpinnerType, type SymbolKey, type SymbolPreset } from "./symbols.js";
export declare class Theme {
    #private;
    private readonly mode;
    private readonly symbolPreset;
    /**
     * Perceptual luma (0..1) of the status-line background — used to classify the
     * theme light/dark. Undefined when it can't be resolved. Classified against the
     * status line (the surface session accents render on) rather than the chat bubble
     * (`userMessageBg`), which some themes (e.g. `porcelain`) style dark on an
     * otherwise-light theme.
     */
    readonly statusLineLuminance: number | undefined;
    constructor(fgColors: Record<ThemeColor, string | number>, bgColors: Record<ThemeBg, string | number>, mode: ColorMode, symbolPreset: SymbolPreset, symbolOverrides: Partial<Record<SymbolKey, string>>, spinnerFramesOverrides?: Partial<Record<SpinnerType, string[]>>);
    /** True when the active theme has a light status-line background. */
    get isLight(): boolean;
    /**
     * Surface luminance to size session accents against on light themes; undefined on
     * dark themes so accents stay vivid. Pass straight to `getSessionAccentHex`.
     */
    get accentSurfaceLuminance(): number | undefined;
    /**
     * Get the resolved CSS hex string for a foreground theme color.
     */
    getColorHex(color: ThemeColor): string;
    /**
     * Get all foreground and background theme colors as CSS hex strings.
     * Skips colors resolved to the default terminal color (unstyled).
     */
    getAllThemeColorHexes(): string[];
    /**
     * Get the most visually dominant theme colors as CSS hex strings — accent,
     * border, success, error, warning, heading, link, diff markers, etc.
     * These are the colors the session accent could visually clash with.
     * Skips colors resolved to the default terminal color (unstyled).
     */
    getMajorThemeColorHexes(): string[];
    /**
     * Get the resolved CSS hex string for the theme's accent color.
     */
    getAccentColorHex(): string;
    fg(color: ThemeColor, text: string): string;
    bg(color: ThemeBg, text: string): string;
    /**
     * Apply a background fill that resumes after nested full/background resets.
     *
     * Composer rows contain styled text and cursor escapes; a normal background
     * wrapper would otherwise stop at the first nested reset.
     */
    bgFill(color: ThemeBg, text: string): string;
    bold(text: string): string;
    italic(text: string): string;
    underline(text: string): string;
    strikethrough(text: string): string;
    inverse(text: string): string;
    getFgAnsi(color: ThemeColor): string;
    getBgAnsi(color: ThemeBg): string;
    /**
     * Foreground ANSI for text drawn **on top of** `fillColor` used as a solid
     * background (e.g. a powerline chip). Picks near-black or near-white by the
     * fill's perceived luminance (Rec. 601 luma) so the label stays legible on
     * both bright and dark fills, across light and dark themes.
     *
     * Reads the RGB out of the already-resolved truecolor escape; when the fill
     * is encoded as a 256-palette index (limited terminals) the RGB is
     * unavailable, so it falls back to the theme `text` color.
     */
    getContrastFgAnsi(fillColor: ThemeColor): string;
    getColorMode(): ColorMode;
    getThinkingBorderColor(level: ThinkingLevel | Effort): (str: string) => string;
    getBashModeBorderColor(): (str: string) => string;
    getPythonModeBorderColor(): (str: string) => string;
    /**
     * Get a symbol by key.
     */
    symbol(key: SymbolKey): string;
    /**
     * Get a symbol styled with a color.
     */
    styledSymbol(key: SymbolKey, color: ThemeColor): string;
    /**
     * Get the current symbol preset.
     */
    getSymbolPreset(): SymbolPreset;
    get status(): {
        success: string;
        error: string;
        warning: string;
        info: string;
        pending: string;
        disabled: string;
        enabled: string;
        running: string;
        shadowed: string;
        aborted: string;
        done: string;
    };
    get nav(): {
        cursor: string;
        selected: string;
        expand: string;
        collapse: string;
        back: string;
    };
    get tree(): {
        branch: string;
        last: string;
        vertical: string;
        horizontal: string;
        hook: string;
    };
    get progress(): {
        filled: string;
        empty: string;
    };
    get boxRound(): {
        topLeft: string;
        topRight: string;
        bottomLeft: string;
        bottomRight: string;
        horizontal: string;
        vertical: string;
        cross: string;
        teeDown: string;
        teeUp: string;
        teeRight: string;
        teeLeft: string;
    };
    get boxSharp(): {
        topLeft: string;
        topRight: string;
        bottomLeft: string;
        bottomRight: string;
        horizontal: string;
        vertical: string;
        cross: string;
        teeDown: string;
        teeUp: string;
        teeRight: string;
        teeLeft: string;
    };
    get sep(): {
        powerline: string;
        powerlineThin: string;
        powerlineLeft: string;
        powerlineRight: string;
        powerlineThinLeft: string;
        powerlineThinRight: string;
        block: string;
        space: string;
        asciiLeft: string;
        asciiRight: string;
        dot: string;
        slash: string;
        pipe: string;
    };
    get icon(): {
        model: string;
        plan: string;
        prewalk: string;
        goal: string;
        pause: string;
        loop: string;
        folder: string;
        worktree: string;
        scratchFolder: string;
        file: string;
        git: string;
        branch: string;
        pr: string;
        pin: string;
        tokens: string;
        context: string;
        cost: string;
        subscription: string;
        advisor: string;
        time: string;
        pi: string;
        ghost: string;
        agents: string;
        job: string;
        cache: string;
        cacheMiss: string;
        input: string;
        output: string;
        throughput: string;
        host: string;
        session: string;
        package: string;
        warning: string;
        rewind: string;
        auto: string;
        fast: string;
        extensionSkill: string;
        extensionTool: string;
        extensionSlashCommand: string;
        extensionMcp: string;
        extensionRule: string;
        extensionHook: string;
        extensionPrompt: string;
        extensionContextFile: string;
        extensionInstruction: string;
        mic: string;
        camera: string;
    };
    /** Slash-command type-indicator glyphs for the autocomplete icon column. */
    get cmd(): Record<SlashCommandIconName, string>;
    get thinking(): {
        minimal: string;
        low: string;
        medium: string;
        high: string;
        xhigh: string;
        max: string;
        autoPending: string;
    };
    get checkbox(): {
        checked: string;
        unchecked: string;
    };
    get radio(): {
        selected: string;
        unselected: string;
    };
    get format(): {
        bullet: string;
        dash: string;
        bracketLeft: string;
        bracketRight: string;
    };
    get md(): {
        quoteBorder: string;
        hrChar: string;
        bullet: string;
        colorSwatch: string;
    };
    /**
     * Default spinner frames (status spinner).
     */
    get spinnerFrames(): string[];
    /**
     * Get spinner frames by type.
     */
    getSpinnerFrames(type?: SpinnerType): string[];
    /**
     * Get language icon for a language name.
     * Maps common language names to their corresponding symbol keys.
     */
    getLangIcon(lang: string | undefined): string;
    /**
     * Language icon tinted with the language's brand color (see
     * {@link LANG_BRAND_COLORS}). Falls back to the muted theme color for
     * languages without a brand entry, and returns the bare (possibly empty)
     * icon when the active symbol preset has none.
     */
    getLangIconStyled(lang: string | undefined): string;
}
