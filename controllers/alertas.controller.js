import pool from '../config/db.js';
import { devolucionItem } from '../services/movimiento.service.js';

export async function getAlertas(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT m.id, m.fecha_hora, m.codigo_escaneado,
              i.nombre as item_nombre, i.codigo_escaneable as item_codigo,
              u.nombre as usuario_nombre, u.email as usuario_email
       FROM movimientos m
       JOIN items i ON m.id_item = i.id
       JOIN usuarios u ON m.id_usuario = u.id
       WHERE m.tipo = 'retiro' AND m.devuelto = FALSE
         AND m.fecha_hora < DATE_SUB(NOW(), INTERVAL 7 DAY)
       ORDER BY m.fecha_hora ASC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

export async function resolverAlerta(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
    const result = await devolucionItem(id, req.session.usuario.id);
    res.json({ success: true, message: 'Alerta resuelta (devolución forzada)', data: result });
  } catch (err) {
    if (['Movimiento no encontrado', 'Este movimiento ya fue devuelto'].includes(err.message)) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
  }
}
