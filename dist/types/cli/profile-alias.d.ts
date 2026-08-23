export type ProfileAliasShell = "bash" | "zsh" | "fish" | "powershell" | "pwsh";
export interface ProfileAliasCommand {
    display: string;
    posix: string;
    fish: string;
    powerShell: string;
}
/** Process inputs used to select the installed command or preserve a source invocation. */
export interface ProfileAliasProcessOptions {
    argv?: readonly string[];
    cwd?: string;
    compiled?: boolean;
}
export interface ProfileAliasInstallOptions {
    profile: string;
    aliasName: string;
    shellPath?: string;
    platform?: NodeJS.Platform;
    homeDir?: string;
    env?: NodeJS.ProcessEnv;
    readFile?: (filePath: string) => Promise<string>;
    command?: ProfileAliasCommand;
    writeFile?: (filePath: string, content: string) => Promise<void>;
}
export interface ProfileAliasInstallResult {
    shell: ProfileAliasShell;
    configPath: string;
    aliasName: string;
    profile: string;
    command: string;
    reloadedWith: string;
}
/** Resolve the command a generated profile alias should invoke. */
export declare function resolveProfileAliasCommandFromProcess({ argv, cwd, compiled, }?: ProfileAliasProcessOptions): ProfileAliasCommand;
export declare function readProfileAliasConfigFile(filePath: string, readText?: (filePath: string) => Promise<string>): Promise<string>;
export declare function installProfileAlias(options: ProfileAliasInstallOptions): Promise<ProfileAliasInstallResult>;
