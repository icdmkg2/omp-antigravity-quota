import type { Usage } from "@oh-my-pi/pi-ai";
import { Container } from "@oh-my-pi/pi-tui";
/** Format the metrics shared by standalone usage blocks and compact tool groups. */
export declare function formatUsageRow(usage: Usage, durationMs?: number, ttftMs?: number, timestamp?: number): string;
export declare function createUsageRowBlock(usage: Usage, durationMs?: number, ttftMs?: number, timestamp?: number): Container;
