import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';

const fastify = Fastify({ logger: true });

fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/', 
});

const symbols = ['🍒', '💎', '🔔', '7️⃣'];
function* slotGenerator() {
    while (true) {
        yield symbols[Math.floor(Math.random() * symbols.length)];
    }
}
const slots = slotGenerator();

let userBalance = 1000;

fastify.get('/api/balance', async (request, reply) => {
    return { balance: userBalance };
});

fastify.post('/api/deposit', async (request, reply) => {
    userBalance += 500;
    return { newBalance: userBalance };
});

fastify.post('/api/spin', async (request, reply) => {
    const { bet } = request.body as { bet: number };
    const numericBet = Number(bet);

    if (isNaN(numericBet) || numericBet <= 0 || numericBet > userBalance) {
        return reply.status(400).send({ error: 'Некоректна ставка або недостатньо коштів!' });
    }

    userBalance -= numericBet;

    const result = [slots.next().value, slots.next().value, slots.next().value];

    let win = 0;
    if (result[0] === result[1] && result[1] === result[2]) {
        win = numericBet * 10; // Множимо ставку на 10
        userBalance += win;
    }

    return {
        result,
        win,
        newBalance: userBalance
    };
});

// Запуск сервера
const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
        console.log(`[server]: Сервер Fastify успішно запущено на http://localhost:3000`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();