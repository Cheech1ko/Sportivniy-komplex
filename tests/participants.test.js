(в git bash) npm install --save-dev jest supertest
Далее в participants.test.js
const request = require('supertest');
const app = require('../server/index'); // ваш express-приложение
const db = require('../server/db');

describe('Участники', () => {
  beforeAll(async () => {
    // Очистка и подготовка БД
    await db.query('DELETE FROM participants');
    await db.query("INSERT INTO trainings (id, title) VALUES (99, 'Тестовая тренировка')");
  });

  afterAll(async () => {
    await db.query('DELETE FROM participants');
    await db.query('DELETE FROM trainings WHERE id = 99');
    await db.end();
  });

  test('Добавление участника', async () => {
    const response = await request(app)
      .post('/api/participants')
      .send({ name: 'Test User', training_id: 99 });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Участник добавлен!');
  });

  test('Получение участников', async () => {
    const response = await request(app).get('/api/participants/99');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
