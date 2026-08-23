export declare const ACP_TERMINAL_AUTH_FLAG = "--acp-terminal-auth";
export interface AcpTerminalAuthArgs {
    args: string[];
    terminalAuth: boolean;
}
export declare function prepareAcpTerminalAuthArgs(rawArgs: readonly string[]): AcpTerminalAuthArgs;
