# TIC & Stock — Documentación del Proyecto

> Sistema de inventario para el Taller de TIC de la Escuela Técnica N°20 "Carolina Muzilli"
> Proyecto Integrador III - 6°2° - 2026

## Índice

| # | Archivo | Descripción |
|---|---|---|
| 1 | `01-stack-tecnologico.md` | Stack tecnológico definitivo (solo herramientas gratuitas) |
| 2 | `02-arquitectura.md` | Arquitectura del sistema: monolito 3 capas, patrones, flujo de datos |
| 3 | `03-requisitos.md` | Requisitos funcionales y no funcionales priorizados |
| 4 | `03-api-reference.md` | Referencia completa de la API REST (rutas, métodos, respuestas) |
| 5 | `04-base-de-datos.md` | Esquema de base de datos MySQL, tablas, índices, relaciones, transacciones |
| 6 | `04-frontend-estructura.md` | Estructura del frontend, mapa de navegación, descripción de cada pantalla |
| 7 | `05-plan-desarrollo.md` | Plan de desarrollo para sprint de 3 días (PMV para la muestra) |
| 8 | `06-seguridad.md` | Seguridad: autenticación, roles, validación, buenas prácticas |
| 9 | `07-despliegue.md` | Despliegue en red local del taller, instalación, guion de demo |

## Stack Resumido

**Node.js + Express + MySQL** — Monolito en 3 capas, HTML/CSS/JS vanilla, sin frameworks frontend, sin build step, 100% gratuito.

## Enlaces rápidos del sistema

- `http://localhost:3000/login.html` — Login
- `http://localhost:3000/admin/dashboard.html` — Panel superusuario
- `http://localhost:3000/usuario/catalogo.html` — Catálogo alumno
- `http://localhost:3000/usuario/escaneo.html` — Escaneo QR
