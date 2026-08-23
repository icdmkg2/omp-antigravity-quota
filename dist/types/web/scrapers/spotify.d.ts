/**
 * Spotify URL handler for podcasts, tracks, albums, and playlists
 *
 * Uses oEmbed API and Open Graph metadata to extract information
 * from Spotify URLs without requiring authentication.
 */
import type { SpecialHandler } from "./types.js";
export declare const handleSpotify: SpecialHandler;
