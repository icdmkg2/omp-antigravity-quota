import type { RenderedSegment, SegmentContext, StatusLineSegment, StatusLineSegmentId } from "./types.js";
export type { SegmentContext } from "./types.js";
export declare const SEGMENTS: Record<StatusLineSegmentId, StatusLineSegment>;
export declare function renderSegment(id: StatusLineSegmentId, ctx: SegmentContext): RenderedSegment;
export declare const ALL_SEGMENT_IDS: StatusLineSegmentId[];
