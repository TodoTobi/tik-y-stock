# Historial de Auditorías

## Auditoría #01 — 2026-06-30

**Auditor**: FAANG Principal Engineer  
**Veredicto**: [APROBADO CON CONDICIONES]  
**Archivo completo**: Ver conversación original (primer mensaje de auditoría)

### Resumen
- **Hallazgos identificados**: 13
- **Resueltos en corrección inicial**: 6
- **Pendientes post-corrección**: 7 (migrados a hallazgos de la Auditoría #02 por estar vinculados)

### Hallazgos resueltos en la corrección

| ID Original | Descripción | Archivo corregido |
|---|---|---|
| H01 | CDN contradiction (02-arquitectura.md:111) | `02-arquitectura.md` |
| H02 | Devolución transaction sin alert resolution | `04-base-de-datos.md` |
| H03 | Devolución ownership validation ausente | `03b-api-reference.md` |
| H04 | Tabla `alertas` como dead schema | `04-base-de-datos.md` |
| H05 | Seed email typo (almuno → alumno) | `07-despliegue.md` |
| H06 | Secure cookie sin discusión HTTP vs HTTPS | `06-seguridad.md` |

### Hallazgos que requirieron cambios estructurales (ejecutados)

| ID Original | Descripción | Acción tomada | Evidencia |
|---|---|---|---|
| H07 | Scope creep (dashboard, institucional, etiquetas, contador) | BACKLOG_FUTURO.md creado; `05-plan-desarrollo.md` recortado | `BACKLOG_FUTURO.md`, `docs/05-plan-desarrollo.md` |
| H08 | models/ ambiguity | Reemplazado por `services/movimiento.service.js` | `02-arquitectura.md` |
| H09 | Infraestructura faltante (.gitignore, .env.example, tests) | Archivos creados | `.gitignore`, `.env.example`, `docs/08-test-plan.md` |
| H10 | Sin testing | `08-test-plan.md` creado con 15+ tests | `docs/08-test-plan.md` |
| H11 | Sin vendor local html5-qrcode | Documentado en `05-plan-desarrollo.md` Día 1 paso 1 | `docs/05-plan-desarrollo.md` |
| H12 | Filename numbering conflicts (03-*, 04-*) | Renombrados a 03b-* y 04b-* | `03b-api-reference.md`, `04b-frontend-estructura.md` |
| H13 | Sin middleware de error global desde Día 1 | Plan corregido: middleware de error en Día 1, no Día 3 | `docs/05-plan-desarrollo.md` |

---

## Auditoría #02 — 2026-06-30

**Auditor**: FAANG Principal Engineer  
**Veredicto**: [APROBADO CON CONDICIONES] — RECHAZADO PARCIALMENTE  
**Archivo completo**: Ver conversación (segundo mensaje de auditoría)

### Resumen
- **Hallazgos identificados**: 21 (+ 4 estructurales)
- **Resueltos**: 24
- **Cancelados**: 1 (H2-S4: sesiones en memoria, aceptado para PMV)
- **Pendientes**: 0

### Causa raíz de los hallazgos

**Falla de propagación sistémica**: El recorte de alcance (dashboard/F9, institucional/F10, etiquetas, contador) se aplicó correctamente en `05-plan-desarrollo.md` y `BACKLOG_FUTURO.md`, pero 8 documentos adicionales no fueron actualizados y aún referencian estas features como incluidas.

### Hallazgos por archivo

| ID | Archivo | Línea(s) | Descripción | Severidad |
|---|---|---|---|---|
| H2-01 | `01-stack-tecnologico.md` | 30 | html5-qrcode dice "vía CDN" debe decir "local /public/vendor/" | ALTA |
| H2-02 | `01-stack-tecnologico.md` | 31 | `qrcode` (npm) listado pero feature etiquetas está en backlog | MEDIA |
| H2-03 | `02-arquitectura.md` | 20-21 | Diagrama 3 capas dice "models/" debe decir "services/" | MEDIA |
| H2-04 | `02-arquitectura.md` | 69, 75 | `dashboard.routes.js` y `dashboard.controller.js` listados (en backlog) | ALTA |
| H2-05 | `02-arquitectura.md` | 88, 90 | `institucional.html` y `dashboard.html` listados (en backlog) | ALTA |
| H2-06 | `02-arquitectura.md` | 100 | `scripts/generar-etiquetas.js` listado (en backlog) | MEDIA |
| H2-07 | `03-requisitos.md` | 19 | F9 Dashboard dice "✅ Incluido" debe decir "❌ Excluido" | **CRÍTICO** |
| H2-08 | `03-requisitos.md` | 31 | RF-01: "admin → dashboard" debe decir "admin → movimientos" | ALTA |
| H2-09 | `03-requisitos.md` | 65-67 | RF-07 (Dashboard) con criterio de aceptación debe eliminarse | ALTA |
| H2-10 | `03-requisitos.md` | 92, 111 | RNF-04 dice "modelos" debe decir "services"; permisos superusuario dice "dashboard" y "gestionar usuarios" | MEDIA |
| H2-11 | `03b-api-reference.md` | 23 | Login redirect: `/admin/dashboard.html` debe ser `/admin/movimientos.html` | ALTA |
| H2-12 | `03b-api-reference.md` | 131-148 | Sección Dashboard completa con endpoint `/api/dashboard/resumen` — eliminar | ALTA |
| H2-13 | `04-base-de-datos.md` | 12-33 | ER diagrama muestra tabla `alertas` que no existe | ALTA |
| H2-14 | `04b-frontend-estructura.md` | 16 | Mapa navegación: superusuario → `/admin/dashboard.html` debe ser movimientos | ALTA |
| H2-15 | `04b-frontend-estructura.md` | 112-114 | Referencia a `admin-dashboard.js` y `GET /api/dashboard/resumen` | ALTA |
| H2-16 | `04b-frontend-estructura.md` | 120 | Dice "El dashboard debe mostrar números reales" — eliminar | MEDIA |
| H2-17 | `06-seguridad.md` | 39 | Permisos superusuario listan "dashboard" | MEDIA |
| H2-18 | `06-seguridad.md` | 62 | Ruta `GET /api/dashboard/*` listada como protegida | MEDIA |
| H2-19 | `07-despliegue.md` | 132-133 | Guion demo paso 4: "dashboard: movimiento reflejado" debe ser "movimientos" | BAJA |
| H2-20 | `08-test-plan.md` | 66 | Test: "GET dashboard como usuario → 403" — endpoint no existe | MEDIA |
| H2-21 | `04b-frontend-estructura.md` | 36 vs 120 | Contradicción interna: sidebar dice "Redirige a Movimientos" pero UX dice "El dashboard debe mostrar números" | ALTA |

### Problemas estructurales detectados

| ID | Descripción | Impacto |
|---|---|---|
| H2-S1 | Sin script de validación cross-doc que detecte referencias obsoletas automáticamente | Alto — riesgo de recurrencia |
| H2-S2 | Sin timeboxes definidos en tareas del Día 1 | Alto — schedule overflow |
| H2-S3 | Sin prueba de concurrencia para RNF-01 (10 usuarios) | Medio — RNF no certificable |
| H2-S4 | express-session en memoria sin store persistente | Bajo — aceptado para PMV |
