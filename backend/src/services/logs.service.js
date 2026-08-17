import { API_LOGS, getLogStats, clearApiLogs } from '../utils/logger.js';
import { prisma } from '../config/db.js';

export async function fetchApiLogs() {
  if (prisma) {
    try {
      const dbLogs = await prisma.apiLog.findMany({
        take: 100,
        orderBy: { timestamp: 'desc' }
      });
      if (dbLogs.length > 0) {
        const formattedLogs = dbLogs.map(l => ({
          ...l,
          queryParams: l.queryParams ? JSON.parse(l.queryParams) : {},
          headers: l.headers ? JSON.parse(l.headers) : {},
          body: l.body ? JSON.parse(l.body) : null,
          responseBody: l.responseBody ? JSON.parse(l.responseBody) : null
        }));
        return {
          logs: formattedLogs,
          stats: getLogStats()
        };
      }
    } catch (err) {
      console.warn('Prisma fetchApiLogs warning, fallback to memory:', err.message);
    }
  }

  return {
    logs: API_LOGS,
    stats: getLogStats()
  };
}

export async function clearAllApiLogs() {
  clearApiLogs();
  if (prisma) {
    try {
      await prisma.apiLog.deleteMany({});
    } catch (err) {
      console.warn('Prisma clearAllApiLogs warning:', err.message);
    }
  }
  return { message: 'Toate log-urile API au fost șterse cu succes.' };
}
