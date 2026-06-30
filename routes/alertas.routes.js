import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { getAlertas, resolverAlerta } from '../controllers/alertas.controller.js';

const router = Router();

router.get('/', requireAuth, requireRole('superusuario'), getAlertas);
router.post('/:id/resolver', requireAuth, requireRole('superusuario'), resolverAlerta);

export default router;
