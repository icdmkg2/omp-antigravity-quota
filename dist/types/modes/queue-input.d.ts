/** Prefix matcher shared by queue-list parsing and editor highlighting. */
export declare const QUEUE_LIST_MARKER_RE: RegExp;
/** Extract the message body from the `->` / `=>` yield-queue shorthand. */
export declare function parseQueueShorthand(text: string): string | undefined;
/** Whether text currently forms a sequential queue list, including an unfinished trailing item. */
export declare function isQueuedMessageList(text: string): boolean;
/** Split a sequential numeric, Roman-numeral, or alphabetic list into queue entries. */
export declare function splitQueuedMessages(text: string): string[];
