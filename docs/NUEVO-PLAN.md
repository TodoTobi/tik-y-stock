# Nuevo Plan de Ejecución — TIC & Stock

> Post-auditorías + entorno listo. Arrancamos con frontend y features faltantes.

---

## Estado actual (ya completado)

| # | Tarea | Estado |
|---|---|---|
| E1 | Git, package.json, dependencias npm | ✅ |
| E2 | server.js (Express, sesión, estáticos, error middleware, 0.0.0.0) | ✅ |
| E3 | database/schema.sql + DB creada + config/db.js | ✅ |
| E4 | services/movimiento.service.js (Transaction Script) | ✅ |
| E5 | middlewares (requireAuth, requireRole) | ✅ |
| E6 | controllers + routes (auth, items, movimientos, alertas) | ✅ |
| E7 | config/multer.js (subida de fotos) | ✅ |
| E8 | Tests (auth + autorización: 12/12 pasando) | ✅ |
| E9 | html5-qrcode.min.js en public/vendor/ | ✅ |
| E10 | scripts/validate-docs.js + docs auditados | ✅ |

## Lo que falta

### Bloque 1 — Frontend de Autenticación y Gestión

| # | Tarea | Archivos | Depende de |
|---|---|---|---|
| 1.1 | Login + Registro HTML/CSS/JS | `public/login.html`, `public/registro.html`, `public/css/auth.css`, `public/js/auth.js` | — |
| 1.2 | Pantalla admin: inventario (tabla, filtros, modal, foto) | `public/admin/inventario.html`, `public/js/admin-inventario.js` | 1.1 |
| 1.3 | Pantalla admin: movimientos (historial, filtros) | `public/admin/movimientos.html`, `public/js/admin-movimientos.js` | 1.1 |
| 1.4 | Redirección /admin → /admin/movimientos.html | Ya en server.js | — |

### Bloque 2 — Frontend del Alumno

| # | Tarea | Archivos | Depende de |
|---|---|---|---|
| 2.1 | Catálogo alumno (grid, filtros, modal detalle) | `public/usuario/catalogo.html`, `public/js/usuario-catalogo.js` | 1.1 |
| 2.2 | Escaneo QR + input manual | `public/usuario/escaneo.html`, `public/js/usuario-escaneo.js` | 1.1 |
| 2.3 | Mis préstamos activos | `public/usuario/prestamos.html`, `public/js/usuario-prestamos.js` | 1.1 |

### Bloque 3 — Alertas y Seed

| # | Tarea | Archivos | Depende de |
|---|---|---|---|
| 3.1 | Pantalla alertas admin | `public/admin/alertas.html`, `public/js/admin-alertas.js` | 1.1 |
| 3.2 | Seed data (5 usuarios, 15-20 items, movimientos históricos) | `database/seed.sql` | — |
| 3.3 | Tests faltantes (items, movimientos, alertas) | `tests/items.test.js`, `tests/movimientos.test.js` | — |

### Bloque 4 — Pulido y Demo

| # | Tarea | Archivos | Depende de |
|---|---|---|---|
| 4.1 | Favicon, titles, spinners, disabled submits, responsive | Varios HTML/JS | Bloques 1-3 |
| 4.2 | Prueba en red local + ensayo demo | — | Bloques 1-3 |

---

## Flujo de trabajo

1. Por cada tarea: **implementar → correr `npm run validate` → correr `npm test` → commit → push**
2. No pasar a la siguiente sin que la anterior esté commiteada.
3. Si una tarea se complica, documentar en `DEUDA_TECNICA.md` y seguir.
4. Al final del día: el sistema debe poder mostrarse en la muestra escolar.

---

## Scripts disponibles

```bash
npm run dev       # Servidor con nodemon
npm test          # Tests de integración
npm run validate  # Validación cruzada de documentación
```
