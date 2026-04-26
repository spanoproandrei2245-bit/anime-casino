export function asyncMapCallback<T, U>(arr: T[], fn: (item: T, cb: (res: U) => void) => void, done: (res: U[]) => void) {
    let results: U[] = [];
    let completed = 0;
    if (arr.length === 0) return done([]);
    
    arr.forEach((item, i) => {
        fn(item, (res) => {
            results[i] = res;
            completed++;
            if (completed === arr.length) done(results);
        });
    });
}

export function asyncMapPromise<T, U>(arr: T[], fn: (item: T, signal?: AbortSignal) => Promise<U>, signal?: AbortSignal): Promise<U[]> {
    return new Promise((resolve, reject) => {
        if (signal?.aborted) return reject(new Error('Aborted'));
        const onAbort = () => reject(new Error('Aborted'));
        signal?.addEventListener('abort', onAbort);

        Promise.all(arr.map(item => fn(item, signal)))
            .then(res => {
                signal?.removeEventListener('abort', onAbort);
                resolve(res);
            })
            .catch(err => {
                signal?.removeEventListener('abort', onAbort);
                reject(err);
            });
    });
}