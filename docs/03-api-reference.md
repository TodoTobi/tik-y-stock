# API Reference — TIC & Stock

Formato de respuesta uniforme: `{ success: boolean, message: string, data?: any }`

---

## Autenticación — `/api/auth`

### `POST /api/auth/registro`

Registra un nuevo usuario (rol `usuario` por defecto).

**Body**: `{ nombre, email, password }`  
**Validaciones**: email único, password ≥ 6 caracteres  
**Response 201**: `{ success: true, message: "Usuario registrado exitosamente" }`

### `POST /api/auth/login`

Inicia sesión.

**Body**: `{ email, password }`  
**Response 200**: `{ success: true, data: { rol } }`  
El frontend redirige según rol: `superusuario` → `/admin/dashboard.html`, `usuario` → `/usuario/catalogo.html`

### `POST /api/auth/logout`

Destruye la sesión actual.  
**Response 200**: `{ success: true, message: "Sesión cerrada" }`

### `GET /api/auth/me`

Devuelve datos del usuario en sesión.  
**Response 200**: `{ success: true, data: { id, nombre, rol } }`  
**Response 401**: `{ success: false, message: "No autenticado" }`

---

## Items — `/api/items` (requireAuth)

### `GET /api/items`

Lista todos los items.

**Query params**: `?categoria=` & `?estado=` & `?busqueda=` (nombre LIKE) & `?codigo=` (búsqueda exacta por codigo_escaneable)  
**Response 200**: `{ success: true, data: [ items[] ] }`

### `GET /api/items/:id`

Detalle de un item.  
**Response 200**: `{ success: true, data: { item } }`  
**Response 404**: `{ success: false, message: "Item no encontrado" }`

### `POST /api/items` (requireRole superusuario)

Crea un item.

**Body**: multipart/form-data con campos `nombre`, `categoria`, `cantidad`, `estado`, `observaciones`, `ubicacion`, y opcional `foto` (archivo)  
**Genera**: `codigo_escaneable` automático si no se provee  
**Response 201**: `{ success: true, data: { id, ... } }`

### `PUT /api/items/:id` (requireRole superusuario)

Edita un item.

**Body**: multipart/form-data (mismos campos que POST, todos opcionales)  
**Response 200**: `{ success: true, data: { item actualizado } }`

### `DELETE /api/items/:id` (requireRole superusuario)

Elimina un item.

**Validación**: no se permite eliminar si tiene movimientos tipo `retiro` con `devuelto=false`  
**Response 200**: `{ success: true, message: "Item eliminado" }`  
**Response 409**: `{ success: false, message: "No se puede eliminar: el ítem tiene retiros activos" }`

---

## Movimientos — `/api/movimientos` (requireAuth)

### `POST /api/movimientos/retiro`

Registra un retiro. **Transaccional**.

**Body**: `{ id_item }` o `{ codigo_escaneado }`  
**Validaciones**: item existe, cantidad > 0, estado = 'disponible'  
**Response 201**: `{ success: true, data: { id_movimiento, ... } }`  
**Response 400**: `{ success: false, message: "Item no disponible para retiro" }`

### `POST /api/movimientos/devolucion`

Registra una devolución. **Transaccional**.

**Body**: `{ id_movimiento }` o `{ id_item }` (resuelve el último retiro abierto del usuario)  
**Response 200**: `{ success: true, data: { id_movimiento, ... } }`

### `GET /api/movimientos` (requireRole superusuario)

Historial completo de movimientos.

**Query params**: `?id_item=` & `?id_usuario=` & `?fecha_desde=` & `?fecha_hasta=`  
**Response 200**: `{ success: true, data: [ movimientos[] con JOIN a items y usuarios ] }`

### `GET /api/movimientos/mis-prestamos`

Préstamos activos del usuario autenticado (retiros con devuelto=false).  
**Response 200**: `{ success: true, data: [ movimientos[] ] }`

---

## Alertas — `/api/alertas` (requireRole superusuario)

### `GET /api/alertas`

Devuelve movimientos tipo retiro con devuelto=false y fecha_hora > 7 días (calculado al vuelo).

**Response 200**: `{ success: true, data: [ alertas[] con JOIN a items y usuarios ] }`

### `POST /api/alertas/:id_movimiento/resolver`

Marca el movimiento como devuelto (reutiliza lógica de devolución).  
**Response 200**: `{ success: true, message: "Alerta resuelta" }`

### `GET /api/alertas/contador`

**Response 200**: `{ success: true, data: { cantidad: number } }`

---

## Dashboard — `/api/dashboard` (requireRole superusuario)

### `GET /api/dashboard/resumen`

**Response 200**:
```json
{
  "success": true,
  "data": {
    "total_items": number,
    "disponibles": number,
    "movimientos_hoy": number,
    "alertas_vencidas": number,
    "ultimas_alertas": [ ... ],
    "ultimos_movimientos": [ ... ]
  }
}
```
