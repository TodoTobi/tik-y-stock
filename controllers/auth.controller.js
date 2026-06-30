import bcrypt from 'bcrypt';
import pool from '../config/db.js';

export async function registro(req, res, next) {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Nombre, email y contraseña (min 6 caracteres) requeridos' });
    }
    const [existing] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'El email ya está registrado' });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, password_hash, 'usuario']
    );
    res.status(201).json({ success: true, message: 'Usuario registrado', data: { id: result.insertId } });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email y contraseña requeridos' });
    }
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
    const usuario = rows[0];
    const match = await bcrypt.compare(password, usuario.password_hash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
    req.session.usuario = { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol };
    res.json({ success: true, message: 'Login exitoso', data: { nombre: usuario.nombre, rol: usuario.rol } });
  } catch (err) {
    next(err);
  }
}

export function logout(req, res) {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
    res.json({ success: true, message: 'Sesión cerrada' });
  });
}

export function me(req, res) {
  if (!req.session.usuario) {
    return res.status(401).json({ success: false, message: 'No autenticado' });
  }
  res.json({ success: true, data: req.session.usuario });
}
