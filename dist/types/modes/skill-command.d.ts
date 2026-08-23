import type { ImageContent, TextContent } from "@oh-my-pi/pi-ai";
import { type CustomMessage, SKILL_PROMPT_MESSAGE_TYPE, type SkillPromptDetails } from "../session/messages.js";
import type { InteractiveModeContext } from "./types.js";
type SkillCommandHost = Pick<InteractiveModeContext, "skillCommands" | "session" | "showError">;
type SkillPromptMessage = Pick<CustomMessage<SkillPromptDetails>, "customType" | "content" | "display" | "details" | "attribution"> & {
    customType: typeof SKILL_PROMPT_MESSAGE_TYPE;
    content: string | (TextContent | ImageContent)[];
    display: true;
    details: SkillPromptDetails;
    attribution: "user";
};
type SkillPromptOptions = {
    streamingBehavior: "steer" | "followUp";
    queueChipText: string;
};
interface InvokeSkillCommandOptions {
    propagateErrors?: boolean;
    queueOnly?: boolean;
    images?: ImageContent[];
}
/** Built custom-message payload and delivery options for a `/skill:` command. */
export interface BuiltSkillCommandPrompt {
    message: SkillPromptMessage;
    options: SkillPromptOptions;
}
/** Return true when `text` invokes a registered `/skill:<name>` command. */
export declare function isKnownSkillCommand(ctx: SkillCommandHost, text: string): boolean;
/** Build the user-attributed custom message for a registered `/skill:<name>` command. */
export declare function buildSkillCommandPrompt(ctx: SkillCommandHost, text: string, streamingBehavior: "steer" | "followUp", images?: ImageContent[]): Promise<BuiltSkillCommandPrompt | undefined>;
/** Invoke a registered `/skill:<name>` command as a user-attributed custom message. */
export declare function invokeSkillCommandFromText(ctx: SkillCommandHost, text: string, streamingBehavior: "steer" | "followUp", options?: InvokeSkillCommandOptions): Promise<boolean>;
export {};
