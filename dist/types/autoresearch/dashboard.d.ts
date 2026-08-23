import type { Theme } from "../modes/theme/theme.js";
import type { AutoresearchRuntime, DashboardController } from "./types.js";
export declare function createDashboardController(): DashboardController;
export declare function renderDashboardLines(runtime: AutoresearchRuntime, width: number, theme: Theme, maxRows: number): string[];
