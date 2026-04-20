import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './database';

const fastify = Fastify({ logger: true });

const JWT_SECRET = 'super-secret-anime-key-123'; 

fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/',
});

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

const symbols = ['🍒', '💎', '🔔', '7️⃣'];
function* slotGenerator() {
    while (true) {
        yield symbols[Math.floor(Math.random() * symbols.length)];
    }
}
const slots = slotGenerator();

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
