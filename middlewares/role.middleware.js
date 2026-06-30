export function requireRole(rol) {
  return (req, res, next) => {
    if (!req.session.usuario || req.session.usuario.rol !== rol) {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }
    next();
  };
}
