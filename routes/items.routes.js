import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { getItems, getItem, createItem, updateItem, deleteItem } from '../controllers/items.controller.js';
import upload from '../config/multer.js';

const router = Router();

router.get('/', requireAuth, getItems);
router.get('/:id', requireAuth, getItem);
router.post('/', requireAuth, requireRole('superusuario'), upload.single('foto'), createItem);
router.put('/:id', requireAuth, requireRole('superusuario'), upload.single('foto'), updateItem);
router.delete('/:id', requireAuth, requireRole('superusuario'), deleteItem);

export default router;
