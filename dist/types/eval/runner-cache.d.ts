/**
 * Stage `script` under `os.tmpdir()/<dirName>` and return the runner path.
 *
 * The staged path is memoized per `dirName` but re-checked with `fs.existsSync`
 * before reuse, so a runner deleted mid-session is re-written on the next call
 * instead of handing back a path to a missing file (issue #8140).
 *
 * @param dirName Cache subdirectory under the OS temp dir (unique per language).
 * @param ext Runner file extension without the dot (e.g. `py`, `jl`, `rb`).
 * @param script Runner source, hashed to key the cached file per version.
 */
export declare function stageRunnerScript(dirName: string, ext: string, script: string): Promise<string>;
