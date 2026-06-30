import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { retiro, devolucion, listarMovimientos, misPrestamos } from '../controllers/movimientos.controller.js';

const router = Router();

router.post('/retiro', requireAuth, retiro);
router.post('/devolucion', requireAuth, devolucion);
router.get('/', requireAuth, requireRole('superusuario'), listarMovimientos);
router.get('/mis-prestamos', requireAuth, misPrestamos);

export default router;
