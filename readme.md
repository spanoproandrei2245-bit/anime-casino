<div align="center">

# 🎰 Anime Casino
Повноцінний симулятор онлайн-казино з клієнт-серверною архітектурою, базою даних та безпечною авторизацією

👨‍💻 Автор - [Спано Андрій Олександрович](https://github.com/spanoproandrei2245-bit)
Студент ФІОТ, група ІМ-52

---
## Frontend
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
## Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
## Database & Tools
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Bcrypt](https://img.shields.io/badge/Bcrypt-4A4A55?style=for-the-badge&logo=securityscorecard&logoColor=white)
</div>

---

# 💻 Як запустити локально

1. **Підготовка - мають бути встановлені:**
- Node.js
- Git
2. **Встановлення - клонуй репозиторій:**
```bash
git clone https://github.com/spanoproandrei2245-bit/anime-casino.git
cd anime-casino
```
3. **Встанови залежності:**
```bash
npm install
```
4. **Згенеруй SQLite базу даних:**

```bash
npx prisma db push
```

5. **Скомпілюй TypeScript фронтенду:**

```bash
npm run build:front
```

6. **Запуск сервера у режимі розробки:**
```bash
npm run dev
```

7. **Після запуску відкрий:**

```bash
http://localhost:3000
```

---

# 🎓 Інтеграція лабораторних робіт

У проекті успішно імплементовано та пов'язано між собою теми з усіх 9 лабораторних завдань курсу:

1. **Генератори та Ітератори** (Task 1)
   Використовується функція `createInfiniteReel` (`src/server.ts`) для безкінечної генерації символів під час гри в слоти (Round Robin Generator).

2. **Налаштування проекту (Project Setup)** (Task 2)
   Створено Git-репозиторій, налаштовано `.gitignore`, файли конфігурації `package.json` та `tsconfig.json`. Код розділено на логічні модулі (сервер, рушій, утиліти) з правильною архітектурою та імпортами.

3. **Патерн кешування (мемоізація)** (Task 3)
   Написана функція `memoizeWithTimeout` (`src/utils.ts`) для оптимізації та кешування результатів запиту ТОП-10 гравців бази даних із підтримкою Time-Based Expiry.

4. **Структури даних: Priority Queue** (Task 4)
   Реалізовано клас `PriorityQueue` (`src/queue.ts`) для черги обробки тікетів техпідтримки за пріоритетом.

5. **Асинхронні функції масивів** (Task 5)
   Кастомні функції `asyncMapCallback` та `asyncMapPromise` (`src/asyncTasks.ts`) для паралельної обробки даних (наприклад, визначення VIP-статусу) із впровадженням AbortController для скасування запитів.

6. **Потоки даних (Streams)** (Task 6)
   Метод `generateDataStream` (`src/server.ts`) дозволяє поступово читати БД та завантажувати таблицю лідерів у форматі `.csv` за допомогою потокової передачі даних (`Readable stream`), уникаючи переповнення пам'яті.

7. **Події (EventEmitter)** (Task 7)
   Створено реактивний об'єкт `casinoEvents` (`src/server.ts`) для асинхронного відстеження та логування глобальних подій (наприклад, зрив джекпоту або депозит), демонструючи message-based комунікацію.

8. **Authentication Proxy** (Task 8)
   Реалізовано middleware `authProxy` (`src/server.ts`), який перехоплює HTTP-запити до API, валідує JWT-токени та інжектить дані авторизованого користувача в об'єкт запиту.

9. **Декоратор логування** (Task 9)
   Створено декоратор `@Log` (`src/logger.ts`, `src/engine.ts`), який динамічно логує аргументи методів, вимірює час виконання (profiling) та підтримує налаштування рівнів (INFO, ERROR).