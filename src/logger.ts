export function Log(level: 'INFO' | 'DEBUG' | 'ERROR' = 'INFO') {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            const start = Date.now();
            try {
                const result = await originalMethod.apply(this, args);
                if (level !== 'ERROR') {
                    console.log(`[${level}] ${propertyKey} (${Date.now() - start}ms) | Args: ${JSON.stringify(args)}`);
                }
                return result;
            } catch (err) {
                console.error(`[ERROR] ${propertyKey} (${Date.now() - start}ms) | Failed:`, err);
                throw err;
            }
        };
        return descriptor;
    };
}