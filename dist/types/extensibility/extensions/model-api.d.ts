/**
 * Model query facade exposed to extensions as `ctx.models`.
 *
 * Read-only: lets an extension select a model the same way core does — list
 * authenticated models, read the session model, resolve a model string or role
 * alias, and compare model families — without touching the mutable registry or
 * duplicating resolution/family heuristics.
 */
import type { Model } from "@oh-my-pi/pi-ai";
import type { ModelRegistry } from "../../config/model-registry.js";
import type { Settings } from "../../config/settings.js";
import type { ExtensionModelQuery } from "./types.js";
/**
 * Build the `ctx.models` facade. `getModel` is read lazily so `current()` always
 * reflects the live session model (it can change mid-session via `/model`).
 */
export declare function createExtensionModelQuery(modelRegistry: ModelRegistry, settings: Settings | undefined, getModel: () => Model | undefined): ExtensionModelQuery;
