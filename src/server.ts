import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './database';
import { EventEmitter } from 'events';
import { Readable } from 'stream';
import { memoizeWithTimeout } from './utils';
import { PriorityQueue } from './queue';
import { asyncMapPromise } from './asyncTasks';

const fastify = Fastify({ logger: true });
const JWT_SECRET = 'super-secret-anime-key-123'; 

const casinoEvents = new EventEmitter();
const supportQueue = new PriorityQueue<{ username: string; issue: string }>();

casinoEvents.on('jackpot', (username: string, winAmount: number) => {
    console.log(`[JACKPOT] ${username} won ${winAmount}`);
});

casinoEvents.on('deposit', (username: string, amount: number) => {
    console.log(`[DEPOSIT] ${username} deposited ${amount}`);
});

const symbols = ['🍒', '💎', '🔔', '7️⃣'];
function* createInfiniteReel() {
    while (true) {
        yield symbols[Math.floor(Math.random() * symbols.length)];
    }
}
const reel = createInfiniteReel();

const authProxy = async (request: any, reply: any) => {
    const authHeader = request.headers.authorization;
    if (!authHeader) return reply.status(401).send({ error: 'Unauthorized' });
    
    const token = authHeader.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        request.user = decoded;
    } catch (err) {
        return reply.status(401).send({ error: 'Invalid token' });
    }
};

const getTopPlayers = async () => {
    return await prisma.user.findMany({
        orderBy: { balance: 'desc' },
        take: 10,
        select: { username: true, balance: true }
    });
};

const getTopPlayersMemoized = memoizeWithTimeout(getTopPlayers, 60000);

fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/',
});

fastify.post('/api/register', async (request, reply) => {
    const { username, password } = request.body as any;
    if (!username || !password) return reply.status(400).send({ error: 'No data' });

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) return reply.status(400).send({ error: 'Exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { username, password: hashedPassword } });

    return { success: true };
});

fastify.post('/api/login', async (request, reply) => {
    const { username, password } = request.body as any;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return reply.status(400).send({ error: 'Not found' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return reply.status(400).send({ error: 'Wrong password' });

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    return { success: true, token, balance: user.balance, username: user.username };
});

fastify.get('/api/leaderboard', async (request, reply) => {
    const topPlayers = await getTopPlayersMemoized();
    return { success: true, leaderboard: topPlayers };
});

fastify.get('/api/export', async (request, reply) => {
    reply.header('Content-Type', 'text/csv');
    reply.header('Content-Disposition', 'attachment; filename="leaderboard.csv"');

    async function* generateDataStream() {
        yield 'Rank,Username,Balance\n';
        const users = await prisma.user.findMany({ orderBy: { balance: 'desc' } });
        let rank = 1;
        for (const user of users) {
            yield `${rank},${user.username},${user.balance}\n`;
            rank++;
        }
    }

    return reply.send(Readable.from(generateDataStream()));
});

fastify.post('/api/spin', { preHandler: [authProxy] }, async (request: any, reply: any) => {
    const betAmount = Number(request.body.bet);
    if (!betAmount || betAmount <= 0) return reply.status(400).send({ error: 'Invalid bet' });

    const user = await prisma.user.findUnique({ where: { id: request.user.userId } });
    if (!user || user.balance < betAmount) return reply.status(400).send({ error: 'Not enough coins' });

    const result = [reel.next().value, reel.next().value, reel.next().value];
    let multiplier = 0;
    
    if (result[0] === result[1] && result[1] === result[2]) {
        if (result[0] === '7️⃣') multiplier = 10;
        else if (result[0] === '💎') multiplier = 5;
        else multiplier = 3;
    }

    const winAmount = Math.floor(betAmount * multiplier);
    const newBalance = user.balance - betAmount + winAmount;

    await prisma.user.update({
        where: { id: user.id },
        data: { balance: newBalance }
    });

    if (multiplier >= 5) casinoEvents.emit('jackpot', user.username, winAmount);

    return { success: true, result, winAmount, newBalance };
});

fastify.post('/api/deposit', { preHandler: [authProxy] }, async (request: any, reply: any) => {
    const user = await prisma.user.findUnique({ where: { id: request.user.userId } });
    if (!user) return reply.status(404).send({ error: 'Not found' });

    const newBalance = user.balance + 500;
    await prisma.user.update({ where: { id: user.id }, data: { balance: newBalance } });

    casinoEvents.emit('deposit', user.username, 500);
    return { success: true, newBalance };
});

fastify.post('/api/support/ticket', { preHandler: [authProxy] }, async (request: any, reply: any) => {
    const { issue, priority } = request.body;
    supportQueue.enqueue({ username: request.user.username, issue }, priority);
    return { success: true };
});

fastify.get('/api/support/process', async (request, reply) => {
    const ticket = supportQueue.dequeueHighest();
    return { success: true, ticket };
});

fastify.get('/api/vip-status', async (request, reply) => {
    const users = await getTopPlayersMemoized();
    const abortController = new AbortController();
    
    setTimeout(() => abortController.abort(), 5000);

    try {
        const enrichedUsers = await asyncMapPromise(users, async (u) => {
            return { username: u.username, isVip: u.balance > 5000 };
        }, abortController.signal);
        
        return { success: true, data: enrichedUsers };
    } catch (err) {
        return reply.status(500).send({ error: 'Aborted' });
    }
});

const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
        console.log('http://localhost:3000');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();    