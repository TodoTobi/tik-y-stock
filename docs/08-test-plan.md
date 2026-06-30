# Plan de Testing — TIC & Stock

> Estrategia mínima de testing para el PMV de 3 días.

## Herramientas

- **Test runner**: `node:test` (built-in en Node.js 18+, sin dependencias extra)
- **HTTP assertions**: `supertest` (única dependencia dev, instalada con `npm install --save-dev supertest`)
- **BD**: Base de datos de test separada (`tic_stock_test`) creada al inicio de cada test suite

## Estructura

```
tests/
├── setup.js              # Conexión a BD de test + limpieza antes de cada suite
├── auth.test.js           # Tests de autenticación
├── items.test.js          # Tests de CRUD de items
├── movimientos.test.js    # Tests transaccionales de retiro/devolución
└── autorizacion.test.js   # Tests de seguridad (roles)
```

## Test Cases por Suite

### auth.test.js

| Test | Descripción | Verificación |
|---|---|---|
| Registrar usuario válido | POST /api/auth/registro con datos correctos | 201, success true, usuario creado en BD |
| Registrar email duplicado | POST /api/auth/registro con email existente | 400, success false |
| Login correcto | POST /api/auth/login con credenciales válidas | 200, success true, rol en data |
| Login incorrecto | POST /api/auth/login con contraseña errónea | 401, success false |
| GET /me autenticado | GET /api/auth/me con cookie de sesión | 200, success true, datos del usuario |
| GET /me no autenticado | GET /api/auth/me sin cookie | 401, success false |

### items.test.js

| Test | Descripción | Verificación |
|---|---|---|
| GET items sin auth | GET /api/items sin cookie | 401 |
| GET items como usuario | GET /api/items con sesión de usuario | 200, array de items |
| GET items con filtros | GET /api/items?categoria=Sensores | 200, solo items de esa categoría |
| POST item como usuario | POST /api/items con sesión de usuario | 403 (requireRole) |
| POST item como admin | POST /api/items con sesión de superusuario | 201, item creado |
| DELETE item con préstamo activo | DELETE /api/items/:id con movimiento retiro abierto | 409, success false |
| DELETE item sin préstamo | DELETE /api/items/:id sin movimientos activos | 200, success true |

### movimientos.test.js

| Test | Descripción | Verificación |
|---|---|---|
| Retiro exitoso | POST /api/movimientos/retiro con item disponible | 201, cantidad descontada en BD |
| Retiro sin stock | POST /api/movimientos/retiro con cantidad=0 | 400, success false |
| Devolución exitosa | POST /api/movimientos/devolucion con id_movimiento válido | 200, cantidad repuesta en BD |
| Devolución de otro usuario | POST /api/movimientos/devolucion con movimiento de otro usuario | 403, success false |
| Doble devolución | POST /api/movimientos/devolucion sobre movimiento ya devuelto | 400, success false |
| Concurrencia 10 usuarios (RNF-01) | 10 retiros concurrentes con Promise.all sobre mismo ítem con stock=10 | Los 10 exitosos, cantidad final = 0, sin errores 500, tiempo promedio < 500ms |

### autorizacion.test.js

| Test | Descripción | Verificación |
|---|---|---|
| PUT item como usuario | PUT /api/items/:id con sesión de usuario | 403 |
| DELETE item como usuario | DELETE /api/items/:id con sesión de usuario | 403 |
| GET movimientos como usuario | GET /api/movimientos con sesión de usuario | 403 |
| GET alertas como usuario | GET /api/alertas con sesión de usuario | 403 |
| GET alertas como usuario | GET /api/alertas con sesión de usuario | 403 |

## Configuración

```javascript
// tests/setup.js
import { before, after } from 'node:test';
import { pool } from '../config/db.js';

const TEST_DB = 'tic_stock_test';

before(async () => {
  // Crear BD de test si no existe
  await pool.query(`CREATE DATABASE IF NOT EXISTS ${TEST_DB}`);
  // Ejecutar schema en BD de test
  // (usar fs para leer y ejecutar schema.sql)
});

after(async () => {
  await pool.query(`DROP DATABASE IF EXISTS ${TEST_DB}`);
  await pool.end();
});
```

## Ejecución

```bash
# Todas las suites
npm test

# Suite específica
node --test tests/auth.test.js

# Modo watch (desarrollo)
node --test --watch tests/movimientos.test.js
```

## Cobertura esperada para PMV

| Métrica | Objetivo |
|---|---|
| Tests unitarios | 0 (no aplica para vanilla JS frontend) |
| Tests de integración (API) | Mínimo 15 tests pasando |
| Tests de seguridad | Mínimo 5 tests (todos los escenarios 403) |
| Cobertura de rutas protegidas | 100% (cada ruta con requireRole tiene test de violación) |
