# Seguridad — TIC & Stock

## Principios

1. **Defensa en profundidad:** Autenticación + Autorización + Validación en cada capa
2. **Mínimo privilegio:** Cada usuario solo accede a lo que necesita según su rol
3. **Validación server-side:** Nunca confiar en validación del frontend

---

## Autenticación

### Registro
- Email único validado en base de datos (UNIQUE)
- Contraseña mínima de 6 caracteres
- Hash con bcrypt, costo 10 (~10 hashes/segundo, suficiente para el volumen del taller)
- Rol por defecto: 'usuario' (nadie se registra como superusuario)

### Login
- Búsqueda por email (parametrizada)
- Comparación con bcrypt.compare
- Sesión almacena: `{ id, nombre, rol }` (nunca la contraseña)
- Cookie de sesión con httpOnly, sameSite, maxAge de 30 min de inactividad
- **⚠️ HTTP vs HTTPS trade-off**: El sistema corre sobre HTTP en la red local. La cookie viaja en texto plano. Esto es aceptable para el alcance del PMV (red cerrada del taller, sin tránsito por internet). No se implementa `secure: true` porque no hay HTTPS. Si en el futuro el sistema se expone fuera de la red local, migrar a HTTPS con mkcert o Let's Encrypt es requisito previo.

### Sesión
- express-session con secret en `.env`
- La sesión expira tras 30 minutos sin actividad
- Al logout: `req.session.destroy()`
- Middleware requireAuth verifica `req.session.usuario`

---

## Autorización

### Roles
| Rol | Acceso |
|---|---|
| `superusuario` | CRUD items, todos los movimientos, alertas |
| `usuario` | Catálogo, escaneo, retiro/devolución, sus préstamos |

### Middleware requireRole
```javascript
function requireRole(rol) {
  return (req, res, next) => {
    if (!req.session.usuario || req.session.usuario.rol !== rol) {
      return res.status(403).json({ success: false, message: "No autorizado" });
    }
    next();
  };
}
```

### Rutas protegidas
| Ruta | Middleware |
|---|---|
| POST /api/items | requireAuth + requireRole('superusuario') |
| PUT /api/items/:id | requireAuth + requireRole('superusuario') |
| DELETE /api/items/:id | requireAuth + requireRole('superusuario') |
| GET /api/movimientos | requireAuth + requireRole('superusuario') |
| GET /api/alertas | requireAuth + requireRole('superusuario') |
| GET /api/alertas/contador | (no existe — contador calculado en frontend) |
| POST /api/movimientos/retiro | requireAuth |
| POST /api/movimientos/devolucion | requireAuth |
| GET /api/movimientos/mis-prestamos | requireAuth |

---

## Inyección SQL

**Todas las consultas** usan placeholders `?` con mysql2. Nunca se concatena input del usuario en strings SQL.

### Incorrecto ❌
```javascript
// VULNERABLE a inyección SQL
const sql = `SELECT * FROM usuarios WHERE email = '${email}'`;
```

### Correcto ✅
```javascript
// SEGURO: consulta parametrizada
const sql = `SELECT * FROM usuarios WHERE email = ?`;
const [rows] = await pool.query(sql, [email]);
```

---

## Transacciones (Consistencia Concurrencia)

Para evitar condiciones de carrera en retiro/devolución:
- Usar `pool.getConnection()` para obtener una conexión dedicada
- `connection.beginTransaction()` antes de operaciones múltiples
- `SELECT ... FOR UPDATE` para bloquear fila durante la transacción
- `connection.commit()` si todo ok, `connection.rollback()` si error
- `connection.release()` en finally

---

## Subida de Archivos (Multer)

- Límite: 3MB por archivo
- Tipos permitidos: solo image/jpeg, image/png, image/webp
- Almacenamiento local en `/public/uploads/items/`
- Nombre de archivo único: `Date.now() + '-' + originalname`
- No se aceptan archivos sin extensión o con extensiones peligrosas

---

## Manejo de Errores

- Middleware global de error en Express captura cualquier excepción no manejada
- Nunca se filtra el stack trace al cliente en producción
- Respuesta consistente: `{ success: false, message: "Error interno del servidor" }`
- Errores específicos para el usuario: "El ítem no tiene unidades disponibles"
- Errores genéricos para fallos internos: no revelar detalles de implementación

---

## Checklist de Seguridad

- [ ] ¿Todas las contraseñas están hasheadas con bcrypt?
- [ ] ¿Todas las consultas SQL usan placeholders `?`?
- [ ] ¿Las rutas de admin están protegidas con requireRole?
- [ ] ¿La sesión expira por inactividad?
- [ ] ¿No se exponen stack traces al cliente?
- [ ] ¿Los tipos de archivo subidos están validados?
- [ ] ¿Hay límite de tamaño para archivos?
- [ ] ¿El secret de sesión está en .env y no hardcodeado?
- [ ] ¿Los botones de submit se deshabilitan durante la request?
