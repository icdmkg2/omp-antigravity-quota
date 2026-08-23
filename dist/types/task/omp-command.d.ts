interface OmpCommand {
    cmd: string;
    args: string[];
    shell: boolean;
}
export declare function resolveOmpCommand(): OmpCommand;
export {};
