import { Container } from "@oh-my-pi/pi-tui";
import type { Rule } from "../../capability/rule.js";
/**
 * Component that renders a TTSR (Time Traveling Stream Rules) notification.
 * Shows when a rule violation is detected and the stream is being rewound.
 * One block can carry several rules: a single event may match multiple rules,
 * and consecutive notifications merge into the previous block via
 * {@link addRules} while it is still the live transcript tail.
 */
export declare class TtsrNotificationComponent extends Container {
    #private;
    constructor(rules: Rule[]);
    setToolActivityVisible(visible: boolean): void;
    render(width: number): readonly string[];
    /** Merge additional rules into this block (deduped by rule name). */
    addRules(rules: Rule[]): void;
    setExpanded(expanded: boolean): void;
    isExpanded(): boolean;
}
