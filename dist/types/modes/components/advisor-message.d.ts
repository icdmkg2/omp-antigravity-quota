import { type Component } from "@oh-my-pi/pi-tui";
import type { AdvisorMessageDetails } from "../../advisor/index.js";
import type { Theme } from "../theme/theme.js";
/**
 * Display-only transcript card for advisor notes injected into the primary
 * session. Styled as a distinct voice so notes never blend into thinking
 * output (whose `thinkingText` color equals `toolOutput` in most themes):
 * a bold `customMessageLabel` header tag (skill-card convention), a heavy
 * rail tinted per-note severity, and the note body on the default text color.
 */
export declare function createAdvisorMessageCard(details: AdvisorMessageDetails | undefined, getExpanded: () => boolean, uiTheme: Theme): Component;
