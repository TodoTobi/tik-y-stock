# Backlog Futuro — Post-PMV

> Features excluidas del sprint de 3 días para mantener el alcance del PMV.
> Se pueden implementar después de la muestra escolar.

## Pendientes priorizados

| Prioridad | Feature | Descripción | Depende de | Tiempo estimado |
|---|---|---|---|---|
| P1 | **Dashboard admin (F9)** | Cards con métricas: total items, disponibles, movs hoy, alertas + listas de últimas alertas y últimos movs | F3, F5 | ~3-4h |
| P1 | **Alertas con tabla propia (F7)** | Migrar de cálculo al vuelo a tabla `alertas` con trigger/event scheduler | F5 | ~2h |
| P2 | **Página institucional (F10)** | Página estática con info del proyecto, equipo, escuela | — | ~1h |
| P2 | **Generación de etiquetas QR** | Script `scripts/generar-etiquetas.js` que produce HTML imprimible con QR por item | F3 | ~2h |
| P3 | **Solicitudes de compra (F8)** | Sistema de reservas y solicitudes de compra de materiales | F5 | ~8h+ |
| P3 | **Modo oscuro** | Toggle de tema claro/oscuro en el frontend | — | ~1h |
| P3 | **Historial de alertas resueltas** | Vista de alertas históricas (ya resueltas) con filtro de fecha | F7 | ~1h |

## No planificado (ideas)

- Exportar inventario a CSV/PDF
- Notificaciones por email para devoluciones vencidas
- App mobile nativa (vs responsive web)
- Integración con Moodle/classroom del aula
