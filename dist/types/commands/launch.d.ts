/**
 * Root command for the coding agent CLI.
 */
import { Command } from "@oh-my-pi/pi-utils/cli";
export default class Index extends Command {
    static description: string;
    static hidden: true;
    static args: {
        messages: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: false;
            multiple: true;
        };
    };
    static flags: {
        model: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        smol: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        slow: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        plan: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        prewalk: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        "no-prewalk": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        "prewalk-into": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        "plan-yolo": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        "plan-yolo-into": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        provider: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        "api-key": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        "system-prompt": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        "append-system-prompt": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        "allow-home": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        profile: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        alias: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        cwd: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        mode: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
            options: string[];
        };
        config: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
            multiple: true;
        };
        "add-dir": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
            multiple: true;
        };
        print: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            char: string;
            description: string;
        };
        continue: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            char: string;
            description: string;
        };
        resume: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            char: string;
            description: string;
        };
        "from-claude": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        "from-codex": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        "session-dir": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        "no-session": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        models: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        "no-tools": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        "no-lsp": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        "no-pty": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        tools: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        thinking: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
            options: string[];
        };
        "service-tier": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
            options: ("auto" | "default" | "flex" | "none" | "priority" | "scale")[];
        };
        "hide-thinking": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        advisor: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        "external-thinking": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        hook: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
            multiple: true;
        };
        extension: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            char: string;
            description: string;
            multiple: true;
        };
        "no-extensions": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        "no-skills": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        skills: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        "no-rules": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        export: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        "no-title": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        "print-thoughts": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        "max-time": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        "auto-approve": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            aliases: string[];
            description: string;
        };
        "approval-mode": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            options: string[];
            description: string;
        };
    };
    static examples: string[];
    static strict: boolean;
    run(): Promise<void>;
}
