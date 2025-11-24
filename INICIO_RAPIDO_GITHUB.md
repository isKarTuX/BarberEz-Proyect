# 🚀 INICIO RÁPIDO - Subir a GitHub

## Ya está todo preparado. Solo sigue estos pasos:

### 1️⃣ Ejecuta el Script Automatizado

```powershell
.\subir_a_github.ps1
```

El script te guiará paso a paso.

### 2️⃣ O Sigue Estos Pasos Manuales

**A. Crea el repositorio en GitHub:**
- Ve a: https://github.com/new
- Nombre: `BarberEz-Proyect`
- Tipo: Public
- NO marcar "Initialize with README"
- Copia la URL del repositorio

**B. Ejecuta estos comandos:**

```powershell
# Configura Git (primera vez)
git config --global user.name "tu_usuario"
git config --global user.email "tu@email.com"

# Conecta con GitHub (reemplaza con TU URL)
git remote add origin https://github.com/TU_USUARIO/BarberEz-Proyect.git

# Sube el proyecto
git branch -M main
git push -u origin main
```

**C. Cuando pida contraseña:**
- Crea un Personal Access Token en: https://github.com/settings/tokens/new
- Scope: marca "repo"
- Usa el token como contraseña

---

## 📚 Más Ayuda

- **CHECKLIST.md** - Lista de verificación paso a paso
- **GUIA_GITHUB.md** - Guía detallada
- **README.md** - Documentación completa del proyecto

---

## ✅ Estado Actual

- ✅ 158 archivos listos para subir
- ✅ 3 commits realizados
- ✅ Documentación completa
- ✅ Base de datos incluida
- ✅ Variables de entorno protegidas

Solo falta subirlo a GitHub! 🚀

