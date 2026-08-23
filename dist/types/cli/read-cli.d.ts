export interface ReadCommandArgs {
    path: string;
}
export declare function runReadCommand(cmd: ReadCommandArgs): Promise<void>;
