import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './database';

const fastify = Fastify({ logger: true });
const JWT_SECRET = 'super-secret-anime-key-123'; 

// Роздача фронтенду
fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/',
});

// 1. РЕЄСТРАЦІЯ
fastify.post('/api/register', async (request, reply) => {
    const { username, password } = request.body as any;

    if (!username || !password) {
        return reply.status(400).send({ error: 'Введіть логін та пароль' });
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
        return reply.status(400).send({ error: 'Користувач з таким ніком вже існує!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
        }
    });

    return { success: true, message: 'Реєстрація успішна!' };
});

// 2. ЛОГІН
fastify.post('/api/login', async (request, reply) => {
    const { username, password } = request.body as any;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
        return reply.status(400).send({ error: 'Гравця не знайдено!' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return reply.status(400).send({ error: 'Неправильний пароль!' });
    }

    const token = jwt.sign(
        { userId: user.id, username: user.username }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
    );

    return { 
        success: true, 
        token, 
        balance: user.balance, 
        username: user.username 
    };
});

// 3. СПІН ДЛЯ СЛОТІВ
fastify.post('/api/spin', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader) return reply.status(401).send({ error: 'Не авторизовано!' });
    
    const token = authHeader.replace('Bearer ', '');
    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET) as any;
    } catch (err) {
        return reply.status(401).send({ error: 'Недійсний токен!' });
    }

    const betAmount = Number((request.body as any).bet);
    if (!betAmount || betAmount <= 0) return reply.status(400).send({ error: 'Невірна ставка' });

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || user.balance < betAmount) {
        return reply.status(400).send({ error: 'Недостатньо монет!' });
    }

    const symbols = ['🍒', '💎', '🔔', '7️⃣'];
    const result = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
    ];

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

    return { success: true, result, winAmount, newBalance };
});

// 4. ДОДЕП БАЛАНСУ
fastify.post('/api/deposit', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader) return reply.status(401).send({ error: 'Не авторизовано!' });
    
    const token = authHeader.replace('Bearer ', '');
    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET) as any;
    } catch (err) {
        return reply.status(401).send({ error: 'Недійсний токен!' });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return reply.status(404).send({ error: 'Гравця не знайдено' });

    const newBalance = user.balance + 500;

    await prisma.user.update({
        where: { id: user.id },
        data: { balance: newBalance }
    });

    return { success: true, newBalance };
});

// Запуск сервера
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