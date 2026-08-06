import { verifyToken } from './jwt';
import { getDb } from './mongo';

/**
 * Higher-order function to wrap Next.js Route Handlers with Morgan-style logging.
 * Logs to standard output (console) and persists logs to MongoDB 'api_logs' collection.
 */
export function withLogging(handler) {
  return async (req, ...args) => {
    const startTime = Date.now();
    const method = req.method;
    const url = req.nextUrl ? req.nextUrl.pathname + req.nextUrl.search : req.url;
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

    // Try to get authenticated user from session cookie for auditing
    let userEmail = '-';
    try {
      const cookieHeader = req.headers.get('cookie') || '';
      const tokenMatch = cookieHeader.match(/session_token=([^;]+)/);
      if (tokenMatch && tokenMatch[1]) {
        const decoded = verifyToken(tokenMatch[1]);
        if (decoded && decoded.email) {
          userEmail = decoded.email;
        }
      }
    } catch {
      // Ignore token parsing errors during log extraction
    }

    let response;
    let status = 500;

    try {
      response = await handler(req, ...args);
      status = response ? response.status : 200;
      return response;
    } catch (error) {
      status = 500;
      console.error(`[API ERROR] ${method} ${url} :`, error);
      throw error;
    } finally {
      const duration = Date.now() - startTime;

      // Console output (similar to Morgan 'dev' / 'combined' hybrid format)
      console.log(`[API] ${method} ${url} ${status} - ${duration}ms | User: ${userEmail} | IP: ${ip}`);

      // Persist to MongoDB (gracefully handle failures to not crash the request)
      try {
        const db = await getDb();
        await db.collection('api_logs').insertOne({
          method,
          url,
          status,
          duration,
          ip,
          userAgent,
          userEmail,
          timestamp: new Date()
        });
      } catch (dbError) {
        console.error('[LOGGER DB ERROR] Failed to write API log to MongoDB:', dbError.message);
      }
    }
  };
}
