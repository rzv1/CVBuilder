export const API_LOGS = [];
export const MAX_API_LOGS = 200;

/**
 * Record an API request log entry
 * @param {object} logEntry
 */
export function recordApiLog(logEntry) {
  API_LOGS.unshift(logEntry);
  if (API_LOGS.length > MAX_API_LOGS) {
    API_LOGS.pop();
  }
}

/**
 * Get API log statistics
 * @returns {object}
 */
export function getLogStats() {
  const total = API_LOGS.length;
  const successCount = API_LOGS.filter(l => l.statusCode >= 200 && l.statusCode < 300).length;
  const errorCount = API_LOGS.filter(l => l.statusCode >= 400).length;
  const avgDuration = total > 0 ? Math.round(API_LOGS.reduce((acc, l) => acc + l.durationMs, 0) / total) : 0;

  return {
    total,
    successCount,
    errorCount,
    avgDuration
  };
}

/**
 * Clear all recorded API logs
 */
export function clearApiLogs() {
  API_LOGS.length = 0;
}
