# Script para subir el proyecto a GitHub
# Ejecutar en PowerShell: .\subir_a_github.ps1

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   SUBIR PROYECTO BARBEREZ A GITHUB" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Configurar Git (si no está configurado)
Write-Host "Paso 1: Configurar Git" -ForegroundColor Yellow
Write-Host ""

$gitUserName = git config --global user.name
if ([string]::IsNullOrWhiteSpace($gitUserName)) {
    $userName = Read-Host "Ingresa tu nombre de usuario de GitHub (ejemplo: isKarTuX)"
    git config --global user.name "$userName"
    Write-Host "Nombre configurado: $userName" -ForegroundColor Green
} else {
    Write-Host "Git ya esta configurado con el nombre: $gitUserName" -ForegroundColor Green
}

$gitUserEmail = git config --global user.email
if ([string]::IsNullOrWhiteSpace($gitUserEmail)) {
    $userEmail = Read-Host "Ingresa tu email de GitHub"
    git config --global user.email "$userEmail"
    Write-Host "Email configurado: $userEmail" -ForegroundColor Green
} else {
    Write-Host "Git ya esta configurado con el email: $gitUserEmail" -ForegroundColor Green
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Paso 2: Crear Repositorio en GitHub" -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Antes de continuar, necesitas crear el repositorio en GitHub:" -ForegroundColor White
Write-Host "1. Ve a: https://github.com/new" -ForegroundColor White
Write-Host "2. Nombre del repo: BarberEz-Proyect" -ForegroundColor White
Write-Host "3. Descripcion: Sistema completo de gestion de barberia" -ForegroundColor White
Write-Host "4. Selecciona: Public" -ForegroundColor White
Write-Host "5. NO marques 'Initialize with README'" -ForegroundColor White
Write-Host "6. Click en 'Create repository'" -ForegroundColor White
Write-Host ""

$continuar = Read-Host "Ya creaste el repositorio en GitHub? (S/N)"

if ($continuar -ne "S" -and $continuar -ne "s") {
    Write-Host "Cancelando... Crea el repositorio y vuelve a ejecutar este script." -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Paso 3: Conectar con GitHub" -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

$repoUrl = Read-Host "Pega la URL de tu repositorio (ejemplo: https://github.com/isKarTuX/BarberEz-Proyect.git)"

# Verificar si ya existe el remote
$remoteExists = git remote get-url origin 2>$null
if ($remoteExists) {
    Write-Host "Remote 'origin' ya existe. Actualizando URL..." -ForegroundColor Yellow
    git remote set-url origin $repoUrl
} else {
    git remote add origin $repoUrl
}

Write-Host "Remote configurado: $repoUrl" -ForegroundColor Green

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Paso 4: Subir a GitHub" -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Renombrar rama a main
git branch -M main
Write-Host "Rama renombrada a 'main'" -ForegroundColor Green

Write-Host ""
Write-Host "Subiendo el proyecto a GitHub..." -ForegroundColor Yellow
Write-Host "Te pedira autenticacion:" -ForegroundColor Yellow
Write-Host "   - Usuario: tu_usuario_github" -ForegroundColor White
Write-Host "   - Contrasena: Personal Access Token (NO tu contrasena)" -ForegroundColor White
Write-Host ""
Write-Host "Para crear un token:" -ForegroundColor White
Write-Host "https://github.com/settings/tokens/new" -ForegroundColor Cyan
Write-Host "Selecciona scope: repo (completo)" -ForegroundColor White
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host "   PROYECTO SUBIDO EXITOSAMENTE!" -ForegroundColor Green
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Tu proyecto ya esta en GitHub:" -ForegroundColor Green
    Write-Host "   $repoUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Proximos pasos:" -ForegroundColor Yellow
    Write-Host "   1. Ve a tu repositorio en GitHub" -ForegroundColor White
    Write-Host "   2. Verifica que todos los archivos esten ahi" -ForegroundColor White
    Write-Host "   3. Lee el README.md para instrucciones" -ForegroundColor White
    Write-Host "   4. Comparte el enlace con otros" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Error al subir. Posibles causas:" -ForegroundColor Red
    Write-Host "   1. Autenticacion incorrecta - Usa Personal Access Token" -ForegroundColor White
    Write-Host "   2. URL del repositorio incorrecta" -ForegroundColor White
    Write-Host "   3. El repositorio ya tiene contenido" -ForegroundColor White
    Write-Host ""
    Write-Host "Intenta de nuevo o consulta GUIA_GITHUB.md" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Presiona Enter para salir..."
Read-Host

