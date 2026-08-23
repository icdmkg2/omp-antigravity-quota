import type { AgentMessage } from "@oh-my-pi/pi-agent-core";
import { type Rule } from "../../capability/rule.js";
export interface ParsedGeneratedRule {
    rule: Rule;
    fileContent: string;
}
export type GeneratedRuleParseResult = ParsedGeneratedRule | {
    error: string;
};
export interface RuleHistoryValidation {
    matched: boolean;
    feedback?: string;
}
export interface ParsedRuleHistoryValidation {
    candidate: ParsedGeneratedRule;
    validation: RuleHistoryValidation;
    repairedCondition: boolean;
}
export type OmfgRuleSourceLevel = "project" | "user";
export declare function extractGeneratedRuleJson(text: string): string | null;
export declare function sanitizeRuleName(rawName: string): string;
export declare function buildOmfgRuleForPath(ruleName: string, fileContent: string, filePath: string, level: OmfgRuleSourceLevel): Rule;
export declare function parseGeneratedRule(text: string): GeneratedRuleParseResult;
export declare function validateRuleAgainstAssistantHistory(rule: Rule, messages: readonly AgentMessage[]): RuleHistoryValidation;
export declare function validateParsedRuleAgainstAssistantHistory(candidate: ParsedGeneratedRule, messages: readonly AgentMessage[]): ParsedRuleHistoryValidation;
export declare function ruleMatchesAssistantHistory(rule: Rule, messages: readonly AgentMessage[]): boolean;
