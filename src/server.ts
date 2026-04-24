import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './database';
import { EventEmitter } from 'events';
import { memoizeWithTimeout } from './utils';

const fastify = Fastify({ logger: true });
const JWT_SECRET = 'super-secret-anime-key-123'; 

const casinoEvents = new EventEmitter();

casinoEvents.on('jackpot', (username: string, winAmount: number) => {
    console.log(`🎉 [РЕАКТИВНИЙ ІВЕНТ] ГРАВЕЦЬ ${username} ЗІРВАВ ДЖЕКПОТ: ${winAmount} 💎!`);
});

casinoEvents.on('deposit', (username: string, amount: number) => {
    console.log(`💸 [РЕАКТИВНИЙ ІВЕНТ] Гравець ${username} поповнив баланс на ${amount} монет.`);
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
    if (!authHeader) return reply.status(401).send({ error: 'Не авторизовано!' });
    
    const token = authHeader.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        request.user = decoded;
    } catch (err) {
        return reply.status(401).send({ error: 'Недійсний токен!' });
    }
};

fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/',
});

fastify.post('/api/register', async (request, reply) => {
    const { username, password } = request.body as any;
    if (!username || !password) return reply.status(400).send({ error: 'Введіть дані' });

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) return reply.status(400).send({ error: 'Нік вже зайнятий' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { username, password: hashedPassword } });

    return { success: true, message: 'Реєстрація успішна!' };
});

fastify.post('/api/login', async (request, reply) => {
    const { username, password } = request.body as any;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return reply.status(400).send({ error: 'Гравця не знайдено!' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return reply.status(400).send({ error: 'Неправильний пароль!' });

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    return { success: true, token, balance: user.balance, username: user.username };
});

fastify.post('/api/spin', { preHandler: [authProxy] }, async (request: any, reply: any) => {
    const betAmount = Number(request.body.bet);
    if (!betAmount || betAmount <= 0) return reply.status(400).send({ error: 'Невірна ставка' });

    const user = await prisma.user.findUnique({ where: { id: request.user.userId } });
    if (!user || user.balance < betAmount) return reply.status(400).send({ error: 'Недостатньо монет!' });

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

    if (multiplier >= 5) {
        casinoEvents.emit('jackpot', user.username, winAmount);
    }

    return { success: true, result, winAmount, newBalance };
});

fastify.post('/api/deposit', { preHandler: [authProxy] }, async (request: any, reply: any) => {
    const user = await prisma.user.findUnique({ where: { id: request.user.userId } });
    if (!user) return reply.status(404).send({ error: 'Гравця не знайдено' });

    const newBalance = user.balance + 500;

    await prisma.user.update({
        where: { id: user.id },
        data: { balance: newBalance }
    });

    casinoEvents.emit('deposit', user.username, 500);

    return { success: true, newBalance };
});

const getTopPlayers = async () => {
    return await prisma.user.findMany({
        orderBy: { balance: 'desc' },
        take: 10,
        select: { username: true, balance: true }
    });
};

const getTopPlayersMemoized = memoizeWithTimeout(getTopPlayers, 60000);

fastify.get('/api/leaderboard', async (request, reply) => {
    const topPlayers = await getTopPlayersMemoized();
    return { success: true, leaderboard: topPlayers };
});

const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
        console.log('Гамселиться на http://localhost:3000');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();