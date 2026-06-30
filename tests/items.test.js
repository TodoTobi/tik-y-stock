import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

const mod = await import('../server.js');
const app = mod.default;

describe('Items CRUD', () => {
  let agent;
  let userAgent;

  before(async () => {
    await request(app)
      .post('/api/auth/registro')
      .send({ nombre: 'Admin Items', email: 'admin-items@test.com', password: '123456' });
    const { default: pool } = await import('../config/db.js');
    await pool.query("UPDATE usuarios SET rol = 'superusuario' WHERE email = 'admin-items@test.com'");
    agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email: 'admin-items@test.com', password: '123456' });

    await request(app)
      .post('/api/auth/registro')
      .send({ nombre: 'User Items', email: 'user-items@test.com', password: '123456' });
    userAgent = request.agent(app);
    await userAgent.post('/api/auth/login').send({ email: 'user-items@test.com', password: '123456' });
  });

  it('GET /api/items sin auth - 401', async () => {
    const res = await request(app).get('/api/items');
    assert.equal(res.status, 401);
  });

  it('GET /api/items como usuario - 200', async () => {
    const res = await userAgent.get('/api/items');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data));
  });

  it('POST /api/items como admin - 201', async () => {
    const res = await agent.post('/api/items').send({
      nombre: 'Item Test', categoria: 'Test', cantidad: 3, codigo_escaneable: 'TST-001'
    });
    assert.equal(res.status, 201);
  });

  it('GET /api/items con filtros', async () => {
    const res = await userAgent.get('/api/items?categoria=Test');
    assert.equal(res.status, 200);
    assert.ok(res.body.data.length > 0);
    assert.equal(res.body.data[0].categoria, 'Test');
  });

  it('DELETE /api/items/:id sin préstamos - 200', async () => {
    const res = await agent.delete('/api/items/2');
    assert.equal(res.status, 200);
  });

  it('DELETE /api/items/:id con préstamo activo - 409', async () => {
    const res = await agent.post('/api/items').send({
      nombre: 'Con Prestamo', categoria: 'Test', cantidad: 1, codigo_escaneable: 'TST-PREST'
    });
    assert.equal(res.status, 201);
    const itemId = res.body.data.id;
    const movRes = await agent.post('/api/movimientos/retiro').send({ id_item: itemId });
    if (movRes.status === 201) {
      const delRes = await agent.delete(`/api/items/${itemId}`);
      assert.equal(delRes.status, 409);
    }
  });
});
