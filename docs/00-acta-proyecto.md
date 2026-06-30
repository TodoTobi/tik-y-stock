# Acta de Proyecto — TIC & Stock

> **Versión:** 1.0
> **Fecha:** 30 de junio de 2026
> **Estado:** APROBADO

---

## 1. Identificación del Proyecto

| Campo | Valor |
|---|---|
| **Nombre del proyecto** | TIC & Stock — Sistema de Gestión de Inventario para Taller de TIC |
| **Institución** | Escuela Técnica N°20 "Carolina Muzilli" |
| **Materia** | Proyecto Integrador III — 6°2° — 2026 |
| **Tipo de proyecto** | Monolito web 3 capas (Presentación / Lógica / Datos) |
| **Modalidad** | Aplicación web sin conexión a internet, sobre red Wi-Fi local del taller |
| **Sprint** | 3 días (PMV para muestra escolar) |

---

## 2. Resumen Ejecutivo

El taller de TIC pierde **100 minutos semanales por persona** buscando materiales, herramientas y componentes. No hay trazabilidad de quién retiró qué ni visibilidad en tiempo real de la disponibilidad de recursos.

TIC & Stock resuelve esto con un sistema web de inventario que permite **consulta en tiempo real**, **escaneo QR/código de barras** y **trazabilidad de movimientos**, corriendo 100% sobre la red Wi-Fi institucional sin dependencia de internet ni cloud.

---

## 3. Alcance (Scope)

### 3.1 Funcionalidades Incluidas (PMV)

| ID | Feature | Prioridad | Descripción |
|---|---|---|---|
| **F1** | Base de datos | P0 | Schema MySQL, tablas (usuarios, items, movimientos), índices, connection pool |
| **F2** | Autenticación | P0 | Login, registro, sesiones, roles (superusuario/usuario) |
| **F3** | CRUD Inventario | P0 | Crear/leer/actualizar/eliminar ítems con foto |
| **F4** | Catálogo en tiempo real | P1 | Vista alumno: disponibilidad actualizada al instante |
| **F5** | Movimientos | P1 | Retiro y devolución de ítems, historial, trazabilidad |
| **F6** | Escaneo QR/Código barras | P1 | Lectura por cámara + input manual + etiquetas |
| **F7** | Alertas | P2 | Detección de devoluciones vencidas (>7 días), sin tabla dedicada |

### 3.2 Funcionalidades Diferidas (BACKLOG_FUTURO)

| ID | Feature | Prioridad | Tiempo estimado |
|---|---|---|---|
| F9 | Dashboard admin (métricas, cards) | P1 | ~3-4h |
| — | Alertas con tabla propia + trigger | P1 | ~2h |
| F10 | Página institucional | P2 | ~1h |
| — | Script generar-etiquetas.js | P2 | ~2h |
| F8 | Solicitudes de compra/reservas | P3 | ~8h+ |
| — | Modo oscuro | P3 | ~1h |
| — | Historial de alertas resueltas | P3 | ~1h |

### 3.3 Exclusiones Explícitas

- Dashboard admin (F9) → redirige /admin a /admin/movimientos.html
- Página institucional (F10)
- Script `generar-etiquetas.js` (se muestra QR en pantalla para la demo)
- Endpoint `GET /api/alertas/contador` (se calcula con `data.length` en frontend)
- Tabla `alertas` en base de datos (cálculo al vuelo por consulta SQL)
- Carpeta `models/` → reemplazada por `services/movimiento.service.js` (Transaction Script)
- express-mysql-session → sesiones en memoria aceptadas para PMV
- HTTPS → HTTP aceptado en red cerrada del taller

### 3.4 Roles de Usuario

| Rol | Permisos |
|---|---|
| **superusuario** | CRUD items, ver todos los movimientos, ver/resolver alertas |
| **usuario** | Ver catálogo, escanear QR, retirar/devolver ítems, ver sus préstamos activos |

---

## 4. Cronograma (Schedule)

### 4.1 Línea de Tiempo

| Día | Features | Entregable |
|---|---|---|
| **Día 1** (9h) | F1 + F2 + F3 + Infraestructura | API funcional + login/registro + CRUD items + tests |
| **Día 2** (8h) | F4 + F5 + F6 | Alumno puede escanear QR, retirar y devolver |
| **Día 3** (6h) | F7 + Seed + Despliegue + Demo | Sistema funcional con datos reales en red local |

### 4.2 Desglose Día 1 — Base de datos, Auth, CRUD e Infraestructura

| # | Tarea | Timebox |
|---|---|---|
| 1 | Setup manual: npm init, instalar deps, crear BD, .env, .gitignore, vendor | 30 min |
| 2 | Esqueleto proyecto: server.js, dotenv, static, sesión, logging, error middleware, listen 0.0.0.0 | 30 min |
| 3 | Base de datos: schema.sql + config/db.js (pool mysql2) | 45 min |
| 4 | Transaction Script: services/movimiento.service.js (retiroItem + devolucionItem) | 45 min |
| 5 | Autenticación: middlewares (auth + role), controller, routes | 90 min |
| 6 | Pantallas login/registro: login.html + registro.html + css + js | 60 min |
| 7 | CRUD inventario: controller + routes + multer | 90 min |
| 8 | Pantalla gestión admin: inventario.html + admin-inventario.js | 90 min |
| 9 | Tests: tests/setup.js + auth.test.js + autorizacion.test.js | 60 min |

### 4.3 Desglose Día 2 — Catálogo, Movimientos y Escaneo

| # | Tarea | Timebox |
|---|---|---|
| 1 | Catálogo alumno (F4): catalogo.html + js (grid, filtros, modal) | 90 min |
| 2 | Backend movimientos (F5): controller + routes (retiro, devolución, historial) | 90 min |
| 3 | Pantallas movimientos: admin/movimientos.html + usuario/prestamos.html | 90 min |
| 4 | Módulo escaneo (F6): escaneo.html + js (html5-qrcode, input manual) | 90 min |
| 5 | Tests: movimientos.test.js | 30 min |

### 4.4 Desglose Día 3 — Alertas, Seed, Despliegue y Demo

| # | Tarea | Timebox |
|---|---|---|
| 1 | Alertas (F7): controller + routes (GET alertas + POST resolver) | 60 min |
| 2 | Redirect admin + hardening + responsive + loading spinners | 60 min |
| 3 | Seed data: database/seed.sql (5 usuarios, 15-20 ítems, movimientos históricos) | 60 min |
| 4 | Despliegue + prueba red local + ensayo demo | 60 min |

### 4.5 Mecanismo de Timebox

Si una tarea excede su timebox, se documenta el avance en `DEUDA_TECNICA.md` y se pasa a la siguiente tarea. Ninguna tarea puede consumir el tiempo de otra.

### 4.6 Plan de Contingencia (Orden de Corte)

1. **Nunca cortar:** F1 (BD) + F2 (Auth) + F3 (CRUD) + F4 (Catálogo)
2. **Cortar primero:** Alertas (F7) — mostrar solo la consulta sin endpoint dedicado
3. **Degradar:** Escaneo por cámara → solo input manual (funcionalidad de negocio intacta)
4. **Siempre excluido:** Todo lo que está en BACKLOG_FUTURO.md

---

## 5. Presupuesto (Budget)

### 5.1 Resumen de Costos

**Costo total: CERO ($0).** Todas las herramientas son gratuitas/open-source. No hay servicios cloud, hosting pago ni licencias.

### 5.2 Dependencias de Producción (npm)

| Paquete | Propósito | Licencia |
|---|---|---|
| express | Framework web | MIT |
| mysql2 | Driver MySQL con promesas | MIT |
| express-session | Manejo de sesiones | MIT |
| bcrypt | Hashing de contraseñas (costo 10) | MIT |
| multer | Subida de archivos (3MB) | MIT |
| dotenv | Variables de entorno | MIT |

### 5.3 Dependencias de Desarrollo

| Paquete | Propósito | Licencia |
|---|---|---|
| nodemon | Auto-reload en desarrollo | MIT |
| supertest | Tests HTTP | MIT |

### 5.4 Librerías Frontend

| Librería | Propósito | Almacenamiento |
|---|---|---|
| html5-qrcode | Escaneo QR/código barras | `/public/vendor/` (local) |

### 5.5 Infraestructura

| Recurso | Especificación | ¿Ya existe? |
|---|---|---|
| Servidor (PC del taller) | 512MB+ RAM, Windows/Linux/macOS | ✅ |
| Node.js v18+ | Runtime | Requiere instalación |
| MySQL 8.x | Base de datos | Requiere instalación |
| Red Wi-Fi del taller | Conexión al router | ✅ |
| Internet | NO requerido | ✅ (no necesario) |

### 5.6 Herramientas de Desarrollo

| Herramienta | Costo |
|---|---|
| opencode + DeepSeek V4 Flash Pro | Gratuito |
| Git | Gratuito |
| npm (incluido con Node.js) | Gratuito |
| node:test (incluido en Node.js 18+) | Gratuito |

---

## 6. Interesados (Stakeholders)

| Interesado | Rol en el sistema | Expectativa principal |
|---|---|---|
| **Profesor/Tallerista** | superusuario | Gestionar inventario, ver quién tiene qué, recuperar materiales vencidos |
| **Alumnos de 6°2°** | usuario (alumno) | Saber si un kit está disponible en <5 segundos, retirar y devolver rápido |
| **Docente de Proyecto Integrador** | Supervisor académico | Evaluar el PMV funcional en la muestra escolar |
| **Auditor externo** | FAANG Principal Engineer | Validar calidad técnica, arquitectura y documentación |

---

## 7. Restricciones Técnicas

| # | Restricción | Detalle |
|---|---|---|
| R1 | Sin internet | Sistema 100% offline en red Wi-Fi del taller. Toda librería con respaldo local. |
| R2 | Solo herramientas gratis/open-source | Cero presupuesto. Sin cloud, sin hosting pago, sin licencias. |
| R3 | Sin frameworks frontend | HTML/CSS/JS vainilla. Sin React, Vue, Angular. Sin build step. |
| R4 | Sprint de 3 días | Límite duro. Timebox por tarea. Cortar antes que retrasar. |
| R5 | MySQL 8.x + InnoDB | Base de datos definida. Sin PostgreSQL, sin MongoDB. |
| R6 | Node.js v18+ | Usa `node:test` (built-in). Sin Jest, sin Mocha. |
| R7 | API REST uniforme | Toda respuesta: `{ success: boolean, message: string, data?: any }` |
| R8 | Listen 0.0.0.0 | Accesible desde otros dispositivos en la red local. |
| R9 | Cámara en móviles | Los navegadores móviles exigen HTTPS para getUserMedia. Input manual como fallback. Aceptado para PMV. |
| R10 | Sesiones en memoria | Se pierden al reiniciar el servidor. Aceptado para PMV. |

---

## 8. Criterios de Éxito

| Criterio | Métrica | Estado esperado al cierre del Día 3 |
|---|---|---|
| **Funcional** | Todas las features F1 a F7 implementadas | ✅ |
| **Tests** | Mínimo 15 tests de integración pasando | `npm test` exitoso |
| **Seguridad** | Rutas protegidas con requireRole | 0 violaciones de autorización |
| **Rendimiento** | 10 usuarios concurrentes | Sin errores 500, tiempo promedio < 500ms |
| **Despliegue** | Accesible desde otros dispositivos en la red local | ✅ |
| **Calidad código** | Validación cruzada de documentación | `npm run validate` sin errores |
| **Demo** | Funcional en muestra escolar | 3-5 minutos, todos los flujos演示 |

---

## 9. Riesgos y Deuda Técnica Aceptada

| Riesgo | Decisión | Impacto aceptado |
|---|---|---|
| Sesiones en memoria (sin persistencia) | Aceptado para PMV | Demo en una sola sesión. Post-PMV: migrar a express-mysql-session. |
| HTTP (sin HTTPS) | Aceptado: red cerrada del taller | Cookies en texto plano. Si se expone a internet, migrar a HTTPS es requisito. |
| Sin dashboard (F9) | Corte deliberado de alcance | Admin sin resumen ejecutivo. |
| Sin notificaciones email | Corte deliberado de alcance | Alertas solo visibles cuando el admin inicia sesión. |
| Sin tabla dedicada de alertas | Simplificación aceptada | Escala mal con muchos datos. Aceptable para volumen del taller. |
| Sin sistema de reservas (F8) | Corte deliberado de alcance | Sin reservas anticipadas. Por orden de llegada. |

---

## 10. Aprobación

| Rol | Nombre | Firma | Fecha |
|---|---|---|---|
| **Desarrollador** | opencode + DeepSeek V4 Flash Pro | — | 30/06/2026 |
| **Supervisor** | (Espacio para docente) | — | — |
| **Cliente** | (Espacio para tallerista) | — | — |

---

## 11. Control de Cambios

| Versión | Fecha | Cambio | Aprobado por |
|---|---|---|---|
| 1.0 | 30/06/2026 | Versión inicial — consolidación de alcance, cronograma y presupuesto post-auditorías | — |
