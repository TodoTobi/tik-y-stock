# TIC & Stock — Sistema de Gestión de Inventario para Taller de TIC

> **Escuela Técnica N°20 "Carolina Muzilli"** — Proyecto Integrador III - 6°2° - 2026

## Problema

El taller de TIC pierde **100 minutos semanales por persona** buscando materiales, herramientas y componentes. No hay trazabilidad de quién retiró qué, ni visibilidad en tiempo real de la disponibilidad de los recursos del taller.

## Solución

Sistema web de inventario con **consulta en tiempo real**, **escaneo QR/código de barras**, y **trazabilidad de movimientos** que corre en la red Wi-Fi institucional sin depender de internet ni de servicios cloud.

## Stack Tecnológico

| Capa | Tecnología | Justificación |
|---|---|---|
| Backend | Node.js + Express.js | JS unificado full-stack, productividad con opencode |
| Base de datos | MySQL (mysql2 con promesas) | Gratuito, conocido, consultas parametrizadas |
| Frontend | HTML5 + CSS3 + JavaScript vanilla | Sin build step, sin framework, servido por Express |
| Autenticación | express-session + bcrypt | Sesiones server-side sin JWT, simple y segura |
| Escaneo | html5-qrcode (local /public/vendor/) | QR + código de barras desde cámara, sin dependencia de internet |
| Imágenes | multer | Subida de fotos a /public/uploads |

## Arquitectura

Monolito en 3 capas (Presentación → Lógica → Datos) con Express sirviendo archivos estáticos y exponiendo API REST.

## Roles

| Rol | Permisos |
|---|---|
| **superusuario** | CRUD inventario, historial movimientos, alertas |
| **usuario** (alumno) | Catálogo, escaneo QR, retiro/devolución, mis préstamos activos |

## Enlaces del sistema

- `http://localhost:4000/login.html` — Login
- `http://localhost:4000/registro.html` — Registro
- `http://localhost:4000/admin/dashboard.html` — Dashboard admin (superusuario)
- `http://localhost:4000/admin/inventario.html` — Gestión inventario (superusuario)
- `http://localhost:4000/admin/movimientos.html` — Historial movimientos (superusuario)
- `http://localhost:4000/admin/alertas.html` — Alertas y resolución (superusuario)
- `http://localhost:4000/usuario/catalogo.html` — Catálogo (usuario)
- `http://localhost:4000/usuario/escaneo.html` — Escaneo QR (usuario)
- `http://localhost:4000/usuario/prestamos.html` — Mis préstamos (usuario)
