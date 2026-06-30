import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

const mod = await import('../server.js');
const app = mod.default;

describe('Auth', () => {
  it('POST /api/auth/registro - crear usuario válido', async () => {
    const res = await request(app)
      .post('/api/auth/registro')
      .send({ nombre: 'Test', email: 'test@test.com', password: '123456' });
    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
  });

  it('POST /api/auth/registro - email duplicado', async () => {
    const res = await request(app)
      .post('/api/auth/registro')
      .send({ nombre: 'Test2', email: 'test@test.com', password: '123456' });
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
  });

  it('POST /api/auth/login - credenciales válidas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: '123456' });
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.rol);
  });

  it('POST /api/auth/login - contraseña incorrecta', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'wrong' });
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  it('GET /api/auth/me - autenticado', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email: 'test@test.com', password: '123456' });
    const res = await agent.get('/api/auth/me');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.nombre);
  });

  it('GET /api/auth/me - no autenticado', async () => {
    const res = await request(app).get('/api/auth/me');
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });
});
