# Stack Tecnológico — TIC & Stock

## Decisión Fundamental

> **Node.js + Express + MySQL** en lugar de PHP + MySQL (corrigiendo la contradicción en la tabla RF-01 original).
>
> Justificación: el equipo domina JavaScript en ambas capas, opencode + DeepSeek son más productivos generando JS consistente en todo el stack, y existe documentación de arquitectura que respalda la decisión frente al profesor.

## Stack Completo

### Backend

| Componente | Tecnología | Versión | Propósito |
|---|---|---|---|
| **Runtime** | Node.js | 18+ (LTS) | Entorno de ejecución JavaScript del lado servidor |
| **Framework web** | Express.js | 4.x | Enrutamiento, middlewares, servidor HTTP |
| **Base de datos** | MySQL | 8.x | Almacenamiento persistente relacional |
| **Driver BD** | mysql2 (con promesas) | Última | Conexión a MySQL con pool de conexiones y consultas parametrizadas |
| **Autenticación** | express-session + bcrypt | Últimas | Manejo de sesiones con cookies + hash de contraseñas (costo 10) |
| **Subida archivos** | multer | Última | Carga de imágenes de ítems (límite 3MB, solo jpg/png/webp) |
| **Variables entorno** | dotenv | Última | Configuración sensible fuera del código |

### Frontend

| Componente | Tecnología | Propósito |
|---|---|---|
| **HTML** | HTML5 semántico | Estructura de páginas |
| **CSS** | CSS3 vanilla | Estilo visual propio, paleta industrial/taller |
| **JavaScript** | JS vanilla (ES6+) | Interactividad, fetch API, manipulación DOM |
| **Escaneo QR/Barras** | html5-qrcode (vía CDN) | Lectura de códigos desde cámara del dispositivo |
| **Generación QR** | qrcode (npm) | Generación de etiquetas imprimibles desde Node.js |

### Herramientas de Desarrollo

| Herramienta | Propósito |
|---|---|
| **nodemon** (dev) | Recarga automática del servidor en desarrollo |
| **opencode + DeepSeek V4 Flash Pro** | Asistente de desarrollo (generación de código) |
| **Git** | Control de versiones |

## Justificación de cada elección

### ¿Por qué Node.js + Express en vez de PHP?
- El equipo conoce JavaScript, no PHP
- Un solo lenguaje en frontend y backend reduce fricción
- opencode genera mejor código JS que PHP
- Express es minimalista, no impone estructura rígida
- npm tiene ecosistema maduro para todas las necesidades

### ¿Por qué MySQL en vez de PostgreSQL o MongoDB?
- MySQL es el motor que el equipo ya conoce del plan de estudios
- Es gratuito, corre sin problemas en hardware del taller
- Los datos son altamente relacionales (usuarios ↔ items ↔ movimientos ↔ alertas)
- PostgreSQL no aporta ventajas para este volumen de datos
- MongoDB no es adecuado para un sistema con transacciones y joins frecuentes

### ¿Por qué vanilla JS en frontend sin frameworks?
- No hay tiempo para aprender/configurar React, Vue o Angular en 3 días
- No hay build step, se sirven archivos estáticos directamente
- Para el alcance del PMV (formularios, tablas, modales), vanilla JS es suficiente
- Elimina dependencias y configuraciones que podrían fallar en la demo

### ¿Por qué mysql2 con promesas?
- Las promesas permiten async/await, código más legible
- El pool de conexiones soporta transacciones ACID
- Las consultas parametrizadas con `?` previenen inyección SQL

### ¿Por qué html5-qrcode en vez de una librería nativa?
- Es liviana (no requiere instalación npm, va por CDN)
- Lee QR y códigos de barras con la misma API
- Corre 100% en el navegador, sin backend involucrado
- Tiene soporte para cámaras frontal/trasera y detección automática

## Costo

**Cero costo.** Todas las herramientas son gratuitas/open-source. No se requiere ningún servicio cloud, hosting pago, ni licencia.
