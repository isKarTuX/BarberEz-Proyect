# Script PowerShell para crear la base de datos automáticamente
Write-Host "🔧 CONFIGURANDO BASE DE DATOS..." -ForegroundColor Cyan
Write-Host ""

# Configuración
$sqlFile = "CREAR_BASE_DATOS.sql"
$mysqlPath = "mysql"  # Cambiar si MySQL no está en PATH

# Verificar que existe el archivo SQL
if (-not (Test-Path $sqlFile)) {
    Write-Host "❌ ERROR: No se encuentra el archivo $sqlFile" -ForegroundColor Red
    exit 1
}

Write-Host "📄 Archivo SQL encontrado: $sqlFile" -ForegroundColor Green
Write-Host ""

# Pedir credenciales
Write-Host "Ingresa tus credenciales de MySQL:" -ForegroundColor Yellow
$usuario = Read-Host "Usuario de MySQL (default: root)"
if ([string]::IsNullOrWhiteSpace($usuario)) {
    $usuario = "root"
}

$securePassword = Read-Host "Contraseña de MySQL" -AsSecureString
$password = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
)

Write-Host ""
Write-Host "🚀 Ejecutando script SQL..." -ForegroundColor Cyan

try {
    # Ejecutar el script SQL
    $env:MYSQL_PWD = $password
    & $mysqlPath -u $usuario --default-character-set=utf8mb4 < $sqlFile 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ ¡BASE DE DATOS CREADA EXITOSAMENTE!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Credenciales de prueba:" -ForegroundColor Cyan
        Write-Host "   Admin:   admin@barberez.com / admin123" -ForegroundColor White
        Write-Host "   Barbero: barbero@barberez.com / barbero123" -ForegroundColor White
        Write-Host "   Cliente: cliente@barberez.com / cliente123" -ForegroundColor White
        Write-Host ""
        Write-Host "🎯 Ahora puedes iniciar el servidor con: node server.js" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Error al ejecutar el script SQL" -ForegroundColor Red
        Write-Host "Verifica tus credenciales y que MySQL esté corriendo" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ ERROR: $_" -ForegroundColor Red
} finally {
    $env:MYSQL_PWD = $null
}

Write-Host ""
Read-Host "Presiona Enter para salir"
