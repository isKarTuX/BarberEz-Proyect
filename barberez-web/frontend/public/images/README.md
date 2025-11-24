# 📁 Carpeta de Imágenes del Logo

## 📋 Coloca aquí tus logos personalizados

### Archivos recomendados:

1. **logo.png** (256x256px o mayor)
   - Logo principal para la página de login
   - Fondo transparente
   - Formato PNG

2. **logo-icon.png** (64x64px o 128x128px)
   - Icono pequeño para headers/navegación
   - Fondo transparente
   - Formato PNG

3. **logo-large.png** (512x512px o mayor) - Opcional
   - Logo grande para pantallas de alta resolución
   - Fondo transparente
   - Formato PNG

### 🎨 Especificaciones:
- **Formato:** PNG con transparencia
- **Colores del proyecto:** 
  - Primario: #8B5CF6 (Púrpura)
  - Secundario: #EC4899 (Rosa)
  - Acento: #F59E0B (Ámbar)
- **Peso:** Menos de 100KB por archivo
- **Calidad:** Alta resolución (para pantallas Retina)

### 🚀 Cómo usarlos:

1. Coloca tus archivos PNG en esta carpeta
2. Sigue la guía: `GUIA_CAMBIAR_LOGOS.md` (en la raíz del proyecto)
3. Actualiza los componentes React según las instrucciones

### ⚡ Script rápido:

Desde la raíz del proyecto:
```powershell
.\cambiar_logos.ps1 -LogoPrincipal "ruta\a\logo.png" -LogoIcono "ruta\a\icono.png"
```

### 📝 Ejemplo de uso en componentes:

```jsx
<img 
    src="/images/logo.png" 
    alt="BarberEz Logo" 
    className="w-24 h-24"
/>
```

---

**Nota:** Esta carpeta se creó automáticamente. Los logos actuales usan iconos de React (FaCut, Scissors). Puedes reemplazarlos siguiendo la guía.

