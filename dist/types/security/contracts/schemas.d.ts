export declare const getSecurityContractSchemas: () => {
    securityProducerSchema: import("@oh-my-pi/omptype").FluentType<{
        kind: "codex-security-bundle" | "codex-security-cloud" | "omp-native" | "sarif-import";
        name: string;
        pluginVersion?: string | undefined;
        revision?: string | undefined;
        vendor?: string | undefined;
        version?: string | undefined;
    }, {
        kind: "codex-security-bundle" | "codex-security-cloud" | "omp-native" | "sarif-import";
        name: string;
        pluginVersion?: string | undefined;
        revision?: string | undefined;
        vendor?: string | undefined;
        version?: string | undefined;
    }>;
    securityProvenanceSchema: import("@oh-my-pi/omptype").FluentType<{
        createdAt: string;
        importedAt?: string | undefined;
        metadata?: Record<string, unknown> | undefined;
        producer: {
            kind: "codex-security-bundle" | "codex-security-cloud" | "omp-native" | "sarif-import";
            name: string;
            pluginVersion?: string | undefined;
            revision?: string | undefined;
            vendor?: string | undefined;
            version?: string | undefined;
        };
        sourceIds?: Record<string, string> | undefined;
        upstream?: {
            archiveSha256?: string | undefined;
            packageVersion?: string | undefined;
            pluginVersion?: string | undefined;
            repository?: string | undefined;
            revision?: string | undefined;
        } | undefined;
        vendorFingerprints?: Record<string, string> | undefined;
    }, {
        createdAt: string;
        importedAt?: string | undefined;
        metadata?: Record<string, unknown> | undefined;
        producer: {
            kind: "codex-security-bundle" | "codex-security-cloud" | "omp-native" | "sarif-import";
            name: string;
            pluginVersion?: string | undefined;
            revision?: string | undefined;
            vendor?: string | undefined;
            version?: string | undefined;
        };
        sourceIds?: Record<string, string> | undefined;
        upstream?: {
            archiveSha256?: string | undefined;
            packageVersion?: string | undefined;
            pluginVersion?: string | undefined;
            repository?: string | undefined;
            revision?: string | undefined;
        } | undefined;
        vendorFingerprints?: Record<string, string> | undefined;
    }>;
    securityLocationSchema: import("@oh-my-pi/omptype").FluentType<{
        endColumn?: number | undefined;
        endLine?: number | undefined;
        path: string;
        role?: string | undefined;
        startColumn?: number | undefined;
        startLine: number;
    }, {
        endColumn?: number | undefined;
        endLine?: number | undefined;
        path: string;
        role?: string | undefined;
        startColumn?: number | undefined;
        startLine: number;
    }>;
    securityEvidenceSchema: import("@oh-my-pi/omptype").FluentType<{
        excerpt?: string | undefined;
        explanation: string;
        id: string;
        kind: "code" | "note" | "trace" | "validation";
        label: string;
        location?: {
            endColumn?: number | undefined;
            endLine?: number | undefined;
            path: string;
            role?: string | undefined;
            startColumn?: number | undefined;
            startLine: number;
        } | undefined;
    }, {
        excerpt?: string | undefined;
        explanation: string;
        id: string;
        kind: "code" | "note" | "trace" | "validation";
        label: string;
        location?: {
            endColumn?: number | undefined;
            endLine?: number | undefined;
            path: string;
            role?: string | undefined;
            startColumn?: number | undefined;
            startLine: number;
        } | undefined;
    }>;
    securityOccurrenceSchema: import("@oh-my-pi/omptype").FluentType<{
        evidenceIds: string[];
        id: string;
        locations: {
            endColumn?: number | undefined;
            endLine?: number | undefined;
            path: string;
            role?: string | undefined;
            startColumn?: number | undefined;
            startLine: number;
        }[];
    }, {
        evidenceIds: string[];
        id: string;
        locations: {
            endColumn?: number | undefined;
            endLine?: number | undefined;
            path: string;
            role?: string | undefined;
            startColumn?: number | undefined;
            startLine: number;
        }[];
    }>;
    securityFindingSchema: import("@oh-my-pi/omptype").FluentType<{
        anchor?: string | undefined;
        confidence: {
            level: "high" | "low" | "medium";
            rationale?: string | undefined;
        };
        disposition: {
            actor?: string | undefined;
            rationale?: string | undefined;
            status: "accepted_risk" | "false_positive" | "fixed" | "open" | "wont_fix";
            updatedAt?: string | undefined;
        };
        evidence: {
            excerpt?: string | undefined;
            explanation: string;
            id: string;
            kind: "code" | "note" | "trace" | "validation";
            label: string;
            location?: {
                endColumn?: number | undefined;
                endLine?: number | undefined;
                path: string;
                role?: string | undefined;
                startColumn?: number | undefined;
                startLine: number;
            } | undefined;
        }[];
        extensions?: Record<string, unknown> | undefined;
        fingerprint: string;
        id: string;
        occurrences: {
            evidenceIds: string[];
            id: string;
            locations: {
                endColumn?: number | undefined;
                endLine?: number | undefined;
                path: string;
                role?: string | undefined;
                startColumn?: number | undefined;
                startLine: number;
            }[];
        }[];
        provenance: {
            createdAt: string;
            importedAt?: string | undefined;
            metadata?: Record<string, unknown> | undefined;
            producer: {
                kind: "codex-security-bundle" | "codex-security-cloud" | "omp-native" | "sarif-import";
                name: string;
                pluginVersion?: string | undefined;
                revision?: string | undefined;
                vendor?: string | undefined;
                version?: string | undefined;
            };
            sourceIds?: Record<string, string> | undefined;
            upstream?: {
                archiveSha256?: string | undefined;
                packageVersion?: string | undefined;
                pluginVersion?: string | undefined;
                repository?: string | undefined;
                revision?: string | undefined;
            } | undefined;
            vendorFingerprints?: Record<string, string> | undefined;
        };
        remediation?: string | undefined;
        ruleId: string;
        scanId: string;
        severity: {
            level: "critical" | "high" | "informational" | "low" | "medium";
            rationale?: string | undefined;
            score?: number | undefined;
            scoringSystem?: string | undefined;
            vector?: string | undefined;
        };
        summary: string;
        taxonomy: {
            category: string;
            cwe: string[];
            tags?: string[] | undefined;
        };
        title: string;
        validation: {
            evidenceIds: string[];
            status: "error" | "partial" | "rejected" | "unvalidated" | "validated";
            summary?: string | undefined;
            validatedAt?: string | undefined;
        };
    }, {
        anchor?: string | undefined;
        confidence: {
            level: "high" | "low" | "medium";
            rationale?: string | undefined;
        };
        disposition: {
            actor?: string | undefined;
            rationale?: string | undefined;
            status: "accepted_risk" | "false_positive" | "fixed" | "open" | "wont_fix";
            updatedAt?: string | undefined;
        };
        evidence: {
            excerpt?: string | undefined;
            explanation: string;
            id: string;
            kind: "code" | "note" | "trace" | "validation";
            label: string;
            location?: {
                endColumn?: number | undefined;
                endLine?: number | undefined;
                path: string;
                role?: string | undefined;
                startColumn?: number | undefined;
                startLine: number;
            } | undefined;
        }[];
        extensions?: Record<string, unknown> | undefined;
        fingerprint: string;
        id: string;
        occurrences: {
            evidenceIds: string[];
            id: string;
            locations: {
                endColumn?: number | undefined;
                endLine?: number | undefined;
                path: string;
                role?: string | undefined;
                startColumn?: number | undefined;
                startLine: number;
            }[];
        }[];
        provenance: {
            createdAt: string;
            importedAt?: string | undefined;
            metadata?: Record<string, unknown> | undefined;
            producer: {
                kind: "codex-security-bundle" | "codex-security-cloud" | "omp-native" | "sarif-import";
                name: string;
                pluginVersion?: string | undefined;
                revision?: string | undefined;
                vendor?: string | undefined;
                version?: string | undefined;
            };
            sourceIds?: Record<string, string> | undefined;
            upstream?: {
                archiveSha256?: string | undefined;
                packageVersion?: string | undefined;
                pluginVersion?: string | undefined;
                repository?: string | undefined;
                revision?: string | undefined;
            } | undefined;
            vendorFingerprints?: Record<string, string> | undefined;
        };
        remediation?: string | undefined;
        ruleId: string;
        scanId: string;
        severity: {
            level: "critical" | "high" | "informational" | "low" | "medium";
            rationale?: string | undefined;
            score?: number | undefined;
            scoringSystem?: string | undefined;
            vector?: string | undefined;
        };
        summary: string;
        taxonomy: {
            category: string;
            cwe: string[];
            tags?: string[] | undefined;
        };
        title: string;
        validation: {
            evidenceIds: string[];
            status: "error" | "partial" | "rejected" | "unvalidated" | "validated";
            summary?: string | undefined;
            validatedAt?: string | undefined;
        };
    }>;
    securityCoverageSchema: import("@oh-my-pi/omptype").FluentType<{
        completeness: "complete" | "partial" | "unknown";
        deferred: {
            id: string;
            paths?: string[] | undefined;
            reason: string;
            surfaceIds?: string[] | undefined;
        }[];
        excludePaths: string[];
        explicitExclusions: {
            pattern: string;
            reason: string;
        }[];
        includePaths: string[];
        inventoryStrategy: "custom" | "diff" | "directory" | "imported" | "repository" | "scoped_path";
        mode: "deep_repository" | "diff" | "imported" | "repository" | "scoped_path" | "working_tree";
        openQuestions?: {
            followUpPrompt?: string | undefined;
            question: string;
        }[] | undefined;
        surfaces: {
            disposition: "needs_follow_up" | "no_issue_found" | "not_applicable" | "rejected" | "reported";
            id: string;
            label: string;
            notes?: string | undefined;
            receiptRefs: string[];
            riskArea?: string | undefined;
        }[];
    }, {
        completeness: "complete" | "partial" | "unknown";
        deferred: {
            id: string;
            paths?: string[] | undefined;
            reason: string;
            surfaceIds?: string[] | undefined;
        }[];
        excludePaths: string[];
        explicitExclusions: {
            pattern: string;
            reason: string;
        }[];
        includePaths: string[];
        inventoryStrategy: "custom" | "diff" | "directory" | "imported" | "repository" | "scoped_path";
        mode: "deep_repository" | "diff" | "imported" | "repository" | "scoped_path" | "working_tree";
        openQuestions?: {
            followUpPrompt?: string | undefined;
            question: string;
        }[] | undefined;
        surfaces: {
            disposition: "needs_follow_up" | "no_issue_found" | "not_applicable" | "rejected" | "reported";
            id: string;
            label: string;
            notes?: string | undefined;
            receiptRefs: string[];
            riskArea?: string | undefined;
        }[];
    }>;
    securityTargetSchema: import("@oh-my-pi/omptype").FluentType<{
        baseRevision?: string | undefined;
        displayName: string;
        excludePaths: string[];
        headRevision?: string | undefined;
        includePaths: string[];
        kind: "imported" | "ref_diff" | "repository" | "scoped_path" | "working_tree";
        repositoryRoot: string;
        revision?: string | undefined;
        treeDigest: string;
    }, {
        baseRevision?: string | undefined;
        displayName: string;
        excludePaths: string[];
        headRevision?: string | undefined;
        includePaths: string[];
        kind: "imported" | "ref_diff" | "repository" | "scoped_path" | "working_tree";
        repositoryRoot: string;
        revision?: string | undefined;
        treeDigest: string;
    }>;
    securityScanPlanSchema: import("@oh-my-pi/omptype").FluentType<{
        account: {
            accountId?: string | undefined;
            credentialId: number;
            email?: string | undefined;
            organizationId?: string | undefined;
            organizationName?: string | undefined;
            provider: string;
        };
        configFingerprint: string;
        createdAt: string;
        documentType: "omp-security.scan-plan";
        fingerprint: string;
        id: string;
        knowledgeBases: {
            path: string;
            sha256: string;
            size: number;
        }[];
        model: {
            modelId: string;
            provider: string;
            thinkingLevel?: string | undefined;
        };
        output: {
            archiveExisting: boolean;
            existingState: "absent" | "archivable" | "empty";
            root: string;
        };
        repositoryRoot: string;
        schemaVersion: "1.0";
        target: {
            baseRevision?: string | undefined;
            displayName: string;
            excludePaths: string[];
            headRevision?: string | undefined;
            includePaths: string[];
            kind: "imported" | "ref_diff" | "repository" | "scoped_path" | "working_tree";
            repositoryRoot: string;
            revision?: string | undefined;
            treeDigest: string;
        };
        workflowFingerprint: string;
    }, {
        account: {
            accountId?: string | undefined;
            credentialId: number;
            email?: string | undefined;
            organizationId?: string | undefined;
            organizationName?: string | undefined;
            provider: string;
        };
        configFingerprint: string;
        createdAt: string;
        documentType: "omp-security.scan-plan";
        fingerprint: string;
        id: string;
        knowledgeBases: {
            path: string;
            sha256: string;
            size: number;
        }[];
        model: {
            modelId: string;
            provider: string;
            thinkingLevel?: string | undefined;
        };
        output: {
            archiveExisting: boolean;
            existingState: "absent" | "archivable" | "empty";
            root: string;
        };
        repositoryRoot: string;
        schemaVersion: "1.0";
        target: {
            baseRevision?: string | undefined;
            displayName: string;
            excludePaths: string[];
            headRevision?: string | undefined;
            includePaths: string[];
            kind: "imported" | "ref_diff" | "repository" | "scoped_path" | "working_tree";
            repositoryRoot: string;
            revision?: string | undefined;
            treeDigest: string;
        };
        workflowFingerprint: string;
    }>;
    securityScanMetricsSchema: import("@oh-my-pi/omptype").FluentType<{
        cost?: number | undefined;
        premiumRequests?: number | undefined;
        runtimeMs?: number | undefined;
        tokenUsage?: {
            cacheRead: number;
            cacheWrite: number;
            input: number;
            output: number;
            reasoning: number;
            total: number;
        } | undefined;
    }, {
        cost?: number | undefined;
        premiumRequests?: number | undefined;
        runtimeMs?: number | undefined;
        tokenUsage?: {
            cacheRead: number;
            cacheWrite: number;
            input: number;
            output: number;
            reasoning: number;
            total: number;
        } | undefined;
    }>;
    securityScanSchema: import("@oh-my-pi/omptype").FluentType<{
        completedAt?: string | undefined;
        coverage: {
            completeness: "complete" | "partial" | "unknown";
            deferred: {
                id: string;
                paths?: string[] | undefined;
                reason: string;
                surfaceIds?: string[] | undefined;
            }[];
            excludePaths: string[];
            explicitExclusions: {
                pattern: string;
                reason: string;
            }[];
            includePaths: string[];
            inventoryStrategy: "custom" | "diff" | "directory" | "imported" | "repository" | "scoped_path";
            mode: "deep_repository" | "diff" | "imported" | "repository" | "scoped_path" | "working_tree";
            openQuestions?: {
                followUpPrompt?: string | undefined;
                question: string;
            }[] | undefined;
            surfaces: {
                disposition: "needs_follow_up" | "no_issue_found" | "not_applicable" | "rejected" | "reported";
                id: string;
                label: string;
                notes?: string | undefined;
                receiptRefs: string[];
                riskArea?: string | undefined;
            }[];
        };
        createdAt: string;
        documentType: "omp-security.scan";
        error?: string | undefined;
        findingIds: string[];
        id: string;
        metrics?: {
            cost?: number | undefined;
            premiumRequests?: number | undefined;
            runtimeMs?: number | undefined;
            tokenUsage?: {
                cacheRead: number;
                cacheWrite: number;
                input: number;
                output: number;
                reasoning: number;
                total: number;
            } | undefined;
        } | undefined;
        plan?: {
            account: {
                accountId?: string | undefined;
                credentialId: number;
                email?: string | undefined;
                organizationId?: string | undefined;
                organizationName?: string | undefined;
                provider: string;
            };
            configFingerprint: string;
            createdAt: string;
            documentType: "omp-security.scan-plan";
            fingerprint: string;
            id: string;
            knowledgeBases: {
                path: string;
                sha256: string;
                size: number;
            }[];
            model: {
                modelId: string;
                provider: string;
                thinkingLevel?: string | undefined;
            };
            output: {
                archiveExisting: boolean;
                existingState: "absent" | "archivable" | "empty";
                root: string;
            };
            repositoryRoot: string;
            schemaVersion: "1.0";
            target: {
                baseRevision?: string | undefined;
                displayName: string;
                excludePaths: string[];
                headRevision?: string | undefined;
                includePaths: string[];
                kind: "imported" | "ref_diff" | "repository" | "scoped_path" | "working_tree";
                repositoryRoot: string;
                revision?: string | undefined;
                treeDigest: string;
            };
            workflowFingerprint: string;
        } | undefined;
        producer: {
            kind: "codex-security-bundle" | "codex-security-cloud" | "omp-native" | "sarif-import";
            name: string;
            pluginVersion?: string | undefined;
            revision?: string | undefined;
            vendor?: string | undefined;
            version?: string | undefined;
        };
        projectKey: string;
        provenance: {
            createdAt: string;
            importedAt?: string | undefined;
            metadata?: Record<string, unknown> | undefined;
            producer: {
                kind: "codex-security-bundle" | "codex-security-cloud" | "omp-native" | "sarif-import";
                name: string;
                pluginVersion?: string | undefined;
                revision?: string | undefined;
                vendor?: string | undefined;
                version?: string | undefined;
            };
            sourceIds?: Record<string, string> | undefined;
            upstream?: {
                archiveSha256?: string | undefined;
                packageVersion?: string | undefined;
                pluginVersion?: string | undefined;
                repository?: string | undefined;
                revision?: string | undefined;
            } | undefined;
            vendorFingerprints?: Record<string, string> | undefined;
        };
        reportRef?: string | undefined;
        sarifRef?: string | undefined;
        schemaVersion: "1.0";
        startedAt?: string | undefined;
        status: "cancelled" | "completed" | "failed" | "partial" | "planned" | "running";
        target: {
            baseRevision?: string | undefined;
            displayName: string;
            excludePaths: string[];
            headRevision?: string | undefined;
            includePaths: string[];
            kind: "imported" | "ref_diff" | "repository" | "scoped_path" | "working_tree";
            repositoryRoot: string;
            revision?: string | undefined;
            treeDigest: string;
        };
    }, {
        completedAt?: string | undefined;
        coverage: {
            completeness: "complete" | "partial" | "unknown";
            deferred: {
                id: string;
                paths?: string[] | undefined;
                reason: string;
                surfaceIds?: string[] | undefined;
            }[];
            excludePaths: string[];
            explicitExclusions: {
                pattern: string;
                reason: string;
            }[];
            includePaths: string[];
            inventoryStrategy: "custom" | "diff" | "directory" | "imported" | "repository" | "scoped_path";
            mode: "deep_repository" | "diff" | "imported" | "repository" | "scoped_path" | "working_tree";
            openQuestions?: {
                followUpPrompt?: string | undefined;
                question: string;
            }[] | undefined;
            surfaces: {
                disposition: "needs_follow_up" | "no_issue_found" | "not_applicable" | "rejected" | "reported";
                id: string;
                label: string;
                notes?: string | undefined;
                receiptRefs: string[];
                riskArea?: string | undefined;
            }[];
        };
        createdAt: string;
        documentType: "omp-security.scan";
        error?: string | undefined;
        findingIds: string[];
        id: string;
        metrics?: {
            cost?: number | undefined;
            premiumRequests?: number | undefined;
            runtimeMs?: number | undefined;
            tokenUsage?: {
                cacheRead: number;
                cacheWrite: number;
                input: number;
                output: number;
                reasoning: number;
                total: number;
            } | undefined;
        } | undefined;
        plan?: {
            account: {
                accountId?: string | undefined;
                credentialId: number;
                email?: string | undefined;
                organizationId?: string | undefined;
                organizationName?: string | undefined;
                provider: string;
            };
            configFingerprint: string;
            createdAt: string;
            documentType: "omp-security.scan-plan";
            fingerprint: string;
            id: string;
            knowledgeBases: {
                path: string;
                sha256: string;
                size: number;
            }[];
            model: {
                modelId: string;
                provider: string;
                thinkingLevel?: string | undefined;
            };
            output: {
                archiveExisting: boolean;
                existingState: "absent" | "archivable" | "empty";
                root: string;
            };
            repositoryRoot: string;
            schemaVersion: "1.0";
            target: {
                baseRevision?: string | undefined;
                displayName: string;
                excludePaths: string[];
                headRevision?: string | undefined;
                includePaths: string[];
                kind: "imported" | "ref_diff" | "repository" | "scoped_path" | "working_tree";
                repositoryRoot: string;
                revision?: string | undefined;
                treeDigest: string;
            };
            workflowFingerprint: string;
        } | undefined;
        producer: {
            kind: "codex-security-bundle" | "codex-security-cloud" | "omp-native" | "sarif-import";
            name: string;
            pluginVersion?: string | undefined;
            revision?: string | undefined;
            vendor?: string | undefined;
            version?: string | undefined;
        };
        projectKey: string;
        provenance: {
            createdAt: string;
            importedAt?: string | undefined;
            metadata?: Record<string, unknown> | undefined;
            producer: {
                kind: "codex-security-bundle" | "codex-security-cloud" | "omp-native" | "sarif-import";
                name: string;
                pluginVersion?: string | undefined;
                revision?: string | undefined;
                vendor?: string | undefined;
                version?: string | undefined;
            };
            sourceIds?: Record<string, string> | undefined;
            upstream?: {
                archiveSha256?: string | undefined;
                packageVersion?: string | undefined;
                pluginVersion?: string | undefined;
                repository?: string | undefined;
                revision?: string | undefined;
            } | undefined;
            vendorFingerprints?: Record<string, string> | undefined;
        };
        reportRef?: string | undefined;
        sarifRef?: string | undefined;
        schemaVersion: "1.0";
        startedAt?: string | undefined;
        status: "cancelled" | "completed" | "failed" | "partial" | "planned" | "running";
        target: {
            baseRevision?: string | undefined;
            displayName: string;
            excludePaths: string[];
            headRevision?: string | undefined;
            includePaths: string[];
            kind: "imported" | "ref_diff" | "repository" | "scoped_path" | "working_tree";
            repositoryRoot: string;
            revision?: string | undefined;
            treeDigest: string;
        };
    }>;
    securityScanBundleSchema: import("@oh-my-pi/omptype").FluentType<{
        findings: {
            anchor?: string | undefined;
            confidence: {
                level: "high" | "low" | "medium";
                rationale?: string | undefined;
            };
            disposition: {
                actor?: string | undefined;
                rationale?: string | undefined;
                status: "accepted_risk" | "false_positive" | "fixed" | "open" | "wont_fix";
                updatedAt?: string | undefined;
            };
            evidence: {
                excerpt?: string | undefined;
                explanation: string;
                id: string;
                kind: "code" | "note" | "trace" | "validation";
                label: string;
                location?: {
                    endColumn?: number | undefined;
                    endLine?: number | undefined;
                    path: string;
                    role?: string | undefined;
                    startColumn?: number | undefined;
                    startLine: number;
                } | undefined;
            }[];
            extensions?: Record<string, unknown> | undefined;
            fingerprint: string;
            id: string;
            occurrences: {
                evidenceIds: string[];
                id: string;
                locations: {
                    endColumn?: number | undefined;
                    endLine?: number | undefined;
                    path: string;
                    role?: string | undefined;
                    startColumn?: number | undefined;
                    startLine: number;
                }[];
            }[];
            provenance: {
                createdAt: string;
                importedAt?: string | undefined;
                metadata?: Record<string, unknown> | undefined;
                producer: {
                    kind: "codex-security-bundle" | "codex-security-cloud" | "omp-native" | "sarif-import";
                    name: string;
                    pluginVersion?: string | undefined;
                    revision?: string | undefined;
                    vendor?: string | undefined;
                    version?: string | undefined;
                };
                sourceIds?: Record<string, string> | undefined;
                upstream?: {
                    archiveSha256?: string | undefined;
                    packageVersion?: string | undefined;
                    pluginVersion?: string | undefined;
                    repository?: string | undefined;
                    revision?: string | undefined;
                } | undefined;
                vendorFingerprints?: Record<string, string> | undefined;
            };
            remediation?: string | undefined;
            ruleId: string;
            scanId: string;
            severity: {
                level: "critical" | "high" | "informational" | "low" | "medium";
                rationale?: string | undefined;
                score?: number | undefined;
                scoringSystem?: string | undefined;
                vector?: string | undefined;
            };
            summary: string;
            taxonomy: {
                category: string;
                cwe: string[];
                tags?: string[] | undefined;
            };
            title: string;
            validation: {
                evidenceIds: string[];
                status: "error" | "partial" | "rejected" | "unvalidated" | "validated";
                summary?: string | undefined;
                validatedAt?: string | undefined;
            };
        }[];
        report?: string | undefined;
        sarif?: Record<string, unknown> | undefined;
        scan: {
            completedAt?: string | undefined;
            coverage: {
                completeness: "complete" | "partial" | "unknown";
                deferred: {
                    id: string;
                    paths?: string[] | undefined;
                    reason: string;
                    surfaceIds?: string[] | undefined;
                }[];
                excludePaths: string[];
                explicitExclusions: {
                    pattern: string;
                    reason: string;
                }[];
                includePaths: string[];
                inventoryStrategy: "custom" | "diff" | "directory" | "imported" | "repository" | "scoped_path";
                mode: "deep_repository" | "diff" | "imported" | "repository" | "scoped_path" | "working_tree";
                openQuestions?: {
                    followUpPrompt?: string | undefined;
                    question: string;
                }[] | undefined;
                surfaces: {
                    disposition: "needs_follow_up" | "no_issue_found" | "not_applicable" | "rejected" | "reported";
                    id: string;
                    label: string;
                    notes?: string | undefined;
                    receiptRefs: string[];
                    riskArea?: string | undefined;
                }[];
            };
            createdAt: string;
            documentType: "omp-security.scan";
            error?: string | undefined;
            findingIds: string[];
            id: string;
            metrics?: {
                cost?: number | undefined;
                premiumRequests?: number | undefined;
                runtimeMs?: number | undefined;
                tokenUsage?: {
                    cacheRead: number;
                    cacheWrite: number;
                    input: number;
                    output: number;
                    reasoning: number;
                    total: number;
                } | undefined;
            } | undefined;
            plan?: {
                account: {
                    accountId?: string | undefined;
                    credentialId: number;
                    email?: string | undefined;
                    organizationId?: string | undefined;
                    organizationName?: string | undefined;
                    provider: string;
                };
                configFingerprint: string;
                createdAt: string;
                documentType: "omp-security.scan-plan";
                fingerprint: string;
                id: string;
                knowledgeBases: {
                    path: string;
                    sha256: string;
                    size: number;
                }[];
                model: {
                    modelId: string;
                    provider: string;
                    thinkingLevel?: string | undefined;
                };
                output: {
                    archiveExisting: boolean;
                    existingState: "absent" | "archivable" | "empty";
                    root: string;
                };
                repositoryRoot: string;
                schemaVersion: "1.0";
                target: {
                    baseRevision?: string | undefined;
                    displayName: string;
                    excludePaths: string[];
                    headRevision?: string | undefined;
                    includePaths: string[];
                    kind: "imported" | "ref_diff" | "repository" | "scoped_path" | "working_tree";
                    repositoryRoot: string;
                    revision?: string | undefined;
                    treeDigest: string;
                };
                workflowFingerprint: string;
            } | undefined;
            producer: {
                kind: "codex-security-bundle" | "codex-security-cloud" | "omp-native" | "sarif-import";
                name: string;
                pluginVersion?: string | undefined;
                revision?: string | undefined;
                vendor?: string | undefined;
                version?: string | undefined;
            };
            projectKey: string;
            provenance: {
                createdAt: string;
                importedAt?: string | undefined;
                metadata?: Record<string, unknown> | undefined;
                producer: {
                    kind: "codex-security-bundle" | "codex-security-cloud" | "omp-native" | "sarif-import";
                    name: string;
                    pluginVersion?: string | undefined;
                    revision?: string | undefined;
                    vendor?: string | undefined;
                    version?: string | undefined;
                };
                sourceIds?: Record<string, string> | undefined;
                upstream?: {
                    archiveSha256?: string | undefined;
                    packageVersion?: string | undefined;
                    pluginVersion?: string | undefined;
                    repository?: string | undefined;
                    revision?: string | undefined;
                } | undefined;
                vendorFingerprints?: Record<string, string> | undefined;
            };
            reportRef?: string | undefined;
            sarifRef?: string | undefined;
            schemaVersion: "1.0";
            startedAt?: string | undefined;
            status: "cancelled" | "completed" | "failed" | "partial" | "planned" | "running";
            target: {
                baseRevision?: string | undefined;
                displayName: string;
                excludePaths: string[];
                headRevision?: string | undefined;
                includePaths: string[];
                kind: "imported" | "ref_diff" | "repository" | "scoped_path" | "working_tree";
                repositoryRoot: string;
                revision?: string | undefined;
                treeDigest: string;
            };
        };
    }, {
        findings: {
            anchor?: string | undefined;
            confidence: {
                level: "high" | "low" | "medium";
                rationale?: string | undefined;
            };
            disposition: {
                actor?: string | undefined;
                rationale?: string | undefined;
                status: "accepted_risk" | "false_positive" | "fixed" | "open" | "wont_fix";
                updatedAt?: string | undefined;
            };
            evidence: {
                excerpt?: string | undefined;
                explanation: string;
                id: string;
                kind: "code" | "note" | "trace" | "validation";
                label: string;
                location?: {
                    endColumn?: number | undefined;
                    endLine?: number | undefined;
                    path: string;
                    role?: string | undefined;
                    startColumn?: number | undefined;
                    startLine: number;
                } | undefined;
            }[];
            extensions?: Record<string, unknown> | undefined;
            fingerprint: string;
            id: string;
            occurrences: {
                evidenceIds: string[];
                id: string;
                locations: {
                    endColumn?: number | undefined;
                    endLine?: number | undefined;
                    path: string;
                    role?: string | undefined;
                    startColumn?: number | undefined;
                    startLine: number;
                }[];
            }[];
            provenance: {
                createdAt: string;
                importedAt?: string | undefined;
                metadata?: Record<string, unknown> | undefined;
                producer: {
                    kind: "codex-security-bundle" | "codex-security-cloud" | "omp-native" | "sarif-import";
                    name: string;
                    pluginVersion?: string | undefined;
                    revision?: string | undefined;
                    vendor?: string | undefined;
                    version?: string | undefined;
                };
                sourceIds?: Record<string, string> | undefined;
                upstream?: {
                    archiveSha256?: string | undefined;
                    packageVersion?: string | undefined;
                    pluginVersion?: string | undefined;
                    repository?: string | undefined;
                    revision?: string | undefined;
                } | undefined;
                vendorFingerprints?: Record<string, string> | undefined;
            };
            remediation?: string | undefined;
            ruleId: string;
            scanId: string;
            severity: {
                level: "critical" | "high" | "informational" | "low" | "medium";
                rationale?: string | undefined;
                score?: number | undefined;
                scoringSystem?: string | undefined;
                vector?: string | undefined;
            };
            summary: string;
            taxonomy: {
                category: string;
                cwe: string[];
                tags?: string[] | undefined;
            };
            title: string;
            validation: {
                evidenceIds: string[];
                status: "error" | "partial" | "rejected" | "unvalidated" | "validated";
                summary?: string | undefined;
                validatedAt?: string | undefined;
            };
        }[];
        report?: string | undefined;
        sarif?: Record<string, unknown> | undefined;
        scan: {
            completedAt?: string | undefined;
            coverage: {
                completeness: "complete" | "partial" | "unknown";
                deferred: {
                    id: string;
                    paths?: string[] | undefined;
                    reason: string;
                    surfaceIds?: string[] | undefined;
                }[];
                excludePaths: string[];
                explicitExclusions: {
                    pattern: string;
                    reason: string;
                }[];
                includePaths: string[];
                inventoryStrategy: "custom" | "diff" | "directory" | "imported" | "repository" | "scoped_path";
                mode: "deep_repository" | "diff" | "imported" | "repository" | "scoped_path" | "working_tree";
                openQuestions?: {
                    followUpPrompt?: string | undefined;
                    question: string;
                }[] | undefined;
                surfaces: {
                    disposition: "needs_follow_up" | "no_issue_found" | "not_applicable" | "rejected" | "reported";
                    id: string;
                    label: string;
                    notes?: string | undefined;
                    receiptRefs: string[];
                    riskArea?: string | undefined;
                }[];
            };
            createdAt: string;
            documentType: "omp-security.scan";
            error?: string | undefined;
            findingIds: string[];
            id: string;
            metrics?: {
                cost?: number | undefined;
                premiumRequests?: number | undefined;
                runtimeMs?: number | undefined;
                tokenUsage?: {
                    cacheRead: number;
                    cacheWrite: number;
                    input: number;
                    output: number;
                    reasoning: number;
                    total: number;
                } | undefined;
            } | undefined;
            plan?: {
                account: {
                    accountId?: string | undefined;
                    credentialId: number;
                    email?: string | undefined;
                    organizationId?: string | undefined;
                    organizationName?: string | undefined;
                    provider: string;
                };
                configFingerprint: string;
                createdAt: string;
                documentType: "omp-security.scan-plan";
                fingerprint: string;
                id: string;
                knowledgeBases: {
                    path: string;
                    sha256: string;
                    size: number;
                }[];
                model: {
                    modelId: string;
                    provider: string;
                    thinkingLevel?: string | undefined;
                };
                output: {
                    archiveExisting: boolean;
                    existingState: "absent" | "archivable" | "empty";
                    root: string;
                };
                repositoryRoot: string;
                schemaVersion: "1.0";
                target: {
                    baseRevision?: string | undefined;
                    displayName: string;
                    excludePaths: string[];
                    headRevision?: string | undefined;
                    includePaths: string[];
                    kind: "imported" | "ref_diff" | "repository" | "scoped_path" | "working_tree";
                    repositoryRoot: string;
                    revision?: string | undefined;
                    treeDigest: string;
                };
                workflowFingerprint: string;
            } | undefined;
            producer: {
                kind: "codex-security-bundle" | "codex-security-cloud" | "omp-native" | "sarif-import";
                name: string;
                pluginVersion?: string | undefined;
                revision?: string | undefined;
                vendor?: string | undefined;
                version?: string | undefined;
            };
            projectKey: string;
            provenance: {
                createdAt: string;
                importedAt?: string | undefined;
                metadata?: Record<string, unknown> | undefined;
                producer: {
                    kind: "codex-security-bundle" | "codex-security-cloud" | "omp-native" | "sarif-import";
                    name: string;
                    pluginVersion?: string | undefined;
                    revision?: string | undefined;
                    vendor?: string | undefined;
                    version?: string | undefined;
                };
                sourceIds?: Record<string, string> | undefined;
                upstream?: {
                    archiveSha256?: string | undefined;
                    packageVersion?: string | undefined;
                    pluginVersion?: string | undefined;
                    repository?: string | undefined;
                    revision?: string | undefined;
                } | undefined;
                vendorFingerprints?: Record<string, string> | undefined;
            };
            reportRef?: string | undefined;
            sarifRef?: string | undefined;
            schemaVersion: "1.0";
            startedAt?: string | undefined;
            status: "cancelled" | "completed" | "failed" | "partial" | "planned" | "running";
            target: {
                baseRevision?: string | undefined;
                displayName: string;
                excludePaths: string[];
                headRevision?: string | undefined;
                includePaths: string[];
                kind: "imported" | "ref_diff" | "repository" | "scoped_path" | "working_tree";
                repositoryRoot: string;
                revision?: string | undefined;
                treeDigest: string;
            };
        };
    }>;
};
