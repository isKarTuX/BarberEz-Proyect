# Script para reiniciar el backend (soluciona el rate limiter)
# Uso: .\reiniciar_backend.ps1

Write-Host "🔄 Reiniciando backend..." -ForegroundColor Cyan

# Navegar a la carpeta del backend
$backendPath = Join-Path $PSScriptRoot "barberez-web\backend"

if (Test-Path $backendPath) {
    Set-Location $backendPath

    # Matar procesos de node (backend)
    Write-Host "🛑 Deteniendo procesos Node.js..." -ForegroundColor Yellow
    Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2

    Write-Host "✅ Procesos detenidos" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Para iniciar el backend nuevamente, ejecuta:" -ForegroundColor Cyan
    Write-Host "   cd barberez-web\backend" -ForegroundColor White
    Write-Host "   npm start" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Tip: El rate limiter se habrá reseteado" -ForegroundColor Green
} else {
    Write-Host "❌ Error: No se encontró la carpeta backend" -ForegroundColor Red
    Write-Host "   Ruta esperada: $backendPath" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

