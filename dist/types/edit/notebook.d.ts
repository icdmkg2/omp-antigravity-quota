export type NotebookCellType = "code" | "markdown" | "raw";
export interface NotebookCell {
    cell_type: NotebookCellType;
    source?: string | string[];
    metadata?: Record<string, unknown>;
    execution_count?: number | null;
    outputs?: unknown[];
    [key: string]: unknown;
}
export interface NotebookDocument {
    cells: NotebookCell[];
    metadata: Record<string, unknown>;
    nbformat: number;
    nbformat_minor: number;
    [key: string]: unknown;
}
export declare function isNotebookPath(filePath: string): boolean;
export declare function splitNotebookSource(content: string): string[];
export declare function readNotebookDocument(absolutePath: string, displayPath: string): Promise<NotebookDocument>;
export declare function notebookToEditableText(notebook: NotebookDocument): string;
export declare function applyNotebookEditableText(notebook: NotebookDocument, text: string, displayPath: string): NotebookDocument;
export declare function readEditableNotebookText(absolutePath: string, displayPath: string): Promise<string>;
export declare function serializeEditedNotebookText(absolutePath: string, displayPath: string, text: string): Promise<string>;
