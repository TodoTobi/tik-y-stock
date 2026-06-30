# Plan de Desarrollo — TIC & Stock (Sprint 3 Días)

> PMV para la muestra escolar. Versión auditada y corregida post-auditoría.

---

## Resumen de Features por Día

| Día | Features | Producto entregable |
|---|---|---|
| **Día 1** | F1 (BD) + F2 (Auth) + F3 (CRUD) + infraestructura | API funcionando + login/registro + gestionar ítems + tests |
| **Día 2** | F4 (Catálogo) + F5 (Movimientos) + F6 (Escaneo) | Alumno puede retirar/devolver escaneando QR |
| **Día 3** | Pulido + Seed + Deploy + Ensayo demo | Sistema funcional con datos reales en red local |

## Features EXCLUIDAS de los 3 días

| Feature | Destino |
|---|---|
| **F9 — Dashboard** | `BACKLOG_FUTURO.md` (redirigir /admin a /admin/movimientos.html) |
| **F10 — Página institucional** | `BACKLOG_FUTURO.md` |
| **generar-etiquetas.js** | `BACKLOG_FUTURO.md` (mostrar QR en pantalla para la demo) |
| **GET /api/alertas/contador** | Eliminado. Calcular badge con `alertas.length` en frontend |
| **Tabla `alertas` en BD** | Eliminada del schema. Alertas calculadas al vuelo por query SQL |
| **Carpeta `models/`** | Reemplazada por `services/movimiento.service.js` (Transaction Script) |

---

## DÍA 1 — Base de Datos, Autenticación, CRUD e Infraestructura

### Tareas (con timeboxes)

| # | Tarea | Timebox | Acumulado |
|---|---|---|---|
| 1 | **Setup del entorno** (manual, antes de opencode): npm init, instalar dependencias, crear BD, .env, .gitignore, scripts package.json, descargar vendor | 30 min | 30 min |
| 2 | **Esqueleto del proyecto**: estructura carpetas, server.js con dotenv/estáticos/session/logging/error middleware, escuchar en 0.0.0.0 | 30 min | 1h |
| 3 | **Base de datos**: database/schema.sql (usuarios, items, movimientos), config/db.js pool mysql2 | 45 min | 1h 45min |
| 4 | **Servicio transaccional**: services/movimiento.service.js con retiroItem + devolucionItem (Transaction Script) | 45 min | 2h 30min |
| 5 | **Autenticación**: middlewares (auth + role), controller (registro, login, logout, me), routes, conectar en server.js | 90 min | 4h |
| 6 | **Pantallas login/registro**: login.html + registro.html + auth.css + auth.js | 60 min | 5h |
| 7 | **CRUD inventario**: items.controller.js + routes, GET/POST/PUT/DELETE, multer con validación | 90 min | 6h 30min |
| 8 | **Pantalla gestión admin**: inventario.html + admin-inventario.js (tabla, filtros, modal, foto) | 90 min | 8h |
| 9 | **Tests**: tests/setup.js + auth.test.js + autorizacion.test.js | 60 min | 9h |

> ⚠️ **Mecanismo de timebox**: Si al cumplirse el timebox de una tarea no está completa, documentar el progreso en `DEUDA_TECNICA.md` y pasar a la siguiente. No se permite que una tarea consuma el tiempo de las demás.

### Detalle de cada tarea

1. **Setup del entorno** (manual, antes de opencode)
   - `npm init -y`
   - Instalar: express, mysql2, express-session, bcrypt, multer, dotenv
   - Instalar dev: nodemon, supertest
   - Crear base de datos `tic_stock` en MySQL
   - Crear archivo `.env` (copiar de `.env.example`)
   - Crear `.gitignore` con `node_modules/`, `.env`, `public/uploads/`
   - Agregar scripts en `package.json`:
     ```json
     "scripts": {
       "dev": "nodemon server.js",
       "start": "node server.js",
       "test": "node --test tests/*.test.js",
       "validate": "node scripts/validate-docs.js"
     }
     ```
   - Descargar html5-qrcode a local:
     ```bash
     mkdir -p public/vendor
     curl -o public/vendor/html5-qrcode.min.js https://unpkg.com/html5-qrcode
     ```

2. **Esqueleto del proyecto**
   - Crear estructura de carpetas
   - `server.js` con: dotenv, estáticos, session, logging, rutas vacías
   - Escuchar en `0.0.0.0` para acceso desde la red
   - **Middleware de error global desde el Día 1** (no postergar al Día 3)

3. **Base de datos**
   - `database/schema.sql` con tablas `usuarios`, `items`, `movimientos` (sin tabla `alertas`)
   - `config/db.js` con pool de conexiones mysql2/promise
   - Ejecutar schema en MySQL

4. **Servicio transaccional**
   - `services/movimiento.service.js` con Transaction Script:
     - `retiroItem(connection, id_item, id_usuario, codigo_escaneado)`
     - `devolucionItem(connection, id_movimiento, id_usuario)` — con ownership check
   - Ambos métodos reciben conexión del pool, ejecutan `beginTransaction/commit/rollback`

5. **Autenticación**
   - `middlewares/auth.middleware.js` → requireAuth
   - `middlewares/role.middleware.js` → requireRole
   - `controllers/auth.controller.js` → registro, login, logout, me
   - `routes/auth.routes.js`
   - Conectar en server.js bajo `/api/auth`

6. **Pantallas de login/registro**
   - `public/login.html` + `public/registro.html`
   - `public/css/auth.css` (paleta industrial)
   - `public/js/auth.js` (fetch, redirección por rol)

7. **CRUD de inventario**
   - `controllers/items.controller.js` + `routes/items.routes.js`
   - GET /api/items (con filtros), GET /:id, POST, PUT, DELETE
   - Multer para fotos, validación 3MB, solo jpg/png/webp
   - Protegido: POST/PUT/DELETE solo superusuario

8. **Pantalla de gestión admin**
   - `public/admin/inventario.html` + `public/js/admin-inventario.js`
   - Tabla con todos los items, filtros, modal de nuevo/editar, confirmación de borrado

### Checkpoint Día 1
- ✅ `npm run validate` pasa (sin referencias obsoletas en docs)
- ✅ `npm test` pasa (tests de auth + autorización)
- ✅ Registro y login funcionan
- ✅ Admin puede crear/editar/eliminar/filtrar ítems con foto
- ✅ html5-qrcode servido desde `/public/vendor/` (funciona sin internet)
- ✅ `.gitignore`, `.env.example`, scripts de package.json creados, `DEUDA_TECNICA.md` iniciado

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
   - POST /api/movimientos/retiro → delega en `movimiento.service.js`
   - POST /api/movimientos/devolucion → delega en `movimiento.service.js` (con ownership check)
   - GET /api/movimientos (historial completo, solo superusuario)
   - GET /api/movimientos/mis-prestamos (usuario actual)

3. **Pantallas de movimientos**
   - `public/admin/movimientos.html` — historial con filtros + registro manual
   - `public/usuario/prestamos.html` — "mis préstamos activos" con botón devolver

4. **Módulo de escaneo** (F6)
   - `public/usuario/escaneo.html` + `public/js/usuario-escaneo.js`
   - html5-qrcode desde `/public/vendor/html5-qrcode.min.js` (fallback local, no CDN)
   - Activa cámara, detecta QR/barras
   - Al detectar: muestra ítem, botones "Confirmar retiro/devolución"
   - Feedback visual inmediato (verde/rojo)
   - Input manual de código como fallback (autofocus + detección de Enter)

### Checkpoint Día 2
- ✅ `npm test` pasa (tests de movimientos transaccionales)
- ✅ Alumno escanea QR → ve ítem → confirma retiro
- ✅ El cambio se refleja en catálogo y en "mis préstamos"
- ✅ Se puede devolver desde escaneo o desde préstamos
- ✅ Admin ve historial completo con filtros
- ✅ Escaneo funciona sin internet (vendor local)

---

## DÍA 3 — Alertas, Pulido, Seed y Preparación de la Demo

### Tareas

1. **Sistema de alertas** (F7, simplificado — sin tabla dedicada)
   - `controllers/alertas.controller.js` + `routes/alertas.routes.js`
   - GET /api/alertas → query única: retiros sin devolver > 7 días (con JOIN a items y usuarios)
   - POST /api/alertas/:id/resolver → reusa `devolucionItem` de `movimiento.service.js`
   - Badge de alertas se calcula en frontend como `data.length`

2. **Redirección admin** (reemplazo del dashboard)
   - `server.js`: ruta `GET /admin` redirige a `/admin/movimientos.html`
   - (El dashboard completo F9 queda en BACKLOG_FUTURO.md)

3. **Hardening y pulido**
   - Auditoría de seguridad: verificar `requireRole('superusuario')` en POST/PUT/DELETE /api/items, GET /api/movimientos, GET /api/alertas
   - Favicon + titles descriptivos en cada página
   - Deshabilitar botón de submit durante requests
   - Spinner de carga en fetch en todas las pantallas
   - Responsive básico (login, catálogo, escaneo)

4. **Datos de demo**
   - `database/seed.sql` o `database/seed.js`
   - 5 usuarios (admin, docente, 3 alumnos)
   - 15-20 ítems variados con categorías reales
   - 6-8 movimientos históricos (1-2 retiros viejos sin devolver para alertas)

5. **Deploy y prueba en red local**
   - Probar desde otra máquina en la misma red Wi-Fi
   - Probar escaneo desde celular (vendor local, sin CDN)
   - Ensayar demo 3-5 minutos

### Checkpoint Día 3
- ✅ `npm test` pasa (tests de alertas + autorización)
- ✅ Seed de datos cargado (base no vacía)
- ✅ Sistema corre en IP local, accesible desde otros dispositivos
- ✅ Alertas detecta devoluciones vencidas
- ✅ Guion de demo ensayado

---

## Plan de Contingencia

Si el tiempo se acorta, el orden de recorte es:

1. **No cortar nunca:** F1 (BD) + F2 (Auth) + F3 (CRUD) + F4 (Catálogo)
2. **Cortar primero:** Alertas (F7) — mostrar solo la query sin endpoint dedicado
3. **Degradar:** Escaneo con cámara → solo input manual de código (funcionalidad de negocio intacta)
4. **Excluir siempre:** Todo lo que está en `BACKLOG_FUTURO.md`
