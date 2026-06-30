# Frontend — Estructura, Componentes y Navegación

## Principios de Diseño

- **Paleta**: grises oscuros (#2d2d2d, #f5f5f5) con acento azul (#2563eb) o naranja (#ea580c)
- **Tipografía**: sans-serif del sistema
- **Sin frameworks JS ni librerías de UI** (html5-qrcode es la única excepción, servida desde `/public/vendor/`)
- **Mobile-friendly básico** (uso principal en escritorio del taller)
- **Tiempo de uso**: cualquier función alcanzable en ≤ 2 clics, cualquier consulta resuelta en ≤ 30 segundos

## Mapa de Navegación

```
login.html
  │
  ├── [superusuario] → /admin/movimientos.html
  │                        │
  │                        ├── /admin/inventario.html (CRUD items)
  │                        ├── /admin/movimientos.html (historial + registro manual)
  │                        └── (alertas en sidebar)
  │
  └── [usuario] → /usuario/catalogo.html
                       │
                       ├── /usuario/escaneo.html (QR/código + retiro/devolución)
                       └── /usuario/prestamos.html (mis préstamos activos)

Footer común: (sin página institucional en PMV — ver BACKLOG_FUTURO)
```

## Sidebar de Navegación

### Admin (superusuario)

| Icono | Enlace | Descripción |
|---|---|---|
| 📊 | Dashboard | Redirige a Movimientos (F9 en backlog) |
| 📦 | Inventario | CRUD de items |
| 🔄 | Movimientos | Historial + registro manual |
| ⚠️ | Alertas | Alertas vencidas (badge con contador) |
| 🚪 | Cerrar sesión | Logout |

### Usuario (alumno)

| Icono | Enlace | Descripción |
|---|---|---|
| 📋 | Catálogo | Grid de items disponibles |
| 📷 | Escanear | Escaneo QR/código de barras |
| 📄 | Mis préstamos | Préstamos activos del usuario |
| 🚪 | Cerrar sesión | Logout |

## Archivos del Frontend

### Estilos globales (compartidos vía CSS)

Archivo principal de estilo (definir en cada HTML vía `<link>`).

```css
/* Variables de paleta (definidas en :root) */
/* Layout de sidebar + contenido */
/* Componentes: cards, tablas, badges, modales, formularios */
/* Estados: loading (spinner), error, success */
/* Responsive básico */
```

### Descripción de cada pantalla

| Archivo | Funcionalidad |
|---|---|
| `login.html` | Formulario email + password, redirección por rol |
| `registro.html` | Formulario nombre + email + password + confirmar |
| `admin/inventario.html` | Tabla con filtros + modal ABM con foto |
| `admin/movimientos.html` | Tabla historial con filtros + formulario registro manual |
| `usuario/catalogo.html` | Grid de tarjetas con foto, badge estado, modal detalle |
| `usuario/escaneo.html` | Visor de cámara + input manual alternativo + botones confirmación |
| `usuario/prestamos.html` | Lista de préstamos activos con botón "solicitar devolución" |
| (*opcional*) `institucional.html` | Página estática (en BACKLOG_FUTURO, solo si sobra tiempo) |

## Comportamientos Clave (JS transversal)

### auth.js (compartido)
- `fetch('/api/auth/me')` al cargar cada página → si 401, redirigir a login
- Cerrar sesión: `POST /api/auth/logout` → redirigir a login

### admin-inventario.js
- Fetch inicial: `GET /api/items`
- Filtros con debounce 300ms → refetch
- Modal ABM con FormData (incluye foto)
- Eliminar con confirmación
- Auto-refresh tras guardar

### usuario-catalogo.js
- Fetch inicial: `GET /api/items`
- Grid de cards, toggle "solo disponibles"
- Buscador en tiempo real
- Modal detalle al clicar tarjeta

### usuario-escaneo.js
- Inicializar `Html5Qrcode` con cámara
- Al detectar código → fetch item → mostrar confirmación
- Botones "Confirmar retiro" / "Confirmar devolución" → POST a movimientos
- Feedback visual grande (success verde / error rojo)
- Fallback: input manual con autofocus + detección de Enter

### admin-movimientos.js
- Fetch historial con filtros
- Formulario compacto: autocomplete item + botón retiro/devolución

### usuario-prestamos.js
- Fetch `GET /api/movimientos/mis-prestamos`
- Lista + botón "Devolver" → POST devolución

## Consideraciones de UX para la Demo

1. La pantalla de **escaneo** es la estrella — debe dar feedback instantáneo y visible
2. El **catálogo** debe resolverse en < 5 segundos: "¿está disponible el kit?"
3. El **historial de movimientos** debe mostrar datos reales desde el seed, no vacío
4. **Estados de carga** (spinner) en todas las pantallas que hacen fetch
5. **Botones deshabilitados** durante envío de formularios
