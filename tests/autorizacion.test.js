import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

const mod = await import('../server.js');
const app = mod.default;

describe('Autorización', () => {
  let agent;
  let superAgente;

  before(async () => {
    await request(app)
      .post('/api/auth/registro')
      .send({ nombre: 'User', email: 'user@test.com', password: '123456' });
    await request(app)
      .post('/api/auth/registro')
      .send({ nombre: 'Admin', email: 'admin@test.com', password: '123456' });
    const { default: pool } = await import('../config/db.js');
    await pool.query("UPDATE usuarios SET rol = 'superusuario' WHERE email = 'admin@test.com'");

    superAgente = request.agent(app);
    await superAgente.post('/api/auth/login').send({ email: 'admin@test.com', password: '123456' });

    agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email: 'user@test.com', password: '123456' });
  });

  it('POST /api/items como usuario - 403', async () => {
    const res = await agent.post('/api/items').send({ nombre: 'Test', categoria: 'X', codigo_escaneable: 'X' });
    assert.equal(res.status, 403);
  });

  it('PUT /api/items/:id como usuario - 403', async () => {
    const res = await agent.put('/api/items/1').send({ nombre: 'X' });
    assert.equal(res.status, 403);
  });

  it('DELETE /api/items/:id como usuario - 403', async () => {
    const res = await agent.delete('/api/items/1');
    assert.equal(res.status, 403);
  });

  it('GET /api/movimientos como usuario - 403', async () => {
    const res = await agent.get('/api/movimientos');
    assert.equal(res.status, 403);
  });

  it('GET /api/alertas como usuario - 403', async () => {
    const res = await agent.get('/api/alertas');
    assert.equal(res.status, 403);
  });

  it('POST /api/items como superusuario - 201', async () => {
    const res = await superAgente.post('/api/items').send({
      nombre: 'Kit Arduino', categoria: 'Electrónica', cantidad: 5, codigo_escaneable: 'KIT-001'
    });
    assert.equal(res.status, 201);
  });
});
