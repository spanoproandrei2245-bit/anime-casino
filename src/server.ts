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

