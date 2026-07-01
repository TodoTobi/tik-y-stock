import express from 'express';
import session from 'express-session';
import 'dotenv/config';

import authRoutes from './routes/auth.routes.js';
import itemsRoutes from './routes/items.routes.js';
import movimientosRoutes from './routes/movimientos.routes.js';
import alertasRoutes from './routes/alertas.routes.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 30 * 60 * 1000,
  },
}));

app.use(express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/movimientos', movimientosRoutes);
app.use('/api/alertas', alertasRoutes);

app.get('/', (req, res) => {
  res.redirect('/login.html');
});

app.get('/admin', (req, res) => {
  res.redirect('/admin/movimientos.html');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Error interno del servidor' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, 'localhost', () => {
    console.log(`TIC & Stock corriendo en http://localhost:${PORT}`);
  });
}

export default app;
