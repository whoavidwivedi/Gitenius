type RateLimitRecord = {
    count: number;
    lastReset: number;
};

const store = new Map<string, RateLimitRecord>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // 5 requests per minute

export function rateLimit(ip: string): { success: boolean; reset: number; remaining: number } {
    const now = Date.now();
    const record = store.get(ip) || { count: 0, lastReset: now };

    // Reset window if expired
    if (now - record.lastReset > WINDOW_MS) {
        record.count = 0;
        record.lastReset = now;
    }

    // Check limit
    if (record.count >= MAX_REQUESTS) {
        return {
            success: false,
            reset: record.lastReset + WINDOW_MS,
            remaining: 0,
        };
    }

    // Increment
    record.count++;
    store.set(ip, record);

    // Cleanup old entries periodically (could be optimized, but fine for basic)
    if (store.size > 10000) {
        for (const [key, val] of Array.from(store.entries())) {
            if (now - val.lastReset > WINDOW_MS) {
                store.delete(key);
            }
        }
    }

    return {
        success: true,
        reset: record.lastReset + WINDOW_MS,
        remaining: MAX_REQUESTS - record.count,
    };
}
