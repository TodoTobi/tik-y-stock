import { Router } from 'express';
import { registro, login, logout, me } from '../controllers/auth.controller.js';

const router = Router();

router.post('/registro', registro);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', me);

export default router;
