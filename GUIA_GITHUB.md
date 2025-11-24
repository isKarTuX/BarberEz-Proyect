# 📤 Guía para Subir el Proyecto a GitHub

## ✅ Estado Actual
Tu proyecto ya está preparado y commitado localmente. Ahora solo necesitas subirlo a GitHub.

## 🚀 Pasos para Subir a GitHub

### 1️⃣ Crear el Repositorio en GitHub

1. **Ve a GitHub**: https://github.com
2. **Inicia sesión** con tu cuenta (isKarTuX)
3. **Crea un nuevo repositorio**:
   - Click en el botón **"+"** en la esquina superior derecha
   - Selecciona **"New repository"**
   
4. **Configura el repositorio**:
   - **Repository name**: `BarberEz-Proyect` (o el nombre que prefieras)
   - **Description**: "Sistema completo de gestión de barbería con React, Node.js y MySQL"
   - **Visibility**: Selecciona **Public** (para que otros puedan verlo y clonarlo)
   - **NO marques** "Initialize this repository with a README" (ya tienes uno)
   - Click en **"Create repository"**

### 2️⃣ Conectar tu Repositorio Local con GitHub

Después de crear el repositorio, GitHub te mostrará una página con comandos. Copia la URL de tu repositorio (algo como: `https://github.com/isKarTuX/BarberEz-Proyect.git`)

Luego ejecuta estos comandos en tu terminal PowerShell (ya estás en la carpeta correcta):

```powershell
# Configura el remote (reemplaza con TU URL)
git remote add origin https://github.com/isKarTuX/BarberEz-Proyect.git

# Renombra la rama principal a 'main' (estándar de GitHub)
git branch -M main

# Sube el código a GitHub
git push -u origin main
```

### 3️⃣ Autenticación en GitHub

Cuando ejecutes `git push`, GitHub te pedirá autenticación:

#### Opción A: Personal Access Token (Recomendado)
1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click en "Generate new token (classic)"
3. Dale un nombre como "BarberEz Deploy"
4. Selecciona scope: **repo** (todo)
5. Click "Generate token"
6. **COPIA EL TOKEN** (solo se muestra una vez)
7. En el prompt de la terminal, pega el token como contraseña

#### Opción B: GitHub CLI
```powershell
# Instalar GitHub CLI
winget install --id GitHub.cli

# Autenticar
gh auth login
```

### 4️⃣ Verificar que se Subió Correctamente

1. Ve a tu repositorio en GitHub: `https://github.com/isKarTuX/BarberEz-Proyect`
2. Deberías ver todos tus archivos
3. El README.md se mostrará automáticamente en la página principal

## 📋 Comandos Completos (Copia y Ejecuta)

```powershell
# 1. Agregar el remote (REEMPLAZA CON TU URL)
git remote add origin https://github.com/TU_USUARIO/BarberEz-Proyect.git

# 2. Renombrar rama a main
git branch -M main

# 3. Subir a GitHub
git push -u origin main
```

## 🔄 Para Futuros Cambios

Cuando hagas cambios en el proyecto:

```powershell
# 1. Ver qué cambió
git status

# 2. Agregar los cambios
git add .

# 3. Hacer commit con mensaje descriptivo
git commit -m "Descripción de los cambios"

# 4. Subir a GitHub
git push
```

## 👥 Para que Otra Persona Clone el Proyecto

Comparte esta URL con otros desarrolladores:

```powershell
# Clonar el proyecto
git clone https://github.com/TU_USUARIO/BarberEz-Proyect.git

# Entrar a la carpeta
cd BarberEz-Proyect

# Leer las instrucciones
# Seguir los pasos en README.md para instalar y ejecutar
```

## 📚 Archivos Importantes Creados

✅ **README.md** - Documentación principal del proyecto
✅ **.gitignore** - Archivos que Git debe ignorar (node_modules, .env, etc.)
✅ **LICENSE** - Licencia MIT
✅ **DEPLOYMENT.md** - Guía de despliegue en producción
✅ **db/schema.sql** - Estructura completa de la base de datos
✅ **db/datos_prueba.sql** - Datos de ejemplo para testing
✅ **.env.example** - Plantilla de variables de entorno (backend y frontend)

## 🎯 Siguiente Paso

Después de subir a GitHub, comparte el enlace del repositorio y cualquiera podrá:

1. Ver el código
2. Clonarlo
3. Seguir las instrucciones del README.md para ejecutarlo
4. Contribuir con Pull Requests

## ⚠️ Importante

- **NUNCA** subas archivos `.env` con credenciales reales
- Los archivos `.env` ya están en `.gitignore` (protegidos)
- Solo se suben los `.env.example` como plantillas

## 🆘 ¿Problemas?

Si tienes errores:

1. **Error 403/401**: Problema de autenticación → Usa Personal Access Token
2. **Error "remote already exists"**: Ya configuraste el remote → usa `git remote set-url origin NUEVA_URL`
3. **Error de conflicto**: No debería pasar en el primer push

## 📞 Soporte

Si necesitas ayuda, crea un Issue en el repositorio de GitHub después de subirlo.

---

¡Listo! Sigue los pasos y tu proyecto estará en GitHub en minutos. 🚀

