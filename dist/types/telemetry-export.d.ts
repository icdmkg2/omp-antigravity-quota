/**
 * OTLP telemetry export bootstrap.
 *
 * oh-my-pi's agent core (`@oh-my-pi/pi-agent-core`) emits OpenTelemetry GenAI
 * spans through the global `@opentelemetry/api` tracer, and exposes run-level
 * callbacks for metrics/log pipelines. This module resolves the standard
 * `OTEL_*` env contract (endpoint, exporter selection, protocol,
 * `OTEL_SDK_DISABLED`) and, only when at least one signal has an OTLP endpoint,
 * loads `./telemetry-export-otlp` to register the trace/log/metric providers —
 * keeping the OTel SDK + exporter module graph (~100ms) out of default startup.
 *
 * Only the `http/protobuf` transport is supported — an
 * `OTEL_EXPORTER_OTLP*_PROTOCOL` of `grpc` or `http/json` declines rather than
 * misrouting protobuf payloads.
 */
import type { AgentTelemetryConfig } from "@oh-my-pi/pi-agent-core";
/** Per-signal OTLP export toggles resolved from the `OTEL_*` env contract. */
export interface TelemetrySignalConfig {
    readonly trace: boolean;
    readonly log: boolean;
    readonly metric: boolean;
}
/**
 * Whether {@link initTelemetryExport} registered any real OTLP signal provider.
 * The CLI uses this to decide whether to switch on the agent loop's telemetry
 * hooks; metrics and structured logs need those callbacks even when traces are
 * disabled.
 */
export declare function isTelemetryExportEnabled(): boolean;
/**
 * Merge OTLP metrics/log hooks into an existing agent telemetry config.
 *
 * The caller still owns content-capture policy, cost estimation, and custom
 * attributes. This only appends host-level metrics/log forwarding for the
 * providers registered by {@link initTelemetryExport}; a passthrough when
 * export is disabled.
 */
export declare function createTelemetryExportConfig(config: AgentTelemetryConfig | undefined): AgentTelemetryConfig | undefined;
/**
 * Register global trace/log/meter providers when OTLP endpoints are configured
 * through env. Idempotent, and a no-op when no signal has an endpoint (or when
 * the OTEL kill-switches are engaged), so startup can call it unconditionally.
 */
export declare function initTelemetryExport(): Promise<void>;
/**
 * Flush buffered spans, log records, and metrics. No-op when export is disabled.
 * Hosts embedding the agent can call this at natural boundaries (e.g. the end
 * of a turn) so telemetry surfaces promptly rather than on the batch interval.
 */
export declare function flushTelemetryExport(): Promise<void>;
