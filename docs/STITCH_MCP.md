# Google Stitch MCP — Integración con TIC & Stock

> Generá UI profesional para el sistema desde prompts de texto usando Google Stitch + MCP.

## ¿Qué es Google Stitch?

Google Stitch es una herramienta de Google Labs que genera diseños de UI y código frontend a partir de descripciones en lenguaje natural. Con Stitch MCP, Claude Code o Cursor pueden llamar a Stitch directamente desde la terminal.

## Requisitos previos

1. **Node.js 18+** ✅ (ya instalado)
2. **Google Cloud Project** con facturación habilitada
3. **Cuenta en** [stitch.withgoogle.com](https://stitch.withgoogle.com)

## Instalación automática (recomendada)

```bash
# En la raíz del proyecto
npx @_davideast/stitch-mcp init
```

Esto ejecuta un asistente interactivo que:
- Verifica/instala gcloud CLI
- Autentica con Google
- Configura el proyecto
- Activa la API de Stitch
- Configura el MCP client

## Instalación manual

### 1. Autenticar gcloud

```bash
gcloud auth login
gcloud config set project TU_PROJECT_ID
gcloud auth application-default login
gcloud auth application-default set-quota-project TU_PROJECT_ID
```

### 2. Habilitar Stitch API

```bash
gcloud beta services mcp enable stitch.googleapis.com --project=TU_PROJECT_ID
```

### 3. Verificar health

```bash
npx @_davideast/stitch-mcp doctor --verbose
```

## Configurar Claude Code

### Opción A: Claude Desktop

El archivo `claude_desktop_config.json` ya fue creado en:
`%APPDATA%\Claude\claude_desktop_config.json`

Solo reemplazá `TU_PROJECT_ID_AQUI` con tu Project ID real.

### Opción B: Claude Code (CLI)

```bash
claude mcp add -e GOOGLE_CLOUD_PROJECT=TU_PROJECT_ID -s user stitch -- npx -y @_davideast/stitch-mcp proxy
```

### Opción C: Cursor

1. Settings → MCP → Add Server
2. Type: `command`
3. Command: `npx -y @_davideast/stitch-mcp proxy`
4. Environment: `GOOGLE_CLOUD_PROJECT=TU_PROJECT_ID`

## Uso en el proyecto

Una vez conectado, podés pedirle a Claude Code cosas como:

> "Diseñame un dashboard para el admin del sistema de inventario TIC & Stock con cards de métricas (total items, disponibles, en uso, alertas) y una tabla de últimos movimientos. Usá la paleta de colores: #1a1a2e para headers, #2563eb para acentos."

> "Rediseñá la pantalla de escaneo QR para que sea más mobile-friendly, con la cámara ocupando todo el ancho y botones grandes de acción."

> "Generá un formulario de registro de ítems con foto, categoría, y código QR. Estilo industrial/taller."

## Troubleshooting

| Problema | Solución |
|---|---|
| `API keys are not supported` | Usar OAuth, no API key: `gcloud auth application-default login` |
| `.env` file conflicts | Mover/renombrar `.env` temporalmente o usar otro directorio |
| `Server not found` | Usar la ruta completa a npx: `C:\Program Files\nodejs\npx.cmd` |
| `Permission denied` | Verificar facturación habilitada y rol Owner/Editor en GCP |

## Recursos

- [Stitch MCP Official Docs](https://stitch.withgoogle.com/docs/mcp)
- [Stitch MCP GitHub (community)](https://github.com/Kargatharaakash/stitch-mcp)
- [Model Context Protocol](https://modelcontextprotocol.io)
