/** Compact title-model input for a user-invoked `/skill:<name>` prompt. */
export declare function skillPromptTitleInput(input: {
    name?: string;
    args?: string;
    queueChipText?: string;
}): string;
/** Title text for a persisted skill-prompt custom message. Never the expanded SKILL.md body. */
export declare function titleTextFromSkillPrompt(message: {
    role: string;
    customType?: string;
    attribution?: string;
    details?: unknown;
}): string | undefined;
