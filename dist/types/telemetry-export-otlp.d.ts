/**
 * OTLP provider registration and signal recording for telemetry export.
 *
 * Loaded on demand by `./telemetry-export` only when an `OTEL_*` endpoint is
 * configured — the OTel SDK + OTLP exporter graph costs ~100ms of module
 * evaluation, so it must stay out of default CLI startup.
 *
 * Only the `http/protobuf` transport is supported — an
 * `OTEL_EXPORTER_OTLP*_PROTOCOL` of `grpc` or `http/json` declines rather than
 * misrouting protobuf payloads. The exporter line is pinned to the 0.218/2.7
 * family validated under Bun; the 1.x OTLP line deadlocks when its
 * `req.on("close")` handler fires after a successful export.
 */
import type { AgentTelemetryConfig } from "@oh-my-pi/pi-agent-core";
import type { TelemetrySignalConfig } from "./telemetry-export.js";
/** Whether {@link registerProviders} registered any real OTLP signal provider. */
export declare function isTelemetryExportEnabled(): boolean;
/**
 * Merge OTLP metrics/log hooks into an existing agent telemetry config.
 *
 * The caller still owns content-capture policy, cost estimation, and custom
 * attributes. This only appends host-level metrics/log forwarding for the
 * providers registered by {@link registerProviders}.
 */
export declare function createTelemetryExportConfig(config: AgentTelemetryConfig | undefined): AgentTelemetryConfig | undefined;
/** Register global trace/log/meter providers for the enabled signals. */
export declare function registerProviders(signalConfig: TelemetrySignalConfig): Promise<void>;
/** Flush buffered spans, log records, and metrics across all registered providers. */
export declare function flushTelemetryExport(): Promise<void>;
