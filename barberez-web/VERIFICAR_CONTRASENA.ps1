# 🔍 VERIFICAR CREDENCIALES EN LA BASE DE DATOS

Write-Host "🔐 DIAGNÓSTICO: Contraseña Incorrecta" -ForegroundColor Yellow
Write-Host ""
Write-Host "El servidor encontró el usuario 'admin@barberez.com' pero la contraseña no coincide." -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 POSIBLES SOLUCIONES:" -ForegroundColor Green
Write-Host ""
Write-Host "1️⃣  VERIFICA TU CONTRASEÑA ACTUAL" -ForegroundColor White
Write-Host "   Abre MySQL Workbench o phpMyAdmin y ejecuta:" -ForegroundColor Gray
Write-Host "   " -NoNewline
Write-Host "SELECT idUsuario, nombre, correo, contrasena FROM usuario WHERE correo = 'admin@barberez.com';" -ForegroundColor Yellow
Write-Host ""

Write-Host "2️⃣  SI LA CONTRASEÑA ESTÁ EN TEXTO PLANO" -ForegroundColor White
Write-Host "   Por ejemplo: 'admin123' o 'password123'" -ForegroundColor Gray
Write-Host "   - Intenta iniciar sesión con ESA contraseña" -ForegroundColor Gray
Write-Host "   - El sistema la convertirá automáticamente a hash" -ForegroundColor Gray
Write-Host ""

Write-Host "3️⃣  SI LA CONTRASEÑA ESTÁ HASHEADA (bcrypt)" -ForegroundColor White
Write-Host "   Empieza con: `$2a`$10`$..." -ForegroundColor Gray
Write-Host "   - NO puedes ver la contraseña original" -ForegroundColor Gray
Write-Host "   - Necesitas resetearla con este comando en MySQL:" -ForegroundColor Gray
Write-Host ""
Write-Host "   UPDATE usuario SET contrasena = 'admin123' WHERE correo = 'admin@barberez.com';" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Luego inicia sesión con: admin123" -ForegroundColor Gray
Write-Host "   El sistema la hasheará automáticamente" -ForegroundColor Gray
Write-Host ""

Write-Host "4️⃣  RESETEAR CONTRASEÑA RÁPIDO (RECOMENDADO)" -ForegroundColor White
Write-Host "   Copia y pega esto en MySQL Workbench:" -ForegroundColor Gray
Write-Host ""
Write-Host @"
USE barberia_barberez;
UPDATE usuario 
SET contrasena = 'admin123' 
WHERE correo = 'admin@barberez.com';

SELECT 'Contraseña reseteada a: admin123' AS resultado;
"@ -ForegroundColor Yellow
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host "📌 RESUMEN:" -ForegroundColor Cyan
Write-Host "   Correo:     admin@barberez.com" -ForegroundColor White
Write-Host "   Problema:   Contraseña no coincide" -ForegroundColor Red
Write-Host "   Solución:   Verifica/resetea la contraseña en MySQL" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host ""

Read-Host "Presiona Enter para continuar"
