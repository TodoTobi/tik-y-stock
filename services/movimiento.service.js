import pool from '../config/db.js';

async function retiroItem(idItem, idUsuario, codigoEscaneado) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.query(
      'SELECT cantidad FROM items WHERE id = ? FOR UPDATE',
      [idItem]
    );
    if (rows.length === 0) throw new Error('Ítem no encontrado');
    if (rows[0].cantidad <= 0) throw new Error('El ítem no tiene unidades disponibles');
    await connection.query(
      'UPDATE items SET cantidad = cantidad - 1 WHERE id = ?',
      [idItem]
    );
    await connection.query(
      "UPDATE items SET estado = 'en_uso' WHERE id = ? AND cantidad = 0",
      [idItem]
    );
    const [result] = await connection.query(
      `INSERT INTO movimientos (id_item, id_usuario, tipo, codigo_escaneado)
       VALUES (?, ?, 'retiro', ?)`,
      [idItem, idUsuario, codigoEscaneado]
    );
    await connection.commit();
    return { id_movimiento: result.insertId };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

async function devolucionItem(idMovimiento, idUsuario, skipOwnershipCheck = false) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [mov] = await connection.query(
      'SELECT id_item, devuelto, id_usuario FROM movimientos WHERE id = ? FOR UPDATE',
      [idMovimiento]
    );
    if (mov.length === 0) throw new Error('Movimiento no encontrado');
    if (mov[0].devuelto) throw new Error('Este movimiento ya fue devuelto');
    if (!skipOwnershipCheck && mov[0].id_usuario !== idUsuario) throw new Error('No puedes devolver un retiro de otro usuario');
    await connection.query(
      'UPDATE movimientos SET devuelto = TRUE WHERE id = ?',
      [idMovimiento]
    );
    await connection.query(
      'UPDATE items SET cantidad = cantidad + 1 WHERE id = ?',
      [mov[0].id_item]
    );
    await connection.query(
      "UPDATE items SET estado = 'disponible' WHERE id = ? AND estado = 'en_uso' AND cantidad > 0",
      [mov[0].id_item]
    );
    const [result] = await connection.query(
      `INSERT INTO movimientos (id_item, id_usuario, tipo, codigo_escaneado)
       VALUES (?, ?, 'devolucion', NULL)`,
      [mov[0].id_item, idUsuario]
    );
    await connection.commit();
    return { id_movimiento: result.insertId };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

export { retiroItem, devolucionItem };
