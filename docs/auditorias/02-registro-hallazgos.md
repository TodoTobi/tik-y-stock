# Registro Maestro de Hallazgos

> Archivo viviente. Cada hallazgo tiene un ID único y se actualiza cuando se resuelve.
> Última actualización: 2026-06-30

## Estados

- 🔴 **Pendiente** — No se ha comenzado a trabajar
- 🟡 **En Progreso** — Se está corrigiendo
- 🟢 **Resuelto** — Corregido y verificado
- ⚪ **Cancelado** — Se decidió no corregir (decisión documentada)

---

## Hallazgos de Auditoría #01 (13 hallazgos)

| ID | Descripción | Archivo(s) | Severidad | Estado | Resolución |
|---|---|---|---|---|---|
| ~~H01~~ | CDN contradiction: `02-arquitectura.md:111` dice "sin CDNs" pero stack usa html5-qrcode vía CDN | `02-arquitectura.md` | ALTA | 🟢 Resuelto | Editado a "Dependencias externas mínimas... se sirve con respaldo local" |
| ~~H02~~ | Devolución transaction sin paso de resolver alerta asociada | `04-base-de-datos.md` | MEDIA | 🟢 Resuelto | Agregado step de ownership check + nota de resolución implícita |
| ~~H03~~ | Devolución sin ownership validation en API | `03b-api-reference.md` | ALTA | 🟢 Resuelto | Agregadas validaciones: ownership check + 403 si no coincide |
| ~~H04~~ | Tabla `alertas` como dead schema (creada pero no usada) | `04-base-de-datos.md` | MEDIA | 🟢 Resuelto | Eliminada del schema, reemplazada por query al vuelo |
| ~~H05~~ | Seed email typo: "almuno1" vs "alumno1" | `07-despliegue.md` | BAJA | 🟢 Resuelto | Corregido a alumno1@estudiante.edu |
| ~~H06~~ | Cookie viaja en texto plano sin discusión HTTP vs HTTPS | `06-seguridad.md` | ALTA | 🟢 Resuelto | Agregada sección trade-off con criterio de aceptación |
| ~~H07~~ | Scope creep: dashboard, institucional, etiquetas, contador endpoint | `05-plan-desarrollo.md`, múltiples | ALTA | 🟢 Resuelto | Creado BACKLOG_FUTURO.md, recortado plan |
| ~~H08~~ | models/ ambiguity: carpeta listada pero sin uso real | `02-arquitectura.md` | MEDIA | 🟢 Resuelto | Reemplazado por `services/movimiento.service.js` |
| ~~H09~~ | Infraestructura faltante: .gitignore, .env.example | Raíz | ALTA | 🟢 Resuelto | Creados .gitignore, .env.example, .gitkeep |
| ~~H10~~ | Sin estrategia de testing | — | ALTA | 🟢 Resuelto | Creado `docs/08-test-plan.md` con 15+ tests |
| ~~H11~~ | Sin vendor local html5-qrcode (dependencia de internet) | `05-plan-desarrollo.md` | MEDIA | 🟢 Resuelto | Documentado paso de descarga a `/public/vendor/` en Día 1 |
| ~~H12~~ | Filename numbering conflicts (03-*, 04-*) | docs/ | BAJA | 🟢 Resuelto | Renombrados a 03b-*, 04b-* |
| ~~H13~~ | Error middleware postergado al Día 3 | `05-plan-desarrollo.md` | MEDIA | 🟢 Resuelto | Movido a Día 1 como tarea obligatoria |

---

## Hallazgos de Auditoría #02 (21 hallazgos)

### Categoría A: Propagación de recorte de alcance (14 hallazgos)

| ID | Descripción | Archivo(s) | Línea(s) | Severidad | Estado | Resolución |
|---|---|---|---|---|---|---|
| **H2-01** | html5-qrcode dice "vía CDN" debe decir "local /public/vendor/" | `01-stack-tecnologico.md` | 30 | 🔴 ALTA | 🟢 Resuelto | Editado: "archivo local en /public/vendor/" |
| **H2-02** | `qrcode` (npm) listado pero feature etiquetas en backlog | `01-stack-tecnologico.md` | 31 | 🟡 MEDIA | 🟢 Resuelto | Fila eliminada del stack |
| **H2-03** | Diagrama 3 capas dice "models/" debe decir "services/" | `02-arquitectura.md` | 20-21 | 🟡 MEDIA | 🟢 Resuelto | Cambiado a "services/ → Transaction Script" |
| **H2-04** | `dashboard.routes.js` y `dashboard.controller.js` listados (en backlog) | `02-arquitectura.md` | 69, 75 | 🔴 ALTA | 🟢 Resuelto | Eliminados del árbol canonical |
| **H2-05** | `institucional.html` y `dashboard.html` listados (en backlog) | `02-arquitectura.md` | 88, 90 | 🔴 ALTA | 🟢 Resuelto | Eliminados del árbol canonical |
| **H2-06** | `scripts/generar-etiquetas.js` listado (en backlog) | `02-arquitectura.md` | 100 | 🟡 MEDIA | 🟢 Resuelto | Reemplazado por vendor/ |
| **H2-07** | F9 Dashboard dice "✅ Incluido" debe decir "❌ Excluido" | `03-requisitos.md` | 19 | 🔴 **CRÍTICO** | 🟢 Resuelto | Cambiado a "❌ Excluido (ver BACKLOG_FUTURO)" |
| **H2-08** | RF-01: "admin → dashboard" debe decir "admin → movimientos" | `03-requisitos.md` | 31 | 🔴 ALTA | 🟢 Resuelto | Cambiado a "/admin/movimientos.html" |
| **H2-09** | RF-07 (Dashboard) con criterio de aceptación debe eliminarse | `03-requisitos.md` | 65-67 | 🔴 ALTA | 🟢 Resuelto | Sección RF-07 eliminada |
| **H2-10** | RNF-04 dice "modelos" debe decir "services"; permisos superusuario dice "dashboard" y "gestionar usuarios" | `03-requisitos.md` | 92, 111 | 🟡 MEDIA | 🟢 Resuelto | "modelos" → "services"; permisos limpiados |
| **H2-11** | Login redirect: `/admin/dashboard.html` debe ser `/admin/movimientos.html` | `03b-api-reference.md` | 23 | 🔴 ALTA | 🟢 Resuelto | URL corregida |
| **H2-12** | Sección Dashboard completa con endpoint `/api/dashboard/resumen` — eliminar | `03b-api-reference.md` | 131-148 | 🔴 ALTA | 🟢 Resuelto | Sección eliminada |
| **H2-13** | ER diagrama muestra tabla `alertas` que no existe | `04-base-de-datos.md` | 12-33 | 🔴 ALTA | 🟢 Resuelto | Diagrama actualizado sin tabla alertas |
| **H2-14** | Mapa navegación: superusuario → `/admin/dashboard.html` debe ser movimientos | `04b-frontend-estructura.md` | 16 | 🔴 ALTA | 🟢 Resuelto | Cambiado a /admin/movimientos.html |
| **H2-15** | Referencia a `admin-dashboard.js` y `GET /api/dashboard/resumen` | `04b-frontend-estructura.md` | 112-114 | 🔴 ALTA | 🟢 Resuelto | Sección admin-dashboard.js eliminada |
| **H2-16** | Dice "El dashboard debe mostrar números reales" — eliminar | `04b-frontend-estructura.md` | 120 | 🟡 MEDIA | 🟢 Resuelto | Cambiado a "historial de movimientos debe mostrar datos reales" |
| **H2-17** | Permisos superusuario listan "dashboard" | `06-seguridad.md` | 39 | 🟡 MEDIA | 🟢 Resuelto | Eliminado de permisos |
| **H2-18** | Ruta `GET /api/dashboard/*` listada como protegida | `06-seguridad.md` | 62 | 🟡 MEDIA | 🟢 Resuelto | Reemplazada por referencia a contador frontend |
| **H2-19** | Guion demo paso 4: "dashboard: movimiento reflejado" debe ser "movimientos" | `07-despliegue.md` | 132-133 | 🟢 BAJA | 🟢 Resuelto | Cambiado a "movimientos: historial reflejado" |
| **H2-20** | Test: "GET dashboard como usuario → 403" — endpoint no existe | `08-test-plan.md` | 66 | 🟡 MEDIA | 🟢 Resuelto | Reemplazado por test GET alertas como usuario |
| **H2-21** | Contradicción interna: sidebar dice "Redirige a Movimientos" pero UX dice "El dashboard debe mostrar números" | `04b-frontend-estructura.md` | 36 vs 120 | 🔴 ALTA | 🟢 Resuelto | Resuelto por H2-15 + H2-16 (sidebar y UX alineados) |

### Categoría B: Problemas estructurales (4 hallazgos)

| ID | Descripción | Impacto | Estado | Resolución |
|---|---|---|---|---|
| **H2-S1** | Sin script de validación cross-doc que detecte referencias obsoletas automáticamente | Alto — riesgo de recurrencia | 🟢 Resuelto | Creado scripts/validate-docs.js con 6 reglas de validación y detección de falsos positivos. Integrable como npm run validate. |
| **H2-S2** | Sin timeboxes definidos en tareas del Día 1 | Alto — schedule overflow | 🟢 Resuelto | Timeboxes agregados a 05-plan-desarrollo.md con tabla de 9 tareas, cada una con timebox y acumulado. Mecanismo DEUDA_TECNICA.md documentado. |
| **H2-S3** | Sin prueba de concurrencia para RNF-01 (10 usuarios) | Medio — RNF no certificable | 🟢 Resuelto | Test de concurrencia con Promise.all agregado a 08-test-plan.md movimientos.test.js |
| **H2-S4** | express-session en memoria sin store persistente | Bajo — aceptado para PMV | ⚪ Cancelado | Decisión: aceptado para PMV por simplicidad. Sesiones se pierden al reiniciar servidor. |

---

## Resumen Global

| Auditoría | Totales | Pendientes | En Progreso | Resueltos | Cancelados |
|---|---|---|---|---|---|
| Auditoría #01 | 13 | 0 | 0 | 13 | 0 |
| Auditoría #02 | 25 (21+4) | 0 | 0 | 24 | 1 |
| **Totales** | **38** | **0** | **0** | **37** | **1** |

## Cómo actualizar este archivo

1. Cuando se corrija un hallazgo, cambiar estado de 🔴 Pendiente a 🟢 Resuelto
2. Agregar fecha y descripción breve en la columna "Resolución"
3. Si un hallazgo cambia de severidad o se decide no corregir, documentar en "Resolución"
4. Mantener la tabla de resumen global actualizada
