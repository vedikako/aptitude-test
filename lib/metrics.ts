type MetricsState = {
  startedAt: number;
  requests: number;
  errors: number;
  durationSeconds: number;
};

const globalState = globalThis as typeof globalThis & { __aptitudeMetrics?: MetricsState };

function state(): MetricsState {
  if (!globalState.__aptitudeMetrics) {
    globalState.__aptitudeMetrics = {
      startedAt: Date.now(),
      requests: 0,
      errors: 0,
      durationSeconds: 0,
    };
  }
  return globalState.__aptitudeMetrics;
}

export function noteRequest(durationMs: number, status: number) {
  const current = state();
  current.requests += 1;
  current.durationSeconds += Math.max(0, durationMs) / 1000;
  if (status >= 500) current.errors += 1;
}

export function renderMetrics() {
  const current = state();
  const uptime = (Date.now() - current.startedAt) / 1000;
  const lines = [
    "# HELP aptitude_up 1 when this process is serving metrics.",
    "# TYPE aptitude_up gauge",
    "aptitude_up 1",
    "# HELP aptitude_uptime_seconds Seconds since this process started.",
    "# TYPE aptitude_uptime_seconds gauge",
    `aptitude_uptime_seconds ${uptime.toFixed(3)}`,
    "# HELP aptitude_http_requests_total Observed HTTP requests.",
    "# TYPE aptitude_http_requests_total counter",
    `aptitude_http_requests_total ${current.requests}`,
    "# HELP aptitude_http_errors_total Observed HTTP responses with status 500 or higher.",
    "# TYPE aptitude_http_errors_total counter",
    `aptitude_http_errors_total ${current.errors}`,
    "# HELP aptitude_http_request_duration_seconds_sum Sum of observed request durations in seconds.",
    "# TYPE aptitude_http_request_duration_seconds_sum counter",
    `aptitude_http_request_duration_seconds_sum ${current.durationSeconds.toFixed(6)}`,
    "# HELP aptitude_http_request_duration_seconds_count Number of observed request durations.",
    "# TYPE aptitude_http_request_duration_seconds_count counter",
    `aptitude_http_request_duration_seconds_count ${current.requests}`,
    "",
  ];
  return lines.join("\n");
}
