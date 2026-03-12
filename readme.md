<div align="center">
  <img src="public/banner.png" alt="Anime Casino Banner" width="100%" />

  <h1>🎰 Anime Casino MVP</h1>
  <p>Мінімально життєздатний продукт (MVP) симулятора ігрового автомата з кастомним генератором випадкових чисел.</p>

  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
</div>

<br>

## Про проект
Цей проект розроблено як навчальний симулятор казино з клієнт-серверною архітектурою. Особливість проекту - відмова від важких фреймворків на фронтенді на користь чистого DOM-маніпулювання та використання швидкого сучасного бекенду.

## Головні фічі
- 🎲 **Чесна математика:** Використовується алгоритм ГВЧ на базі генераторів для прокрутки слотів.
- 💰 **Система балансу:** Відстеження поточного рахунку гравця, який зберігається в пам'яті сервера [безстанова архітектура].
- 🎁 **Система "Додепу":** Інтерактивна можливість отримати безкоштовні монети (+500) для продовження гри.
- ⚡ **Швидкий бекенд:** Серверну частину побудовано на сучасному фреймворку **Fastify**.
- 🎨 **Кастомний UI:** Анімації слотів, панель швидких ставок (+25, +50, +75) та діалогове вікно з персонажем.

## Як запустити локально

1. **Клонуй репозиторій:**
`git clone https://github.com/spanoproandrei2245-bit/anime-casino`

2. **Перейди в папку з проектом:**
`cd anime-casino`

3. **Встанови залежності:**
`npm install`

4. **Запусти сервер у режимі розробки:**
`npm run dev`

5. Відкрий браузер за адресою http://localhost:3000

## Структура проекту
- `public/` - Фронтенд (HTML, CSS, JS) та арт персонажа (`anime.png`)
- `src/` - Бекенд на TypeScript (Fastify сервер, API-маршрути)
- `package.json` - Залежності та скрипти проекту

## 👨‍💻 Автор
**Андрій Спано**  
*Студент ФІОТ, група ІМ-52*