# ✅ CHECKLIST - Antes de Subir a GitHub

## Pre-requisitos
- [ ] Tengo cuenta en GitHub (https://github.com/isKarTuX)
- [ ] Tengo Git instalado en mi computadora
- [ ] Estoy en la carpeta del proyecto en PowerShell

## Paso 1: Crear Repositorio en GitHub
- [ ] Entré a https://github.com/new
- [ ] Nombre del repositorio: `BarberEz-Proyect`
- [ ] Descripción: "Sistema completo de gestión de barbería con React, Node.js y MySQL"
- [ ] Seleccioné: **Public**
- [ ] **NO marqué** "Initialize this repository with a README"
- [ ] Hice click en **"Create repository"**
- [ ] Copié la URL del repositorio (ejemplo: https://github.com/isKarTuX/BarberEz-Proyect.git)

## Paso 2: Obtener Personal Access Token
- [ ] Entré a https://github.com/settings/tokens/new
- [ ] Note: "BarberEz Deploy"
- [ ] Expiration: 90 days o más
- [ ] Scope: marqué **"repo"** (todas las opciones de repo)
- [ ] Hice click en "Generate token"
- [ ] **COPIÉ Y GUARDÉ EL TOKEN** en un lugar seguro

## Paso 3: Ejecutar Script de Subida
- [ ] Abrí PowerShell en la carpeta del proyecto
- [ ] Ejecuté: `.\subir_a_github.ps1`
- [ ] Ingresé mi nombre de usuario de GitHub cuando me lo pidió
- [ ] Ingresé mi email de GitHub cuando me lo pidió
- [ ] Confirmé que creé el repositorio en GitHub
- [ ] Pegué la URL del repositorio
- [ ] Cuando me pidió la contraseña, pegué el **Personal Access Token**

## Paso 4: Verificar
- [ ] Entré a mi repositorio en GitHub
- [ ] Veo todos los archivos
- [ ] Veo el README.md en la página principal
- [ ] Los archivos .env NO están (protegidos por .gitignore)
- [ ] La carpeta node_modules NO está
- [ ] Todo se ve bien ✅

## Compartir con Otros
- [ ] Compartí la URL: https://github.com/isKarTuX/BarberEz-Proyect
- [ ] Les indiqué que sigan el README.md para instalar

## ¿Problemas?

### Error de autenticación
- ❌ Estoy usando mi contraseña normal
- ✅ Debo usar el Personal Access Token

### Error "remote already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/TU_USUARIO/BarberEz-Proyect.git
```

### Error "repository not found"
- Verifica que la URL esté correcta
- Verifica que el repositorio exista en GitHub

### Otros errores
- Lee GUIA_GITHUB.md
- Revisa los mensajes de error
- Intenta de nuevo paso a paso

---

## 🎉 ¡LISTO!

Una vez que todos los checkboxes estén marcados, tu proyecto estará en GitHub y cualquiera podrá clonarlo y usarlo.

## 📞 Siguiente: Compartir

Puedes compartir:
```
¡Mira mi proyecto! 🚀
Sistema de gestión de barbería BarberEz
https://github.com/isKarTuX/BarberEz-Proyect

Stack: React + Node.js + MySQL
- Dashboard de administrador
- Panel de barberos
- Reserva de citas
- Sistema de notificaciones

Para instalar, seguir las instrucciones del README.md
```

