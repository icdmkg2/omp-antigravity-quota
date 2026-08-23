import { type Type } from "@oh-my-pi/omptype";
/** Minimal subset of the AJV ConfigSchemaError shape this module actually relies on. */
interface ConfigSchemaError {
    instancePath: string;
    message: string | undefined;
}
export type ConfigSchemaSource = {
    readonly kind: "eager";
    readonly schema: Type;
} | {
    readonly kind: "deferred";
    readonly resolve: () => Type;
};
export interface IConfigFile<T> {
    readonly id: string;
    readonly schema: Type;
    path?(): string;
    load(): T | null;
    invalidate?(): void;
}
export declare class ConfigError extends Error {
    #private;
    readonly id: string;
    readonly schemaErrors: ConfigSchemaError[] | null | undefined;
    readonly other?: {
        err: unknown;
        stage: string;
    } | undefined;
    constructor(id: string, schemaErrors: ConfigSchemaError[] | null | undefined, other?: {
        err: unknown;
        stage: string;
    } | undefined);
    get message(): string;
    toString(): string;
}
export type LoadStatus = "ok" | "error" | "not-found";
export type LoadResult<T> = {
    value?: null;
    error: ConfigError;
    status: "error";
} | {
    value: T;
    error?: undefined;
    status: "ok";
} | {
    value?: null;
    error?: unknown;
    status: "not-found";
};
export declare class ConfigFile<T> implements IConfigFile<T> {
    #private;
    readonly id: string;
    constructor(id: string, schema: Type | ConfigSchemaSource, configPath?: string);
    get schema(): Type;
    relocate(configPath?: string): ConfigFile<T>;
    getMtimeMs(): number | null;
    getMtimeMsAsync(): Promise<number | null>;
    withValidation(name: string, validate: (value: T) => void): this;
    createDefault(): T;
    tryLoad(): LoadResult<T>;
    tryLoadAsync(): Promise<LoadResult<T>>;
    load(): T | null;
    loadAsync(): Promise<T | null>;
    loadOrDefault(): T;
    loadOrDefaultAsync(): Promise<T>;
    path(): string;
    invalidate(): void;
}
export {};
