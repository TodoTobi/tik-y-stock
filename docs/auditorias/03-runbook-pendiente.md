# Runbook de Acciones Pendientes

> Acciones priorizadas para resolver los hallazgos activos de la Auditoría #02.
> Marcar con `[x]` cuando se complete cada acción.

---

## 🔴 PRIORIDAD 1 — Corrección de propagación (14 hallazgos)

> **Impacto**: Si no se corrigen, el equipo desarrollará código contra documentos obsoletos.

### Acción A: Actualizar `03-requisitos.md` (3 hallazgos: H2-07, H2-08, H2-09, H2-10)

- [x] **H2-07**: Línea 19: cambiar F9 Dashboard de "✅ Incluido" a "❌ Excluido (ver BACKLOG_FUTURO)"
- [x] **H2-08**: Línea 31: cambiar "admin → dashboard" a "admin → movimientos.html"
- [x] **H2-09**: Líneas 65-67: eliminar RF-07 (Dashboard) completo
- [x] **H2-10**: Línea 92: cambiar "modelos" por "services"; Línea 111: eliminar "dashboard" y "gestionar usuarios" de permisos superusuario

### Acción B: Actualizar `03b-api-reference.md` (2 hallazgos: H2-11, H2-12)

- [x] **H2-11**: Línea 23: cambiar redirect de `/admin/dashboard.html` a `/admin/movimientos.html`
- [x] **H2-12**: Líneas 131-148: eliminar sección Dashboard completa

### Acción C: Actualizar `02-arquitectura.md` (4 hallazgos: H2-03, H2-04, H2-05, H2-06)

- [x] **H2-03**: Líneas 20-21: cambiar diagrama "models/" por "services/"
- [x] **H2-04**: Líneas 69, 75: eliminar `dashboard.routes.js` y `dashboard.controller.js`
- [x] **H2-05**: Líneas 88, 90: eliminar `institucional.html` y `dashboard.html`
- [x] **H2-06**: Línea 100: eliminar `scripts/generar-etiquetas.js`

### Acción D: Actualizar `04-base-de-datos.md` (1 hallazgo: H2-13)

- [x] **H2-13**: Líneas 12-33: eliminar tabla `alertas` del diagrama ER

### Acción E: Actualizar `04b-frontend-estructura.md` (4 hallazgos: H2-14, H2-15, H2-16, H2-21)

- [x] **H2-14**: Línea 16: cambiar mapa navegación a `/admin/movimientos.html`
- [x] **H2-15**: Líneas 112-114: eliminar referencia a `admin-dashboard.js` y endpoint dashboard
- [x] **H2-16**: Línea 120: eliminar "El dashboard debe mostrar números reales"
- [x] **H2-21**: Líneas 36 vs 120: resolver contradicción interna (consistente con las 3 correcciones anteriores)

### Acción F: Actualizar `01-stack-tecnologico.md` (2 hallazgos: H2-01, H2-02)

- [x] **H2-01**: Línea 30: cambiar "vía CDN" por "archivo local en /public/vendor/"
- [x] **H2-02**: Línea 31: eliminar `qrcode` (npm) del stack del PMV

### Acción G: Actualizar `06-seguridad.md` (2 hallazgos: H2-17, H2-18)

- [x] **H2-17**: Línea 39: eliminar "dashboard" de permisos superusuario
- [x] **H2-18**: Línea 62: eliminar ruta `GET /api/dashboard/*`

### Acción H: Actualizar `07-despliegue.md` (1 hallazgo: H2-19)

- [x] **H2-19**: Líneas 132-133: cambiar "dashboard: movimiento reflejado" por "Movimientos: historial reflejado"

### Acción I: Actualizar `08-test-plan.md` (1 hallazgo: H2-20)

- [x] **H2-20**: Línea 66: eliminar test de GET /api/dashboard/resumen

---

## 🟡 PRIORIDAD 2 — Mejoras estructurales (3 hallazgos: H2-S1, H2-S2, H2-S3)

### Acción J: Crear script de validación cross-doc (H2-S1)

- [x] Crear `scripts/validate-docs.js` que busque términos prohibidos (dashboard, institucional, generar-etiquetas, contador)
- [x] Integrar en `package.json` como `"validate": "node scripts/validate-docs.js"`
- [x] Agregar al checkpoint del Día 1: ejecutar `npm run validate` antes de `npm test`
- [x] Verificar: `node scripts/validate-docs.js` pasa sin errores

### Acción K: Agregar timeboxes al Día 1 (H2-S2)

- [x] Editar `05-plan-desarrollo.md` Día 1: agregar columna Timebox a cada tarea
- [x] Documentar mecanismo de `DEUDA_TECNICA.md` para tareas que excedan timebox
- [x] Asignar timeboxes:

| Tarea | Timebox |
|---|---|
| Setup del entorno | 30 min |
| Esqueleto server.js | 30 min |
| schema.sql + db.js | 45 min |
| Servicio transaccional | 45 min |
| Auth (middlewares + controller + routes) | 90 min |
| Pantallas login/registro | 60 min |
| CRUD items (controller + routes + multer) | 90 min |
| Pantalla inventario admin | 90 min |
| Tests (setup + auth + autorización) | 60 min |

### Acción L: Agregar test de concurrencia para RNF-01 (H2-S3)

- [x] En `tests/movimientos.test.js` (plan), agregar test que ejecute 10 retiros concurrentes sobre el mismo ítem con `Promise.all`
- [x] Verificar: cantidad final correcta, sin errores 500, tiempo promedio < 500ms

---

## ⚪ PRIORIDAD 3 — Bajo impacto (1 hallazgo: H2-S4)

### H2-S4: Sesiones en memoria sin store persistente

- [x] **Decisión**: Aceptado para PMV. Las sesiones se pierden al reiniciar el servidor. Para la demo esto es aceptable. Si se requiere persistencia post-PMV, migrar a `express-mysql-session`.

---

## Resumen de progreso

- [x] **24/24** hallazgos pendientes resueltos ✅
- [x] **12/12** acciones de prioridad 1 completadas ✅
- [x] **3/3** acciones de prioridad 2 completadas ✅
