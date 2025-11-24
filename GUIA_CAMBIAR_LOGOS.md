# 🎨 GUÍA: Cómo Cambiar las Imágenes del Logo

## 📍 UBICACIÓN DE LOS LOGOS

Tu proyecto tiene logos en dos lugares diferentes:

### 1️⃣ Frontend Web (React) - BarberEz Web
**Ubicación:** `barberez-web/frontend/`
- 🚫 **Actualmente NO usa imágenes**
- ✅ **Usa iconos de React** (FaCut, Scissors)
- Se pueden reemplazar con imágenes personalizadas

### 2️⃣ Aplicación Java (Desktop)
**Ubicación:** `src/main/java/Imagenes/`
- ✅ `logo.png` - Logo principal
- ✅ `logo_letra.png` - Logo con letras

---

## 🎯 OPCIÓN A: CAMBIAR LOGOS DEL FRONTEND WEB

### Paso 1: Preparar tus Imágenes

**Recomendaciones:**
- **Formato:** PNG con fondo transparente (mejor calidad)
- **Tamaños sugeridos:**
  - Logo pequeño (header): 64x64px o 128x128px
  - Logo grande (login): 256x256px o 512x512px
- **Peso:** Menos de 100KB cada una

**Nombres sugeridos:**
- `logo.png` - Logo principal
- `logo-icon.png` - Icono pequeño (opcional)
- `favicon.ico` - Para pestaña del navegador

### Paso 2: Copiar las Imágenes

```powershell
# Crear carpeta para logos si no existe
New-Item -ItemType Directory -Path "barberez-web\frontend\public\images" -Force

# Copiar tus logos a la carpeta
# Arrastra tus archivos a: barberez-web/frontend/public/images/
```

**Estructura resultante:**
```
barberez-web/frontend/
├── public/
│   ├── images/
│   │   ├── logo.png          ← Tu logo principal
│   │   ├── logo-icon.png     ← Icono pequeño
│   │   └── logo-large.png    ← Logo grande (opcional)
│   ├── vite.svg
│   └── favicon.ico           ← Reemplazar con tu favicon
```

### Paso 3: Actualizar el Componente de Login

**Archivo:** `barberez-web/frontend/src/pages/Login.jsx`

**Buscar esta sección (línea ~68):**
```jsx
<div className="logo-container mx-auto mb-4 animate-fadeIn">
    <Scissors className="w-8 h-8 text-white" strokeWidth={2.5} />
</div>
```

**Reemplazar con:**
```jsx
<div className="mb-4 animate-fadeIn">
    <img 
        src="/images/logo.png" 
        alt="BarberEz Logo" 
        className="w-24 h-24 mx-auto rounded-full shadow-xl border-4 border-white"
    />
</div>
```

### Paso 4: Actualizar el Dashboard del Cliente

**Archivo:** `barberez-web/frontend/src/pages/ClienteDashboard.jsx`

**Buscar (línea ~276):**
```jsx
<div className="logo-container">
    <FaCut className="w-7 h-7 text-white" />
</div>
```

**Reemplazar con:**
```jsx
<div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-lg">
    <img 
        src="/images/logo-icon.png" 
        alt="BarberEz" 
        className="w-full h-full object-cover"
    />
</div>
```

### Paso 5: Actualizar el Dashboard del Barbero

**Archivo:** `barberez-web/frontend/src/pages/BarberoDashboard.jsx`

**Buscar (línea ~414):**
```jsx
<div className="logo-container">
    <FaCut className="w-7 h-7 text-white" />
</div>
```

**Reemplazar con:**
```jsx
<div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-lg">
    <img 
        src="/images/logo-icon.png" 
        alt="BarberEz" 
        className="w-full h-full object-cover"
    />
</div>
```

### Paso 6: Actualizar el Dashboard del Admin

**Archivo:** `barberez-web/frontend/src/pages/AdminDashboardMejorado.jsx`

**Buscar (línea ~178):**
```jsx
<div className="logo-container">
    <Scissors className="w-7 h-7 text-white" />
</div>
```

**Reemplazar con:**
```jsx
<div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-lg">
    <img 
        src="/images/logo-icon.png" 
        alt="BarberEz" 
        className="w-full h-full object-cover"
    />
</div>
```

### Paso 7: Cambiar el Favicon

**Reemplazar:** `barberez-web/frontend/public/vite.svg`

1. Convierte tu logo a `favicon.ico` (32x32px)
   - Usa: https://favicon.io/favicon-converter/
2. Copia `favicon.ico` a `barberez-web/frontend/public/`

**Actualizar:** `barberez-web/frontend/index.html`

```html
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
```

---

## 🎯 OPCIÓN B: CAMBIAR LOGOS DE LA APLICACIÓN JAVA

### Paso 1: Preparar tus Imágenes

**Ubicación:** `src/main/java/Imagenes/`

**Archivos a reemplazar:**
- `logo.png` - Logo principal (recomendado: 256x256px)
- `logo_letra.png` - Logo con texto (recomendado: 512x256px)

### Paso 2: Reemplazar las Imágenes

```powershell
# Opción 1: Renombrar las antiguas (backup)
Rename-Item "src\main\java\Imagenes\logo.png" "logo_old.png"
Rename-Item "src\main\java\Imagenes\logo_letra.png" "logo_letra_old.png"

# Opción 2: Copiar tus nuevas imágenes
# Arrastra tus archivos a: src/main/java/Imagenes/
# Nombres: logo.png y logo_letra.png
```

**IMPORTANTE:** Mantén los mismos nombres de archivo para que la app Java los encuentre automáticamente.

---

## 🚀 MÉTODO RÁPIDO (Script Automatizado)

He creado un script para facilitar el proceso del frontend:

### Script PowerShell:

```powershell
# cambiar_logos.ps1
# Guardar este archivo en la raíz del proyecto

param(
    [string]$LogoPrincipal,
    [string]$LogoIcono
)

Write-Host "🎨 Cambiando logos del frontend..." -ForegroundColor Cyan

# Crear carpeta de imágenes
$imagesDir = "barberez-web\frontend\public\images"
if (!(Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Path $imagesDir -Force
    Write-Host "✅ Carpeta de imágenes creada" -ForegroundColor Green
}

# Copiar logo principal
if ($LogoPrincipal -and (Test-Path $LogoPrincipal)) {
    Copy-Item $LogoPrincipal "$imagesDir\logo.png" -Force
    Write-Host "✅ Logo principal copiado" -ForegroundColor Green
} else {
    Write-Host "⚠️ No se encontró el logo principal" -ForegroundColor Yellow
}

# Copiar logo icono
if ($LogoIcono -and (Test-Path $LogoIcono)) {
    Copy-Item $LogoIcono "$imagesDir\logo-icon.png" -Force
    Write-Host "✅ Logo icono copiado" -ForegroundColor Green
} else {
    Write-Host "⚠️ No se encontró el logo icono" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Siguiente paso:" -ForegroundColor Yellow
Write-Host "   1. Edita los archivos .jsx según la guía" -ForegroundColor White
Write-Host "   2. Reemplaza los iconos <Scissors> y <FaCut> con <img>" -ForegroundColor White
Write-Host ""
Write-Host "✅ Proceso completado" -ForegroundColor Green
```

**Uso:**
```powershell
# Ejecutar desde la raíz del proyecto
.\cambiar_logos.ps1 -LogoPrincipal "C:\ruta\a\tu\logo.png" -LogoIcono "C:\ruta\a\tu\icono.png"
```

---

## 📝 CHECKLIST COMPLETO

### Para Frontend Web:

- [ ] Preparar imágenes en PNG (64x64, 128x128, 256x256)
- [ ] Crear carpeta `barberez-web/frontend/public/images/`
- [ ] Copiar `logo.png` a la carpeta images
- [ ] Copiar `logo-icon.png` a la carpeta images
- [ ] Actualizar `Login.jsx` (línea ~68)
- [ ] Actualizar `ClienteDashboard.jsx` (línea ~276)
- [ ] Actualizar `BarberoDashboard.jsx` (línea ~414)
- [ ] Actualizar `AdminDashboardMejorado.jsx` (línea ~178)
- [ ] Crear y copiar `favicon.ico` a public/
- [ ] Probar en navegador: `npm run dev`

### Para Aplicación Java:

- [ ] Preparar `logo.png` (256x256px)
- [ ] Preparar `logo_letra.png` (512x256px)
- [ ] Hacer backup de logos antiguos
- [ ] Copiar nuevos logos a `src/main/java/Imagenes/`
- [ ] Verificar nombres de archivo exactos
- [ ] Compilar proyecto Java
- [ ] Probar aplicación

---

## 🎨 RECOMENDACIONES DE DISEÑO

### Colores del Proyecto:
```css
Primary: #8B5CF6 (Púrpura)
Secondary: #EC4899 (Rosa)
Accent: #F59E0B (Ámbar)
```

### Sugerencias para el Logo:
- ✅ Usar colores del proyecto
- ✅ Diseño simple y reconocible
- ✅ Fondo transparente para flexibilidad
- ✅ Versión con y sin texto
- ✅ Alta resolución (para pantallas Retina)

### Herramientas Gratuitas:
- **Canva:** https://canva.com (diseño de logos)
- **Remove.bg:** https://remove.bg (quitar fondo)
- **Favicon.io:** https://favicon.io (crear favicon)
- **TinyPNG:** https://tinypng.com (optimizar imágenes)

---

## 🧪 PROBAR LOS CAMBIOS

### Frontend Web:
```powershell
cd barberez-web\frontend
npm run dev
```
Abre: http://localhost:5173

### Aplicación Java:
```powershell
mvn clean package
java -jar target/BarberEz-1.0.jar
```

---

## 🔄 COMMITEAR LOS CAMBIOS

```powershell
# Agregar nuevas imágenes
git add barberez-web/frontend/public/images/
git add src/main/java/Imagenes/

# Agregar cambios en componentes
git add barberez-web/frontend/src/pages/

# Commit
git commit -m "Actualizar logos del proyecto"

# Subir a GitHub
git push origin main
```

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### ❌ La imagen no se muestra
- Verifica la ruta: `/images/logo.png` (con / inicial)
- Verifica que la imagen esté en `public/images/`
- Limpia caché: Ctrl + F5 en el navegador
- Revisa la consola del navegador (F12)

### ❌ La imagen se ve pixelada
- Usa imágenes más grandes (mínimo 256x256)
- Asegúrate de que sean PNG de alta calidad
- No estires imágenes pequeñas

### ❌ El favicon no cambia
- Limpia caché del navegador
- Cierra y abre el navegador
- Verifica que `favicon.ico` esté en `public/`

### ❌ Error en la aplicación Java
- Verifica nombres exactos: `logo.png` y `logo_letra.png`
- Asegúrate de que estén en `src/main/java/Imagenes/`
- Recompila el proyecto: `mvn clean package`

---

## 📞 ARCHIVOS A EDITAR - RESUMEN

| Archivo | Línea | Cambio |
|---------|-------|--------|
| `Login.jsx` | ~68 | Reemplazar `<Scissors>` con `<img>` |
| `ClienteDashboard.jsx` | ~276 | Reemplazar `<FaCut>` con `<img>` |
| `BarberoDashboard.jsx` | ~414 | Reemplazar `<FaCut>` con `<img>` |
| `AdminDashboardMejorado.jsx` | ~178 | Reemplazar `<Scissors>` con `<img>` |
| `index.html` | ~5 | Actualizar favicon |
| Java: `logo.png` | - | Reemplazar archivo |
| Java: `logo_letra.png` | - | Reemplazar archivo |

---

## ✅ RESULTADO FINAL

Después de seguir esta guía:
- ✅ Login mostrará tu logo personalizado
- ✅ Todos los dashboards usarán tu icono
- ✅ Favicon personalizado en el navegador
- ✅ Aplicación Java con tus logos
- ✅ Proyecto más profesional y personalizado

---

¿Necesitas ayuda con algún paso específico? Dime y te ayudo a hacerlo. 🚀

