export declare const SETUP_SPLASH_MS = 2600;
export declare const SETUP_TICK_MS = 33;
export declare function renderStarfield(width: number, height: number, frame: number): string[];
/**
 * Animated setup splash, in the spirit of the omp landing page: the brand π
 * mark rendered with the live diagonal gradient + shine sweep, rising out of a
 * rippling, gradient-lit water surface, under a faint twinkling starfield. The
 * mark and water share one continuous gradient so the sweep reads across the
 * whole scene; the water surface drifts each frame.
 */
export declare function renderSetupSplash(width: number, height: number, elapsedMs: number): string[];
