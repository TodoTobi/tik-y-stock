# Arquitectura del Sistema — TIC & Stock

## Patrón Arquitectónico

**Monolito en 3 capas (Presentación / Lógica / Datos)**

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTACIÓN                              │
│   HTML5 + CSS3 + JS Vanilla (archivos estáticos en /public)  │
│   Servido por Express sin build step                          │
│   Comunicación vía fetch() a API REST /api/*                  │
├─────────────────────────────────────────────────────────────┤
│                    LÓGICA (API REST)                          │
│   routes/    → Definición de rutas y middlewares              │
│   controllers/ → Lógica de negocio, orquestación             │
│   middlewares/ → Autenticación, autorización, validación     │
│   Express.js gestiona peticiones HTTP                         │
├─────────────────────────────────────────────────────────────┤
│                    DATOS                                      │
│   models/    → Consultas SQL parametrizadas                   │
│   config/db.js → Pool de conexiones MySQL (mysql2/promise)    │
│   MySQL 8.x → Almacenamiento persistente                      │
└─────────────────────────────────────────────────────────────┘
```

## Flujo de Datos

```
Navegador (cliente)
    │
    ▼  fetch() → JSON
API REST (Express.js)
    │
    ├── Middleware global: logging (método + ruta + timestamp)
    ├── express-session: valida cookie de sesión
    ├── auth.middleware: verifica req.session.usuario
    └── role.middleware: verifica rol (superusuario/usuario)
    │
    ▼
Controller (lógica de negocio)
    │
    ├── Valida datos de entrada
    ├── Aplica reglas de negocio
    └── Llama a modelo (consulta SQL parametrizada)
    │
    ▼
Model → Config/DB (pool mysql2)
    │
    ├── Conexión del pool
    ├── Consulta parametrizada (placeholders ?)
    ├── Transacción si es necesario (retiro/devolución)
    └── Resultado → Controller → JSON response
```

## Estructura de Carpetas

```
tic-stock/
├── server.js                  # Punto de entrada, configuración Express
├── .env                       # Variables de entorno (no se sube a git)
├── config/
│   └── db.js                  # Pool de conexiones MySQL
├── routes/
│   ├── auth.routes.js         # /api/auth/*
│   ├── items.routes.js        # /api/items/*
│   ├── movimientos.routes.js  # /api/movimientos/*
│   ├── alertas.routes.js      # /api/alertas/*
│   └── dashboard.routes.js    # /api/dashboard/*
├── controllers/
│   ├── auth.controller.js
│   ├── items.controller.js
│   ├── movimientos.controller.js
│   ├── alertas.controller.js
│   └── dashboard.controller.js
├── middlewares/
│   ├── auth.middleware.js      # requireAuth
│   └── role.middleware.js      # requireRole(rol)
├── models/
│   └── (consultas SQL agrupadas por entidad)
├── public/
│   ├── css/                   # Archivos CSS
│   ├── js/                    # Archivos JS del frontend
│   ├── uploads/               # Imágenes subidas (multer)
│   ├── uploads/items/         # Fotos de ítems
│   ├── login.html
│   ├── registro.html
│   ├── institucional.html
│   ├── admin/
│   │   ├── dashboard.html
│   │   ├── inventario.html
│   │   └── movimientos.html
│   └── usuario/
│       ├── catalogo.html
│       ├── escaneo.html
│       └── prestamos.html
├── database/
│   ├── schema.sql             # Esquema completo de BD
│   └── seed.sql               # Datos de demo
└── scripts/
    └── generar-etiquetas.js   # Script para imprimir QR
```

## Principios Arquitectónicos

1. **Separación de responsabilidades:** Cada capa tiene una función específica y no se mezclan.
2. **API REST coherente:** Todas las respuestas siguen el formato `{ success: boolean, message: string, data?: any }`.
3. **Consultas parametrizadas:** Nunca se concatena SQL. Todos los placeholders usan `?`.
4. **Transacciones ACID:** Retiros y devoluciones se ejecutan dentro de transacciones MySQL para evitar inconsistencias.
5. **Protección por capas:** Autenticación (sesión) + Autorización (roles) en cada ruta protegida.
6. **Sin dependencias externas:** El frontend no usa CDNs para CSS, frameworks JS, ni librerías de UI.
7. **Configurable por entorno:** Conexión a BD, puerto, secretos vía `.env`.

## Formato de Respuesta API

```json
// Éxito
{ "success": true, "message": "Ítem creado correctamente", "data": { "id": 1, ... } }

// Error
{ "success": false, "message": "El ítem no tiene unidades disponibles" }

// No autorizado
{ "success": false, "message": "No autorizado" }

// Error de validación
{ "success": false, "message": "La contraseña debe tener al menos 6 caracteres" }
```
