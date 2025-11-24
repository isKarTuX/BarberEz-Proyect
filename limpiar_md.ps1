# Script para limpiar archivos Markdown innecesarios
# Opcion 1: Limpieza Basica (elimina 31 archivos temporales)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  LIMPIEZA DE ARCHIVOS MARKDOWN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$archivosEliminar = @(
    # En barberez-web/
    "barberez-web\INICIO_RAPIDO.md",
    "barberez-web\LEEME_PRIMERO.md",
    "barberez-web\INSTRUCCIONES_MEJORAS.md",
    "barberez-web\MEJORAS_APLICADAS.md",
    "barberez-web\GUIA_LOGOS.md",
    "barberez-web\GESTION_TECNICA.md",
    "barberez-web\GESTION_IMPLEMENTADA.md",
    "barberez-web\SOLUCION_BARBERO_CONFIRMAR_CITAS.md",
    "barberez-web\RESUMEN_MEJORAS_BARBERO.md",
    "barberez-web\RESUMEN_FINAL.md",
    "barberez-web\RESUMEN_COMPLETO_PROYECTO.md",
    "barberez-web\MODALES_PERSONALIZADOS_COMPLETO.md",
    "barberez-web\MEJORA_FLUJO_CITAS_CONFIRMADAS.md",
    "barberez-web\MEJORAS_TABLA_ADMIN.md",
    "barberez-web\MEJORAS_NUEVAS.md",
    "barberez-web\MEJORAS_FILTROS_BARBERO.md",
    "barberez-web\MEJORAS_CLIENTE_FINAL.md",
    "barberez-web\FILTROS_IMPLEMENTADOS.md",
    "barberez-web\FILTROS_AGREGADOS.md",
    "barberez-web\ESTADO_CONFIRMADA.md",
    "barberez-web\CORRECCIONES_BARBERO_DASHBOARD.md",
    "barberez-web\CORRECCIONES_APLICADAS.md",
    "barberez-web\COMO_EJECUTAR_SQL.md",
    "barberez-web\CAMBIO_TABLA_ANCHO_COMPLETO.md",
    "barberez-web\CAMBIOS_COMPLETADOS_BARBERO.md",
    "barberez-web\CAMBIOS_BARBERO_PENDIENTES.md",
    "barberez-web\CORRECCIONES_GESTION_ADMIN.md",
    "barberez-web\DASHBOARDS_MEJORADOS.md",
    # En subdirectorios
    "barberez-web\frontend\PROBLEMA_RESUELTO.md",
    "barberez-web\backend\ERROR_CORS_SOLUCIONADO.md",
    "barberez-web\frontend\SOLUCION_TAILWIND.md"
)

$eliminados = 0
$noEncontrados = 0

Write-Host "Eliminando archivos temporales..." -ForegroundColor Yellow
Write-Host ""

foreach ($archivo in $archivosEliminar) {
    if (Test-Path $archivo) {
        Remove-Item $archivo -Force
        Write-Host "Eliminado: $archivo" -ForegroundColor Green
        $eliminados++
    } else {
        Write-Host "No encontrado: $archivo" -ForegroundColor DarkGray
        $noEncontrados++
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RESUMEN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Archivos eliminados: $eliminados" -ForegroundColor Green
Write-Host "Archivos no encontrados: $noEncontrados" -ForegroundColor Yellow
Write-Host ""

Write-Host "ARCHIVOS MANTENIDOS:" -ForegroundColor Yellow
Write-Host "  - README.md (raiz)" -ForegroundColor White
Write-Host "  - DEPLOYMENT.md" -ForegroundColor White
Write-Host "  - RAILWAY_GUIA_COMPLETA.md" -ForegroundColor White
Write-Host "  - DESPLIEGUE_COMPLETO.md" -ForegroundColor White
Write-Host "  - COMO_DESPLEGAR.md" -ForegroundColor White
Write-Host "  - GUIA_GITHUB.md" -ForegroundColor White
Write-Host "  - GUIA_CAMBIAR_LOGOS.md" -ForegroundColor White
Write-Host "  - CHECKLIST.md" -ForegroundColor White
Write-Host "  - INICIO_RAPIDO_GITHUB.md" -ForegroundColor White
Write-Host "  - barberez-web/backend/README.md" -ForegroundColor White
Write-Host "  - barberez-web/frontend/README.md" -ForegroundColor White
Write-Host "  - barberez-web/frontend/public/images/README.md" -ForegroundColor White
Write-Host "  - barberez-web/README.md" -ForegroundColor White
Write-Host ""

Write-Host "SIGUIENTE PASO:" -ForegroundColor Yellow
Write-Host "  git add ." -ForegroundColor White
Write-Host "  git commit -m 'Eliminar archivos markdown innecesarios'" -ForegroundColor White
Write-Host "  git push origin main" -ForegroundColor White
Write-Host ""

Write-Host "Limpieza completada!" -ForegroundColor Green
Write-Host ""
Write-Host "Presiona Enter para salir..."
Read-Host

