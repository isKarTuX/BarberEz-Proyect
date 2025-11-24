# Script para cambiar logos del frontend
# Uso: .\cambiar_logos.ps1 -LogoPrincipal "ruta\logo.png" -LogoIcono "ruta\icono.png"

param(
    [string]$LogoPrincipal,
    [string]$LogoIcono,
    [string]$Favicon
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CAMBIAR LOGOS DE BARBEREZ" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Crear carpeta de imágenes
$imagesDir = "barberez-web\frontend\public\images"
Write-Host "Paso 1: Crear carpeta de imagenes..." -ForegroundColor Yellow

if (!(Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Path $imagesDir -Force | Out-Null
    Write-Host "Carpeta de imagenes creada: $imagesDir" -ForegroundColor Green
} else {
    Write-Host "Carpeta ya existe: $imagesDir" -ForegroundColor Green
}

Write-Host ""

# Copiar logo principal
if ($LogoPrincipal) {
    Write-Host "Paso 2: Copiar logo principal..." -ForegroundColor Yellow
    if (Test-Path $LogoPrincipal) {
        Copy-Item $LogoPrincipal "$imagesDir\logo.png" -Force
        Write-Host "Logo principal copiado: logo.png" -ForegroundColor Green
    } else {
        Write-Host "ERROR: No se encontro el archivo: $LogoPrincipal" -ForegroundColor Red
    }
} else {
    Write-Host "Paso 2: Logo principal no especificado (omitido)" -ForegroundColor Yellow
}

Write-Host ""

# Copiar logo icono
if ($LogoIcono) {
    Write-Host "Paso 3: Copiar logo icono..." -ForegroundColor Yellow
    if (Test-Path $LogoIcono) {
        Copy-Item $LogoIcono "$imagesDir\logo-icon.png" -Force
        Write-Host "Logo icono copiado: logo-icon.png" -ForegroundColor Green
    } else {
        Write-Host "ERROR: No se encontro el archivo: $LogoIcono" -ForegroundColor Red
    }
} else {
    Write-Host "Paso 3: Logo icono no especificado (omitido)" -ForegroundColor Yellow
}

Write-Host ""

# Copiar favicon
if ($Favicon) {
    Write-Host "Paso 4: Copiar favicon..." -ForegroundColor Yellow
    if (Test-Path $Favicon) {
        Copy-Item $Favicon "barberez-web\frontend\public\favicon.ico" -Force
        Write-Host "Favicon copiado: favicon.ico" -ForegroundColor Green
    } else {
        Write-Host "ERROR: No se encontro el archivo: $Favicon" -ForegroundColor Red
    }
} else {
    Write-Host "Paso 4: Favicon no especificado (omitido)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RESUMEN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Listar archivos copiados
Write-Host "Archivos en la carpeta de imagenes:" -ForegroundColor Yellow
if (Test-Path $imagesDir) {
    Get-ChildItem $imagesDir | ForEach-Object {
        Write-Host "  - $($_.Name)" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "SIGUIENTE PASO:" -ForegroundColor Yellow
Write-Host "1. Abre GUIA_CAMBIAR_LOGOS.md" -ForegroundColor White
Write-Host "2. Sigue los pasos para actualizar los componentes .jsx" -ForegroundColor White
Write-Host "3. Reemplaza los iconos con las etiquetas <img>" -ForegroundColor White
Write-Host ""
Write-Host "Para probar:" -ForegroundColor Yellow
Write-Host "  cd barberez-web\frontend" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Proceso completado!" -ForegroundColor Green

Write-Host ""
Write-Host "Presiona Enter para salir..."
Read-Host

