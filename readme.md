<div align="center">

# 🎰 Anime Casino

Повноцінний симулятор онлайн-казино з клієнт-серверною архітектурою, базою даних та безпечною авторизацією

---

## 👨‍💻 Автор

[Спано Андрій Олександрович](https://github.com/spanoproandrei2245-bit)
Студент ФІОТ, група ІМ-52

## Frontend

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

<br>

## Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

<br>

## Database & Tools

![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Bcrypt](https://img.shields.io/badge/Bcrypt-4A4A55?style=for-the-badge&logo=securityscorecard&logoColor=white)

</div>

# 🎓 Інтеграція лабораторних робіт

У проекті успішно імплементовано та пов'язано між собою теми з лабораторних робіт курсу:

1. **Асинхронне програмування**  
   Кастомні функції `asyncMapCallback` та `asyncMapPromise` (`src/asyncTasks.ts`) для паралельної обробки даних.

2. **Структури даних**  
   Реалізовано клас `PriorityQueue` (`src/queue.ts`) для черги обробки тікетів техпідтримки за пріоритетом.

3. **Декоратори**  
   Створено декоратор `@Log` (`src/logger.ts`, `src/engine.ts`), який логує час виконання методів та їх аргументи (наприклад, при розрахунку виграшу в рушії гри).

4. **Патерн кешування (мемоізація)**  
   Написана функція `memoizeWithTimeout` (`src/utils.ts`) для оптимізації та кешування результатів запиту ТОП-10 гравців бази даних.

5. **Генератори (Generators)**  
   Використовується функція `createInfiniteReel` (`src/server.ts`) для безкінечної генерації символів під час гри в слоти.

6. **Потоки (Streams)**  
   Метод `generateDataStream` (`src/server.ts`) дозволяє завантажувати таблицю лідерів у форматі `.csv` за допомогою потокової передачі даних (`Readable stream`).

7. **Події (EventEmitter)**  
   Створено `casinoEvents` (`src/server.ts`) для асинхронного відстеження та логування глобальних подій (наприклад, зрив джекпоту або депозит).

# 🛠 Стек технологій

## Frontend
- HTML5
- CSS3
- TypeScript
- Vanilla JavaScript

## Backend
- Node.js
- Fastify
- TypeScript

## Database
- SQLite
- Prisma ORM

---

# 🚀 Як запустити локально

## 1. Підготовка

Мають бути встановлені:
- Node.js
- Git

---

## 2. Встановлення

Клонуй репозиторій:

```bash
git clone https://github.com/spanoproandrei2245-bit/anime-casino.git
cd anime-casino
```

Встанови залежності:

```bash
npm install
```

--- 

## 3. Налаштування бази даних та фронтенду

Згенеруй SQLite базу даних:

```bash
npx prisma db push
```

Скомпілюй TypeScript фронтенду:

```bash
npm run build:front
```

---

## 4. Запуск сервера

Запуск у режимі розробки:

```bash
npm run dev
```

Після запуску відкрий:

```bash
http://localhost:3000
```

---

## 📁 Структура проекту

```bash
public/      — Статичні файли фронтенду
public/ts/   — TypeScript логіка клієнта
src/         — Backend, сервер, ігрова логіка
prisma/      — Prisma schema
```
