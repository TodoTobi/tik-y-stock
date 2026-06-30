# Requisitos — TIC & Stock

> Priorización basada en el sprint de 3 días para la muestra escolar.
> Features ordenadas por criticidad.

---

## Features Priorizadas (PMV)

| Prioridad | Feature | Descripción | Depende de | Estado |
|---|---|---|---|---|
| **P0** | F1 - Base de datos | Esquema MySQL, tablas, índices, pool de conexiones | — | ✅ Incluido |
| **P0** | F2 - Autenticación | Login, registro, sesiones, roles (superusuario/usuario) | F1 | ✅ Incluido |
| **P0** | F3 - CRUD inventario | Alta/baja/modificación/consulta de ítems con foto | F1, F2 | ✅ Incluido |
| **P1** | F4 - Catálogo tiempo real | Vista alumno: disponibilidad actualizada al instante | F3 | ✅ Incluido |
| **P1** | F5 - Movimientos | Retiro y devolución de ítems, historial, trazabilidad | F1, F2, F3 | ✅ Incluido |
| **P1** | F6 - Escaneo QR/Barras | Lectura desde cámara + input manual + etiquetas | F3, F5 | ✅ Incluido |
| **P2** | F7 - Alertas | Detección de devoluciones vencidas (+7 días) | F5 | ✅ Incluido (simplificado) |
| **P2** | F9 - Dashboard admin | Resumen ejecutivo con métricas clave | F3, F5, F7 | ❌ Excluido (ver BACKLOG_FUTURO) |
| **P3** | F10 - Página institucional | Info del proyecto y equipo | — | ⬜ Si sobra tiempo |
| **P3** | F8 - Reservas/Compras | Solicitudes de compra y reservas | F5 | ❌ Excluido de 3 días |

---

## Requisitos Funcionales (RF)

### RF-01: Autenticación de usuarios
- El sistema debe permitir registro de nuevos usuarios (rol 'usuario' por defecto)
- El sistema debe permitir login con email y contraseña
- El sistema debe mantener sesión activa con expiración por inactividad (30 min)
- El sistema debe redirigir según rol: admin → /admin/movimientos.html, usuario → /usuario/catalogo.html
- Criterio de aceptación: un usuario con credenciales válidas accede al sistema en < 3 segundos

### RF-02: Gestión de inventario
- El superusuario debe poder crear, leer, editar y eliminar ítems
- Cada ítem tiene: nombre, categoría, cantidad, estado, ubicación, foto, código escaneable
- El sistema debe validar que no se pueda eliminar un ítem con préstamos activos
- Criterio de aceptación: crear/editar un ítem no toma más de 30 segundos

### RF-03: Consulta de disponibilidad
- Cualquier usuario autenticado debe poder ver el catálogo completo
- El catálogo debe mostrar disponibilidad actualizada (cantidad y estado)
- Debe permitir filtrar por categoría, estado y búsqueda por nombre
- Criterio de aceptación: un alumno obtiene la disponibilidad de un ítem en < 5 segundos y 2 clics

### RF-04: Retiro y devolución de materiales
- Un usuario puede retirar un ítem disponible (descuenta 1 unidad)
- Un usuario puede devolver un ítem que retiró (suma 1 unidad)
- El sistema registra trazabilidad: quién, qué, cuándo
- El retiro/devolución debe ser transaccional (consistencia ante concurrencia)
- Criterio de aceptación: al confirmar un retiro, el cambio se refleja en catálogo en < 2 segundos

### RF-05: Escaneo de códigos
- El sistema debe leer códigos QR y de barras desde la cámara del dispositivo
- Debe tener un input manual como alternativa cuando la cámara no esté disponible
- Al escanear, debe mostrar el ítem detectado y permitir retiro/devolución inmediata
- El usuario debe recibir feedback visual claro después de cada acción
- Criterio de aceptación: escanear + confirmar acción toma < 10 segundos

### RF-06: Alertas por devolución vencida
- El sistema debe detectar retiros no devueltos después de 7 días
- El superusuario debe poder ver y resolver alertas
- Criterio de aceptación: las alertas se generan sin proceso en background, al consultar

---

## Requisitos No Funcionales (RNF)

### RNF-01: Rendimiento
- Las páginas deben cargar en menos de 3 segundos en la red local del taller
- Las consultas a la API deben responder en menos de 500ms
- El sistema debe soportar al menos 10 usuarios concurrentes

### RNF-02: Seguridad
- Las contraseñas deben almacenarse hasheadas con bcrypt (costo 10)
- Todas las consultas SQL deben ser parametrizadas (no concatenación)
- Las sesiones deben expirar por inactividad a los 30 minutos
- Las rutas de administración deben validar rol de superusuario
- No exponer stack traces en producción

### RNF-03: Usabilidad
- La interfaz debe poder usarse en menos de 30 segundos para la tarea principal
- Máximo 2 clics para llegar a cualquier función principal
- Mensajes de error claros y específicos (no genéricos)
- Feedback inmediato en acciones críticas (retiro/devolución)

### RNF-04: Mantenibilidad
- Código organizado en 3 capas (rutas/controladores/services)
- Formato de respuesta JSON consistente en toda la API
- Comentarios mínimos, código auto-documentado

### RNF-05: Disponibilidad
- El sistema debe funcionar completamente sin conexión a internet
- Debe correr en la red Wi-Fi del taller (localhost accesible por IP local)

### RNF-06: Compatibilidad
- Debe funcionar en Chrome y Firefox (versiones recientes)
- Diseño responsive básico para dispositivos móviles
- Sin dependencias de frameworks frontend (React, Vue, etc.)

---

## Roles de Usuario

| Rol | Permisos |
|---|---|
| **superusuario** | CRUD ítems, ver movimientos de todos, ver/resolver alertas |
| **usuario** | Ver catálogo, escanear, retirar/devolver, ver sus propios préstamos activos |
