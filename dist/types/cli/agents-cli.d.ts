export type AgentsAction = "unpack";
export interface AgentsCommandArgs {
    action: AgentsAction;
    flags: {
        force?: boolean;
        json?: boolean;
        dir?: string;
        user?: boolean;
        project?: boolean;
    };
}
export declare function runAgentsCommand(cmd: AgentsCommandArgs): Promise<void>;
