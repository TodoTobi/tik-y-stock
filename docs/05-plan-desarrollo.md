# Plan de Desarrollo — TIC & Stock (Sprint 3 Días)

> PMV para la muestra escolar. Ejecutar con opencode + DeepSeek.

---

## Resumen de Features por Día

| Día | Features | Producto entregable |
|---|---|---|
| **Día 1** | F1 (BD) + F2 (Auth) + F3 (CRUD) | API funcionando + login/registro + gestionar ítems |
| **Día 2** | F4 (Catálogo) + F5 (Movimientos) + F6 (Escaneo) | Alumno puede retirar/devolver escaneando QR |
| **Día 3** | F7 (Alertas) + F9 (Dashboard) + Pulido + Deploy | Sistema completo funcional para la demo |

---

## DÍA 1 — Base de Datos, Autenticación y CRUD

### Tareas

1. **Setup del entorno** (manual, antes de opencode)
   - `npm init -y`
   - Instalar: express, mysql2, express-session, bcrypt, multer, dotenv
   - Instalar dev: nodemon
   - Crear base de datos `tic_stock` en MySQL
   - Crear archivo `.env`

2. **Esqueleto del proyecto**
   - Crear estructura de carpetas
   - `server.js` con: dotenv, estáticos, session, logging, rutas vacías
   - Escuchar en `0.0.0.0` para acceso desde la red

3. **Base de datos**
   - `database/schema.sql` con tablas, índices, FK, usuario admin de prueba
   - `config/db.js` con pool de conexiones mysql2/promise
   - Ejecutar schema en MySQL

4. **Autenticación**
   - `middlewares/auth.middleware.js` → requireAuth
   - `middlewares/role.middleware.js` → requireRole
   - `controllers/auth.controller.js` → registro, login, logout, me
   - `routes/auth.routes.js`
   - Conectar en server.js bajo `/api/auth`

5. **Pantallas de login/registro**
   - `public/login.html` + `public/registro.html`
   - `public/css/auth.css` (paleta industrial)
   - `public/js/auth.js` (fetch, redirección por rol)

6. **CRUD de inventario**
   - `controllers/items.controller.js` + `routes/items.routes.js`
   - GET /api/items (con filtros), GET /:id, POST, PUT, DELETE
   - Multer para fotos, validación 3MB, solo jpg/png/webp
   - Protegido: POST/PUT/DELETE solo superusuario

7. **Pantalla de gestión admin**
   - `public/admin/inventario.html` + `public/js/admin-inventario.js`
   - Tabla con todos los items, filtros, modal de nuevo/editar, confirmación de borrado

### Checkpoint Día 1
- ✅ Registro y login funcionan
- ✅ Admin puede crear/editar/eliminar/filtrar ítems con foto
- ✅ Alumno puede loguearse y ver su vista

---

## DÍA 2 — Catálogo, Movimientos y Escaneo

### Tareas

1. **Catálogo del alumno** (F4)
   - `public/usuario/catalogo.html` + `public/js/usuario-catalogo.js`
   - Grid de tarjetas con foto, nombre, badge de estado
   - Filtros: categoría, solo disponibles, búsqueda por nombre
   - Modal de detalle al hacer clic
   - Resumen "X de Y ítems disponibles"

2. **Backend de movimientos** (F5)
   - `controllers/movimientos.controller.js` + `routes/movimientos.routes.js`
   - POST /api/movimientos/retiro (transaccional)
   - POST /api/movimientos/devolucion (transaccional)
   - GET /api/movimientos (historial completo, solo superusuario)
   - GET /api/movimientos/mis-prestamos (usuario actual)

3. **Pantallas de movimientos**
   - `public/admin/movimientos.html` — historial con filtros + registro manual
   - `public/usuario/prestamos.html` — "mis préstamos activos" con botón devolver

4. **Módulo de escaneo** (F6)
   - `public/usuario/escaneo.html` + `public/js/usuario-escaneo.js`
   - html5-qrcode vía CDN, activa cámara, detecta QR/barras
   - Al detectar: muestra ítem, botones "Confirmar retiro/devolución"
   - Feedback visual inmediato (verde/rojo)
   - Input manual de código como fallback
   - `scripts/generar-etiquetas.js` (Node, genera HTML imprimible con QR)

### Checkpoint Día 2
- ✅ Alumno escanea QR → ve ítem → confirma retiro
- ✅ El cambio se refleja en catálogo y en "mis préstamos"
- ✅ Se puede devolver desde escaneo o desde préstamos
- ✅ Admin ve historial completo con filtros

---

## DÍA 3 — Alertas, Dashboard, Pulido y Demo

### Tareas

1. **Sistema de alertas** (F7, simplificado)
   - `controllers/alertas.controller.js` + `routes/alertas.routes.js`
   - GET /api/alertas → calcula al vuelo retiros sin devolver > 7 días
   - POST /api/alertas/:id/resolver → marca como devuelto
   - GET /api/alertas/contador → badge para el sidebar

2. **Dashboard del admin** (F9)
   - `controllers/dashboard.controller.js` + ruta GET /api/dashboard/resumen
   - `public/admin/dashboard.html` + `public/js/admin-dashboard.js`
   - Cards: total items, disponibles, movimientos hoy, alertas
   - Últimas alertas y últimos movimientos

3. **Página institucional** (F10, si sobra tiempo)
   - `public/institucional.html` estática

4. **Hardening y pulido**
   - Middleware de error global en server.js
   - Auditoría de seguridad (requireRole en todas las rutas de admin)
   - Favicon + titles descriptivos
   - Deshabilitar botón de submit durante requests
   - Spinner de carga en fetch
   - Responsive básico (login, catálogo, escaneo)

5. **Datos de demo**
   - `database/seed.sql` o `database/seed.js`
   - Usuarios, 15-20 ítems, 6-8 movimientos históricos
   - 1-2 retiros viejos sin devolver para alertas

6. **Deploy y prueba en red local**
   - Probar desde otra máquina en la misma red Wi-Fi
   - Probar escaneo desde celular (cámara + input manual)
   - Ensayar demo 3-5 minutos

### Checkpoint Día 3
- ✅ Dashboard muestra números reales
- ✅ Alertas detecta devoluciones vencidas
- ✅ Seed de datos cargado (base no vacía)
- ✅ Sistema corre en IP local, accesible desde otros dispositivos
- ✅ Guion de demo ensayado

---

## Plan de Contingencia

Si el tiempo se acorta, el orden de recorte es:

1. **No cortar nunca:** F1 (BD) + F2 (Auth) + F3 (CRUD) + F4 (Catálogo)
2. **Cortar primero:** Dashboard (F9) y Alertas (F7) — el historial de movimientos basta
3. **Degradar:** Escaneo con cámara → solo input manual de código (funcionalidad de negocio intacta)
4. **Excluir siempre:** F8 (Reservas/Compras) — no entra en 3 días
