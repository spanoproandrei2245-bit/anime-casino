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

    const results = [
        slots.next().value as string,
        slots.next().value as string,
        slots.next().value as string
    ];

    let winAmount = 0;
    if (results[0] === results[1] && results[1] === results[2]) {
        winAmount = numericBet * 10;
    } else if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
        winAmount = numericBet * 2;
    }

    userBalance += winAmount;

    return {
        result: results,
        win: winAmount,
        newBalance: userBalance
    };
});

const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
        console.log('Гамселеться в туз на http://localhost:3000');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();