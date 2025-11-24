# 🎨 GUÍA PARA CAMBIAR LOGOS - BarberEz

## 📂 UBICACIÓN DE LOS LOGOS

Tu proyecto tiene **DOS versiones**: Java (escritorio) y Web. Cada una tiene sus propias carpetas de imágenes.

---

## 🖥️ VERSIÓN JAVA (Desktop)

### Carpeta principal de imágenes:
```
📁 BarberEz-Proyect-master/
└── 📁 src/main/java/Imagenes/
    ├── 🖼️ logo.png ← LOGO PRINCIPAL
    ├── 🖼️ logo_letra.png ← LOGO CON LETRAS
    ├── 🖼️ Barberia.png
    ├── 🖼️ Faro.png
    ├── 🖼️ Tarjeta.png
    ├── 🖼️ ver.png
    ├── 🖼️ ocultar.png
    ├── 📁 Barberos/
    │   └── 🖼️ ingresos.png
    └── 📁 Cliente/
        ├── 🖼️ agenda.png
        ├── 🖼️ historial.png
        └── 🖼️ verCitas.png
```

**Ruta completa:**
```
C:\Users\2005k\Documents\pyvscodee\descargas\BarberEz-Proyect-master\src\main\java\Imagenes\
```

---

## 🌐 VERSIÓN WEB (React)

### Carpetas de imágenes:

#### 1. Para imágenes públicas (favicon, logo principal):
```
📁 barberez-web/frontend/
└── 📁 public/
    └── 🖼️ vite.svg ← Actualmente solo tiene esto
```

**Ruta completa:**
```
C:\Users\2005k\Documents\pyvscodee\descargas\BarberEz-Proyect-master\barberez-web\frontend\public\
```

#### 2. Para imágenes dentro de componentes React:
```
📁 barberez-web/frontend/
└── 📁 src/
    └── 📁 assets/
        └── 🖼️ react.svg ← Actualmente solo tiene esto
```

**Ruta completa:**
```
C:\Users\2005k\Documents\pyvscodee\descargas\BarberEz-Proyect-master\barberez-web\frontend\src\assets\
```

---

## 🎯 CÓMO AGREGAR TUS LOGOS

### Para la versión WEB (React):

#### Paso 1: Agregar logos a la carpeta public
```bash
# Navega a la carpeta
cd C:\Users\2005k\Documents\pyvscodee\descargas\BarberEz-Proyect-master\barberez-web\frontend\public
```

**Copia aquí:**
- `logo.png` - Logo principal (para header, login, etc.)
- `logo-small.png` - Logo pequeño (para navbar comprimida)
- `favicon.ico` - Icono del navegador

#### Paso 2: Agregar imágenes decorativas a assets
```bash
# Navega a la carpeta
cd C:\Users\2005k\Documents\pyvscodee\descargas\BarberEz-Proyect-master\barberez-web\frontend\src\assets
```

**Copia aquí:**
- `barberia.png` - Imagen de fondo
- `hero-banner.jpg` - Banner principal
- Otras imágenes decorativas

---

## 📋 PASOS DETALLADOS PARA CAMBIAR LOGOS

### OPCIÓN 1: Copiar desde el proyecto Java

Si quieres usar los mismos logos del proyecto Java:

```powershell
# Abrir PowerShell en la raíz del proyecto

# Copiar logo principal a public
Copy-Item "src\main\java\Imagenes\logo.png" "barberez-web\frontend\public\logo.png"

# Copiar logo con letras
Copy-Item "src\main\java\Imagenes\logo_letra.png" "barberez-web\frontend\public\logo_letra.png"

# Copiar imagen de barbería
Copy-Item "src\main\java\Imagenes\Barberia.png" "barberez-web\frontend\src\assets\barberia.png"

# Copiar faro
Copy-Item "src\main\java\Imagenes\Faro.png" "barberez-web\frontend\src\assets\faro.png"
```

### OPCIÓN 2: Manualmente

1. **Abre el Explorador de Archivos**
2. **Navega a:** `C:\Users\2005k\Documents\pyvscodee\descargas\BarberEz-Proyect-master\src\main\java\Imagenes\`
3. **Copia los archivos que quieras usar**
4. **Pégalos en:**
   - `barberez-web\frontend\public\` (para logos principales)
   - `barberez-web\frontend\src\assets\` (para imágenes decorativas)

---

## 🖼️ FORMATOS RECOMENDADOS

### Para Logos:
- **Formato:** PNG con fondo transparente
- **Tamaño logo principal:** 300x300px o 512x512px
- **Tamaño logo pequeño:** 100x100px o 150x150px
- **Nombre sugerido:** `logo.png`, `logo-white.png`, `logo-small.png`

### Para Favicon:
- **Formato:** .ico o .png
- **Tamaño:** 16x16, 32x32, 48x48 (multi-size .ico)
- **Nombre:** `favicon.ico`

### Para Imágenes de fondo:
- **Formato:** JPG (más ligero) o PNG
- **Tamaño:** 1920x1080px o similar
- **Optimizadas para web (< 500KB)

---

## 🔧 CÓMO USAR LOS LOGOS EN EL CÓDIGO

### 1. Desde la carpeta `public`:

```jsx
// En cualquier componente
<img src="/logo.png" alt="BarberEz Logo" />

// Ejemplo en Login
<div className="flex justify-center mb-8">
    <img 
        src="/logo.png" 
        alt="BarberEz" 
        className="w-32 h-32"
    />
</div>
```

### 2. Desde la carpeta `assets`:

```jsx
// Importar al inicio del componente
import logo from '../assets/logo.png';
import barberia from '../assets/barberia.png';

// Usar en el JSX
<img src={logo} alt="BarberEz Logo" />
<img src={barberia} alt="Barbería" />
```

---

## 🎨 SUGERENCIAS DE ESTRUCTURA

### Crea esta estructura en `public`:
```
📁 public/
├── 🖼️ logo.png (300x300)
├── 🖼️ logo-white.png (versión blanca para fondos oscuros)
├── 🖼️ logo-small.png (100x100)
├── 🖼️ favicon.ico
└── 📁 images/
    ├── 🖼️ hero-banner.jpg
    ├── 🖼️ about-bg.jpg
    └── 🖼️ promo-banner.jpg
```

### O en `assets`:
```
📁 src/assets/
├── 📁 logos/
│   ├── 🖼️ logo-main.png
│   ├── 🖼️ logo-white.png
│   └── 🖼️ logo-small.png
├── 📁 images/
│   ├── 🖼️ barberia-hero.jpg
│   ├── 🖼️ barbero-profile.jpg
│   └── 🖼️ salon-interior.jpg
└── 📁 icons/
    ├── 🖼️ scissors-icon.svg
    └── 🖼️ calendar-icon.svg
```

---

## 🚀 DESPUÉS DE AGREGAR LOS LOGOS

### 1. Actualizar el favicon en index.html:
```html
<!-- Editar: barberez-web/frontend/index.html -->
<head>
    <!-- ...otras etiquetas... -->
    <link rel="icon" type="image/png" href="/logo.png" />
    <title>BarberEz - Sistema de Gestión</title>
</head>
```

### 2. Agregar logo al Login:
```jsx
// Editar: barberez-web/frontend/src/pages/Login.jsx
// Dentro del card de login:
<div className="flex justify-center mb-6">
    <img 
        src="/logo.png" 
        alt="BarberEz" 
        className="w-40 h-40 animate-fadeIn"
    />
</div>
```

### 3. Agregar logo al Navbar (si existe):
```jsx
// En el header/navbar:
<div className="flex items-center space-x-3">
    <img 
        src="/logo-small.png" 
        alt="BarberEz" 
        className="w-10 h-10"
    />
    <span className="text-xl font-bold text-primary">
        BarberEz
    </span>
</div>
```

---

## 📊 RESUMEN DE RUTAS

### Proyecto Java (Desktop):
```
✅ YA EXISTE: src/main/java/Imagenes/
```

### Proyecto Web (React):
```
📁 Carpetas que DEBES USAR para agregar logos:

1. public/ ← Para logos principales y favicon
   C:\Users\2005k\Documents\pyvscodee\descargas\BarberEz-Proyect-master\barberez-web\frontend\public\

2. src/assets/ ← Para imágenes decorativas
   C:\Users\2005k\Documents\pyvscodee\descargas\BarberEz-Proyect-master\barberez-web\frontend\src\assets\
```

---

## ⚠️ IMPORTANTE

### Actualmente la carpeta public SOLO tiene:
- `vite.svg` (logo de Vite por defecto)

### Actualmente la carpeta assets SOLO tiene:
- `react.svg` (logo de React por defecto)

### ✨ NECESITAS AGREGAR TUS LOGOS MANUALMENTE

**No hay logos de BarberEz en la versión web aún.**

---

## 🎯 ACCIÓN RECOMENDADA

### Paso 1: Decidir qué logos usar
¿Tienes logos nuevos o quieres usar los del proyecto Java?

### Paso 2: Copiarlos a las carpetas correctas
- `public/` para logo principal y favicon
- `src/assets/` para imágenes decorativas

### Paso 3: Actualizar el código
- Agregar logo en Login.jsx
- Cambiar favicon en index.html
- Agregar logos en headers/navbars

---

## 💡 CONSEJO

Si tienes logos nuevos en formato `.ai`, `.psd`, o `.svg`:
1. Expórtalos a PNG con fondo transparente
2. Crea versiones en diferentes tamaños
3. Optimiza el peso (usa TinyPNG.com)
4. Guárdalos en las carpetas correspondientes

---

## ✅ CHECKLIST

- [ ] Tengo los logos listos (PNG con fondo transparente)
- [ ] Copié logo principal a `public/logo.png`
- [ ] Copié favicon a `public/favicon.ico`
- [ ] Actualicé `index.html` con el nuevo favicon
- [ ] Agregué logo al componente Login
- [ ] Agregué logo a los headers/navbars
- [ ] El frontend se ve con los logos correctos

---

## 🎨 PRÓXIMOS PASOS

¿Quieres que te ayude a:
1. Agregar los logos al código React
2. Crear un componente Logo reutilizable
3. Copiar logos del proyecto Java al Web
4. Cambiar el favicon

**¡Dime qué necesitas y te ayudo! 🚀💈**

