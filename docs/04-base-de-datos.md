# Base de Datos — TIC & Stock

## Motor

**MySQL 8.x** con motor InnoDB para todas las tablas (soporta transacciones ACID y claves foráneas).

---

## Diagrama Entidad-Relación

```
┌──────────────┐       ┌──────────────────┐
│   usuarios   │       │     items        │
├──────────────┤       ├──────────────────┤
│ id (PK)      │◄────┐ │ id (PK)          │
│ nombre       │     │ │ nombre           │
│ email (UQ)   │     │ │ categoria        │
│ password_hash │     │ │ cantidad         │
│ rol          │     │ │ estado           │
│ fecha_creac  │     │ │ observaciones    │
└──────────────┘     │ │ foto_url         │
                     │ │ ubicacion        │
                     │ │ codigo_escaneable│       ┌──────────────────┐
                     │ │ (UQ)             │       │   movimientos    │
                     │ │ fecha_creacion   │       ├──────────────────┤
                     │ └──────────────────┘       │ id (PK)         │
                     │                            │ id_item (FK)────┘
                     └────────────────────────────┤ id_usuario (FK)─┘
                                                   │ tipo (retiro/dev)
                                                   │ fecha_hora
                                                   │ codigo_escaneado
                                                   │ devuelto (bool)
                                                   └──────────────────┘
```

---

## Tablas

### usuarios

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Identificador único |
| nombre | VARCHAR(100) | NOT NULL | Nombre completo |
| email | VARCHAR(150) | NOT NULL, UNIQUE | Email de acceso |
| contraseña_hash | VARCHAR(255) | NOT NULL | Hash bcrypt (costo 10) |
| rol | ENUM('superusuario','usuario') | NOT NULL, DEFAULT 'usuario' | Rol en el sistema |
| fecha_creacion | DATETIME | DEFAULT CURRENT_TIMESTAMP | Fecha de registro |

### items

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Identificador único |
| nombre | VARCHAR(150) | NOT NULL | Nombre del material |
| categoria | VARCHAR(80) | NOT NULL | Categoría (ej: Sensores, Herramientas) |
| cantidad | INT | NOT NULL, DEFAULT 1, CHECK >= 0 | Unidades disponibles |
| estado | ENUM('disponible','en_uso','dañado','de_baja') | NOT NULL, DEFAULT 'disponible' | Estado actual |
| observaciones | TEXT | NULLABLE | Notas adicionales |
| foto_url | VARCHAR(255) | NULLABLE | Ruta relativa a la imagen |
| ubicacion | VARCHAR(100) | NOT NULL | Lugar físico en el taller |
| codigo_escaneable | VARCHAR(50) | NOT NULL, UNIQUE | Código para QR/barras |
| fecha_creacion | DATETIME | DEFAULT CURRENT_TIMESTAMP | Fecha de alta |

### movimientos

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Identificador único |
| id_item | INT | NOT NULL, FK → items(id) | Ítem retirado/devuelto |
| id_usuario | INT | NOT NULL, FK → usuarios(id) | Quién realizó la acción |
| tipo | ENUM('retiro','devolucion') | NOT NULL | Tipo de movimiento |
| fecha_hora | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Momento del movimiento |
| codigo_escaneado | VARCHAR(50) | NULLABLE | Código leído (si se usó escaneo) |
| devuelto | BOOLEAN | NOT NULL, DEFAULT FALSE | Solo aplica si tipo='retiro' |

> **Nota para PMV:** No hay tabla `alertas`. Las alertas se calculan "al vuelo" consultando movimientos con tipo='retiro', devuelto=false y fecha_hora > 7 días. Esto evita dead schema y simplifica el mantenimiento.

---

## Índices

| Tabla | Índice | Columnas | Propósito |
|---|---|---|---|
| items | idx_items_categoria | categoria | Filtrado rápido por categoría |
| items | idx_items_estado | estado | Filtrado rápido por estado |
| movimientos | idx_movimientos_item | id_item | Búsqueda de movimientos de un ítem |
| movimientos | idx_movimientos_fecha | fecha_hora | Ordenamiento por fecha |
| movimientos | idx_movimientos_usuario | id_usuario | Búsqueda por usuario |
| usuarios | idx_usuarios_email | email | Búsqueda de login (ya es UNIQUE) |

---

## Transacciones

### Retiro de ítem (transacción atómica)

```sql
START TRANSACTION;
  -- 1. Verificar que el item existe, cantidad > 0 y estado = 'disponible'
  SELECT cantidad, estado FROM items WHERE id = ? FOR UPDATE;
  -- 2. Descontar 1 unidad
  UPDATE items SET cantidad = cantidad - 1 WHERE id = ?;
  -- 3. Si cantidad llega a 0, cambiar estado a 'en_uso'
  UPDATE items SET estado = 'en_uso' WHERE id = ? AND cantidad = 0;
  -- 4. Insertar movimiento
  INSERT INTO movimientos (id_item, id_usuario, tipo, codigo_escaneado)
  VALUES (?, ?, 'retiro', ?);
COMMIT;
```

### Devolución de ítem (transacción atómica)

```sql
START TRANSACTION;
  -- 1. Verificar ownership: el movimiento pertenece al usuario
  SELECT id_usuario FROM movimientos WHERE id = ? AND tipo = 'retiro' AND devuelto = FALSE FOR UPDATE;
  -- 2. Marcar movimiento como devuelto
  UPDATE movimientos SET devuelto = TRUE WHERE id = ?;
  -- 3. Sumar 1 unidad
  UPDATE items SET cantidad = cantidad + 1 WHERE id = ?;
  -- 4. Si estaba 'en_uso' y ahora cantidad > 0, volver a 'disponible'
  UPDATE items SET estado = 'disponible' WHERE id = ? AND estado = 'en_uso' AND cantidad > 0;
  -- 5. Si existe un movimiento asociado con fecha > 7 días, resolver implícitamente
  -- (no requiere acción adicional: la alerta se calcula al vuelo)
COMMIT;
```

---

## Datos de Seed (Demo)

### Usuarios de prueba
- **admin@ticstock.edu** / admin123 (superusuario)
- **docente@taller.edu** / admin123 (superusuario)
- **alumno1@estudiante.edu** / admin123 (usuario)
- **alumno2@estudiante.edu** / admin123 (usuario)
- **alumno3@estudiante.edu** / admin123 (usuario)

### Ítems de ejemplo (15-20)
Kits Arduino, multímetros, protoboards, sensores ultrasónicos, cables jumper, soldadores, osciloscopios, fuentes, motores paso a paso, displays LCD, resistencias, capacitores, LEDs, breadboards, etc.

### Movimientos históricos
- 6-8 movimientos ya registrados
- 1-2 retiros sin devolver con fecha > 7 días (para que haya alertas visibles en demo)
