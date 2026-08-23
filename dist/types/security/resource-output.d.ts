import type { InternalResource } from "../internal-urls/index.js";
export interface SecurityResourceOptions {
    url: string;
    content: string;
    contentType: InternalResource["contentType"];
    isDirectory?: boolean;
}
export declare function createSecurityResource(options: SecurityResourceOptions): InternalResource;
