# TIC & Stock — Documentación del Proyecto

> Sistema de inventario para el Taller de TIC de la Escuela Técnica N°20 "Carolina Muzilli"
> Proyecto Integrador III - 6°2° - 2026

## Índice

| # | Archivo | Descripción |
|---|---|---|
| 1 | `01-stack-tecnologico.md` | Stack tecnológico definitivo (solo herramientas gratuitas) |
| 2 | `02-arquitectura.md` | Arquitectura del sistema: monolito 3 capas, Transaction Script, flujo de datos |
| 3 | `03-requisitos.md` | Requisitos funcionales y no funcionales priorizados |
| 3b | `03b-api-reference.md` | Referencia completa de la API REST (rutas, métodos, respuestas, validaciones) |
| 4 | `04-base-de-datos.md` | Esquema de base de datos MySQL, tablas, índices, relaciones, transacciones |
| 4b | `04b-frontend-estructura.md` | Estructura del frontend, mapa de navegación, descripción de cada pantalla |
| 5 | `05-plan-desarrollo.md` | Plan de desarrollo para sprint de 3 días (PMV corregido post-auditoría) |
| 6 | `06-seguridad.md` | Seguridad: autenticación, roles, validación, buenas prácticas, HTTP vs HTTPS |
| 7 | `07-despliegue.md` | Despliegue en red local del taller, instalación, guion de demo |
| 8 | `08-test-plan.md` | Estrategia de testing: suites, casos de prueba, configuración, cobertura |
| 0 | `00-acta-proyecto.md` | **Acta de proyecto**: alcance, cronograma, presupuesto, stakeholders, criterios de éxito, aprobación formal |
| — | `BACKLOG_FUTURO.md` | Features excluidas del PMV para mantener alcance (dashboard, institucional, etiquetas) |

## Infraestructura del proyecto

| Archivo | Propósito |
|---|---|
| `.gitignore` | Excluye node_modules/, .env, uploads/ del control de versiones |
| `.env.example` | Template de variables de entorno (copiar a .env y editar) |
| `public/vendor/html5-qrcode.min.js` | Librería de escaneo local (sin dependencia de CDN/internet) |
| `services/movimiento.service.js` | Transaction Script para operaciones críticas (retiro/devolución) |
| `tests/` | Suites de test con node:test + supertest |

## Stack Resumido

**Node.js + Express + MySQL** — Monolito en 3 capas, Transaction Pattern, HTML/CSS/JS vanilla, sin frameworks frontend, sin build step, 100% gratuito.

## Enlaces rápidos del sistema

- `http://localhost:3000/login.html` — Login
- `http://localhost:3000/admin/movimientos.html` — Panel superusuario (redirección desde /admin)
- `http://localhost:3000/usuario/catalogo.html` — Catálogo alumno
- `http://localhost:3000/usuario/escaneo.html` — Escaneo QR
