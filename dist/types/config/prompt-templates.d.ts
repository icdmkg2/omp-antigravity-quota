/**
 * Represents a prompt template loaded from a markdown file
 */
export interface PromptTemplate {
    name: string;
    description: string;
    content: string;
    source: string;
}
/**
 * Keep the check source-level and cheap: if the template text contains any explicit
 * inline-arg placeholder syntax, do not append the fallback text again.
 */
export declare function templateUsesInlineArgPlaceholders(templateSource: string): boolean;
export declare function appendInlineArgsFallback(rendered: string, argsText: string, usesInlineArgPlaceholders: boolean): string;
export interface LoadPromptTemplatesOptions {
    /** Working directory for project-local templates. Default: getProjectDir() */
    cwd?: string;
    /** Agent config directory for global templates. Default: from getPromptsDir() */
    agentDir?: string;
}
/**
 * Load all prompt templates from:
 * 1. Global: agentDir/prompts/
 * 2. Project: cwd/.omp/prompts/
 */
export declare function loadPromptTemplates(options?: LoadPromptTemplatesOptions): Promise<PromptTemplate[]>;
/**
 * Expand a prompt template if it matches a template name.
 * Returns the expanded content or the original text if not a template.
 */
export declare function expandPromptTemplate(text: string, templates: PromptTemplate[]): string;
