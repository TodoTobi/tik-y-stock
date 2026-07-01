# Google Stitch MCP Setup for TIC & Stock
# Ejecutar en PowerShell como Administrador

Write-Host "=== Google Stitch MCP Setup ===" -ForegroundColor Cyan

# 1. Verificar gcloud CLI
$gcloud = Get-Command "gcloud" -ErrorAction SilentlyContinue
if (-not $gcloud) {
    Write-Host "[1/5] Instalando Google Cloud CLI..." -ForegroundColor Yellow
    $installer = "$env:TEMP\gcloud-installer.ps1"
    Invoke-WebRequest -Uri "https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe" -OutFile "$env:TEMP\gcloud-installer.exe"
    Start-Process -Wait -FilePath "$env:TEMP\gcloud-installer.exe" -ArgumentList "/S"
    Write-Host "Reiniciá la terminal después de la instalación." -ForegroundColor Green
    exit
}

Write-Host "[1/5] gcloud CLI detectado ✅" -ForegroundColor Green

# 2. Autenticación
Write-Host "[2/5] Autenticando con Google Cloud..." -ForegroundColor Yellow
gcloud auth login
gcloud auth application-default login

# 3. Configurar proyecto
$project = Read-Host "Ingresá tu Project ID de Google Cloud"
gcloud config set project $project
gcloud auth application-default set-quota-project $project

# 4. Habilitar Stitch API
Write-Host "[4/5] Habilitando Stitch API..." -ForegroundColor Yellow
gcloud beta services mcp enable stitch.googleapis.com --project=$project

# 5. Configurar MCP para Claude Code
Write-Host "[5/5] Configurando MCP para Claude Code..." -ForegroundColor Yellow
$mcpDir = "$env:USERPROFILE\.claude"
$mcpConfig = @{
    mcpServers = @{
        stitch = @{
            command = "npx"
            args = @("-y", "@_davideast/stitch-mcp@latest", "proxy")
            env = @{
                GOOGLE_CLOUD_PROJECT = $project
            }
        }
    }
}

if (-not (Test-Path $mcpDir)) {
    New-Item -ItemType Directory -Path $mcpDir -Force
}

$mcpConfig | ConvertTo-Json -Depth 10 | Set-Content "$mcpDir\mcp_servers.json"
Write-Host "Config MCP creada en: $mcpDir\mcp_servers.json ✅" -ForegroundColor Green

Write-Host "`n=== SETUP COMPLETADO ===" -ForegroundColor Green
Write-Host "Ahora reiniciá Claude Code y preguntale: 'what tools do you have access to?'" -ForegroundColor Cyan
