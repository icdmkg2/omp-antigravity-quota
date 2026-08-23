import { type SubmenuOption } from "../../config/settings-schema.js";
import type { ComposerShapeDefinition } from "../../extensibility/extensions/index.js";
/** Install one extension composer shape into rendering and selector registries. */
export declare function installExtensionComposerShape(definition: ComposerShapeDefinition): () => void;
/** Available built-in and extension composer choices in selector order. */
export declare function getComposerShapeOptions(): readonly SubmenuOption[];
