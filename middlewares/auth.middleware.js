export function requireAuth(req, res, next) {
  if (!req.session.usuario) {
    return res.status(401).json({ success: false, message: 'No autenticado' });
  }
  next();
}
