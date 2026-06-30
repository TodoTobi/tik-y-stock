import pool from '../config/db.js';
import { unlinkSync } from 'fs';

export async function getItems(req, res, next) {
  try {
    let sql = 'SELECT * FROM items';
    const params = [];
    const { categoria, estado, busqueda } = req.query;
    const conditions = [];
    if (categoria) { conditions.push('categoria = ?'); params.push(categoria); }
    if (estado) { conditions.push('estado = ?'); params.push(estado); }
    if (busqueda) { conditions.push('(nombre LIKE ? OR codigo_escaneable LIKE ?)'); params.push(`%${busqueda}%`, `%${busqueda}%`); }
    if (conditions.length > 0) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY fecha_creacion DESC';
    const [rows] = await pool.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

export async function getItem(req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM items WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Ítem no encontrado' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function createItem(req, res, next) {
  try {
    const { nombre, categoria, cantidad, estado, observaciones, ubicacion, codigo_escaneable } = req.body;
    if (!nombre || !categoria || !codigo_escaneable) {
      return res.status(400).json({ success: false, message: 'Nombre, categoría y código escaneable requeridos' });
    }
    const foto_url = req.file ? '/uploads/items/' + req.file.filename : null;
    const [result] = await pool.query(
      `INSERT INTO items (nombre, categoria, cantidad, estado, observaciones, foto_url, ubicacion, codigo_escaneable)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, categoria, cantidad || 0, estado || 'disponible', observaciones || null, foto_url, ubicacion || null, codigo_escaneable]
    );
    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (err) {
    next(err);
  }
}

export async function updateItem(req, res, next) {
  try {
    const { nombre, categoria, cantidad, estado, observaciones, ubicacion, codigo_escaneable } = req.body;
    const [existing] = await pool.query('SELECT * FROM items WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Ítem no encontrado' });
    const foto_url = req.file ? '/uploads/items/' + req.file.filename : existing[0].foto_url;
    await pool.query(
      `UPDATE items SET nombre = ?, categoria = ?, cantidad = ?, estado = ?, observaciones = ?, foto_url = ?, ubicacion = ?, codigo_escaneable = ?
       WHERE id = ?`,
      [nombre || existing[0].nombre, categoria || existing[0].categoria, cantidad ?? existing[0].cantidad,
       estado || existing[0].estado, observaciones ?? existing[0].observaciones, foto_url,
       ubicacion ?? existing[0].ubicacion, codigo_escaneable || existing[0].codigo_escaneable, req.params.id]
    );
    if (req.file && existing[0].foto_url) {
      const oldPath = 'public' + existing[0].foto_url;
      try { unlinkSync(oldPath); } catch {}
    }
    res.json({ success: true, message: 'Ítem actualizado' });
  } catch (err) {
    next(err);
  }
}

export async function deleteItem(req, res, next) {
  try {
    const [mov] = await pool.query(
      "SELECT id FROM movimientos WHERE id_item = ? AND tipo = 'retiro' AND devuelto = FALSE LIMIT 1",
      [req.params.id]
    );
    if (mov.length > 0) {
      return res.status(409).json({ success: false, message: 'No se puede eliminar: el ítem tiene préstamos activos' });
    }
    const [item] = await pool.query('SELECT foto_url FROM items WHERE id = ?', [req.params.id]);
    if (item.length === 0) return res.status(404).json({ success: false, message: 'Ítem no encontrado' });
    await pool.query('DELETE FROM items WHERE id = ?', [req.params.id]);
    if (item[0].foto_url) {
      try { unlinkSync('public' + item[0].foto_url); } catch {}
    }
    res.json({ success: true, message: 'Ítem eliminado' });
  } catch (err) {
    next(err);
  }
}
