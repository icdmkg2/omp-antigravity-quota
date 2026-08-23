import type { Settings } from "../../config/settings.js";
import { CURRENT_SETUP_VERSION } from "../setup-version.js";
import type { InteractiveModeContext } from "../types.js";
import type { SetupScene } from "./scenes/types.js";
export type { SetupScene, SetupSceneController, SetupSceneHost, SetupSceneResult } from "./scenes/types.js";
export { runStartupSplash } from "./startup-splash.js";
export { CURRENT_SETUP_VERSION };
export declare const ALL_SCENES: readonly [SetupScene, SetupScene, SetupScene, SetupScene, SetupScene];
export interface SetupSceneSelectionOptions {
    resuming?: boolean;
    isTTY?: boolean;
    skipEnv?: string;
    setupWizardEnabled?: boolean;
    force?: boolean;
}
export declare function selectSetupScenes(storedVersion: number, scenes: readonly SetupScene[], ctx?: InteractiveModeContext, options?: SetupSceneSelectionOptions): Promise<SetupScene[]>;
export declare function markSetupWizardComplete(settings: Settings, version?: number): Promise<void>;
export interface RunSetupWizardOptions {
    markComplete?: boolean;
    playWelcomeIntro?: boolean;
}
export declare function runSetupWizard(ctx: InteractiveModeContext, scenes?: readonly SetupScene[], options?: RunSetupWizardOptions): Promise<void>;
