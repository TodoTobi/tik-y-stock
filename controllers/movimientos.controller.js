import pool from '../config/db.js';
import { retiroItem, devolucionItem } from '../services/movimiento.service.js';

export async function retiro(req, res, next) {
  try {
    const { id_item, codigo_escaneado } = req.body;
    if (!id_item) return res.status(400).json({ success: false, message: 'id_item requerido' });
    const result = await retiroItem(id_item, req.session.usuario.id, codigo_escaneado || null);
    res.status(201).json({ success: true, message: 'Retiro exitoso', data: result });
  } catch (err) {
    if (err.message === 'Ítem no encontrado' || err.message === 'El ítem no tiene unidades disponibles') {
      return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
  }
}

export async function devolucion(req, res, next) {
  try {
    const { id_movimiento } = req.body;
    if (!id_movimiento) return res.status(400).json({ success: false, message: 'id_movimiento requerido' });
    const result = await devolucionItem(id_movimiento, req.session.usuario.id);
    res.json({ success: true, message: 'Devolución exitosa', data: result });
  } catch (err) {
    if (['Movimiento no encontrado', 'Este movimiento ya fue devuelto', 'No puedes devolver un retiro de otro usuario'].includes(err.message)) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
  }
}

export async function listarMovimientos(req, res, next) {
  try {
    let sql = `SELECT m.*, i.nombre as item_nombre, u.nombre as usuario_nombre
               FROM movimientos m
               JOIN items i ON m.id_item = i.id
               JOIN usuarios u ON m.id_usuario = u.id`;
    const params = [];
    const conditions = [];
    if (req.query.tipo) { conditions.push('m.tipo = ?'); params.push(req.query.tipo); }
    if (req.query.id_item) { conditions.push('m.id_item = ?'); params.push(req.query.id_item); }
    if (req.query.id_usuario) { conditions.push('m.id_usuario = ?'); params.push(req.query.id_usuario); }
    if (conditions.length > 0) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY m.fecha_hora DESC LIMIT 500';
    const [rows] = await pool.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

export async function misPrestamos(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT m.*, i.nombre as item_nombre
       FROM movimientos m
       JOIN items i ON m.id_item = i.id
       WHERE m.id_usuario = ? AND m.tipo = 'retiro' AND m.devuelto = FALSE
       ORDER BY m.fecha_hora DESC`,
      [req.session.usuario.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}
