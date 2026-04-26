export class PriorityQueue<T> {
    private items: { item: T; priority: number; timestamp: number }[] = [];
    private counter = 0;

    enqueue(item: T, priority: number) {
        this.items.push({ item, priority, timestamp: this.counter++ });
    }

    dequeueHighest(): T | undefined {
        if (!this.items.length) return undefined;
        this.items.sort((a, b) => b.priority - a.priority || a.timestamp - b.timestamp);
        return this.items.shift()?.item;
    }

    dequeueLowest(): T | undefined {
        if (!this.items.length) return undefined;
        this.items.sort((a, b) => a.priority - b.priority || a.timestamp - b.timestamp);
        return this.items.shift()?.item;
    }

    dequeueOldest(): T | undefined {
        if (!this.items.length) return undefined;
        this.items.sort((a, b) => a.timestamp - b.timestamp);
        return this.items.shift()?.item;
    }

    dequeueNewest(): T | undefined {
        if (!this.items.length) return undefined;
        this.items.sort((a, b) => b.timestamp - a.timestamp);
        return this.items.shift()?.item;
    }

    peekHighest(): T | undefined {
        if (!this.items.length) return undefined;
        this.items.sort((a, b) => b.priority - a.priority || a.timestamp - b.timestamp);
        return this.items[0]?.item;
    }

    peekLowest(): T | undefined {
        if (!this.items.length) return undefined;
        this.items.sort((a, b) => a.priority - b.priority || a.timestamp - b.timestamp);
        return this.items[0]?.item;
    }

    peekOldest(): T | undefined {
        if (!this.items.length) return undefined;
        this.items.sort((a, b) => a.timestamp - b.timestamp);
        return this.items[0]?.item;
    }

    peekNewest(): T | undefined {
        if (!this.items.length) return undefined;
        this.items.sort((a, b) => b.timestamp - a.timestamp);
        return this.items[0]?.item;
    }
}