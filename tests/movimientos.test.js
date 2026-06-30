import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

const mod = await import('../server.js');
const app = mod.default;

describe('Movimientos', () => {
  let user1Agent;
  let user2Agent;
  let superAgent;
  let itemId;

  before(async () => {
    await request(app)
      .post('/api/auth/registro')
      .send({ nombre: 'Super Mov', email: 'super-mov@test.com', password: '123456' });
    const { default: pool } = await import('../config/db.js');
    await pool.query("UPDATE usuarios SET rol = 'superusuario' WHERE email = 'super-mov@test.com'");
    superAgent = request.agent(app);
    await superAgent.post('/api/auth/login').send({ email: 'super-mov@test.com', password: '123456' });

    await request(app)
      .post('/api/auth/registro')
      .send({ nombre: 'User1 Mov', email: 'user1-mov@test.com', password: '123456' });
    user1Agent = request.agent(app);
    await user1Agent.post('/api/auth/login').send({ email: 'user1-mov@test.com', password: '123456' });

    await request(app)
      .post('/api/auth/registro')
      .send({ nombre: 'User2 Mov', email: 'user2-mov@test.com', password: '123456' });
    user2Agent = request.agent(app);
    await user2Agent.post('/api/auth/login').send({ email: 'user2-mov@test.com', password: '123456' });

    const itemRes = await superAgent.post('/api/items').send({
      nombre: 'Item Mov', categoria: 'Test', cantidad: 5, codigo_escaneable: 'MOV-TST'
    });
    itemId = itemRes.body.data.id;
  });

  it('Retiro exitoso - 201', async () => {
    const res = await user1Agent.post('/api/movimientos/retiro').send({ id_item: itemId });
    assert.equal(res.status, 201);
  });

  it('Retiro sin stock - 400', async () => {
    for (let i = 0; i < 4; i++) {
      await user1Agent.post('/api/movimientos/retiro').send({ id_item: itemId });
    }
    const res = await user1Agent.post('/api/movimientos/retiro').send({ id_item: itemId });
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
  });

  it('Devolución exitosa - 200', async () => {
    const prestamos = await user1Agent.get('/api/movimientos/mis-prestamos');
    if (prestamos.body.data.length > 0) {
      const res = await user1Agent.post('/api/movimientos/devolucion').send({ id_movimiento: prestamos.body.data[0].id });
      assert.equal(res.status, 200);
    }
  });

  it('Devolución de otro usuario - 400', async () => {
    const prestamos = await user1Agent.get('/api/movimientos/mis-prestamos');
    if (prestamos.body.data.length > 0) {
      const res = await user2Agent.post('/api/movimientos/devolucion').send({ id_movimiento: prestamos.body.data[0].id });
      assert.ok(res.status === 400 || res.status === 403);
      assert.equal(res.body.success, false);
    }
  });

  it('GET /api/movimientos como superusuario - 200', async () => {
    const res = await superAgent.get('/api/movimientos');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data));
  });

  it('GET /api/movimientos/mis-prestamos - 200', async () => {
    const res = await user1Agent.get('/api/movimientos/mis-prestamos');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data));
  });
});
