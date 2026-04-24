export function memoizeWithTimeout<T>(fn: (...args: any[]) => Promise<T>, ttlMilliseconds: number) {
    const cache = new Map<string, { value: T; expiry: number }>();

    return async (...args: any[]): Promise<T> => {
        const key = JSON.stringify(args);
        const now = Date.now();
        const cachedData = cache.get(key);

        if (cachedData && cachedData.expiry > now) {
            return cachedData.value;
        }

        const result = await fn(...args);
        cache.set(key, { value: result, expiry: now + ttlMilliseconds });

        for (const [k, v] of cache.entries()) {
            if (v.expiry <= now) cache.delete(k);
        }

        return result;
    };
}