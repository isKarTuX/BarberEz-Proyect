# 🚀 Despliegue Completo - GitHub Pages + Backend Gratis

## ⚠️ IMPORTANTE: Limitaciones de GitHub Pages

GitHub Pages **SOLO** sirve archivos estáticos (HTML, CSS, JavaScript).
**NO puede ejecutar:**
- ❌ Backend Node.js
- ❌ Base de datos MySQL
- ❌ APIs del servidor

## ✅ SOLUCIÓN COMPLETA Y GRATUITA

Vamos a usar servicios gratuitos para todo:

```
┌─────────────────────┐
│  GitHub Pages       │  ← Frontend (React)
│  (GRATIS)           │
└──────────┬──────────┘
           │
           ↓ API Calls
┌─────────────────────┐
│  Railway/Render     │  ← Backend (Node.js)
│  (GRATIS)           │
└──────────┬──────────┘
           │
           ↓ SQL Queries
┌─────────────────────┐
│  Railway MySQL      │  ← Base de Datos
│  (GRATIS)           │
└─────────────────────┘
```

---

## 📋 PLAN DE DESPLIEGUE

### Opción A: TODO EN RAILWAY (Recomendado - Más Fácil)
- ✅ Frontend
- ✅ Backend
- ✅ Base de Datos MySQL
- ✅ Todo en un solo lugar
- ✅ 100% Gratuito (plan hobby)

### Opción B: GitHub Pages + Railway Backend
- ✅ Frontend en GitHub Pages
- ✅ Backend + BD en Railway
- ⚠️ Requiere configurar CORS

---

## 🎯 OPCIÓN A: TODO EN RAILWAY (RECOMENDADO)

### 1️⃣ Crear Cuenta en Railway

1. Ve a: https://railway.app
2. Click en "Start a New Project"
3. Conecta con tu cuenta de GitHub

### 2️⃣ Desplegar Base de Datos MySQL

```bash
# En Railway Dashboard:
1. New Project
2. Add MySQL Database
3. Copiar credenciales (se generan automáticamente)
```

**Guardar las credenciales:**
```
MYSQL_HOST=xxx.railway.app
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=xxxxxxxxx
MYSQL_DATABASE=railway
```

### 3️⃣ Importar Schema a Railway

Hay 2 formas:

**Opción 1: Desde Railway CLI**
```powershell
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Conectar al proyecto
railway link

# Importar base de datos
railway run mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD railway < barberez-web/db/schema.sql
railway run mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD railway < barberez-web/db/datos_prueba.sql
```

**Opción 2: Desde MySQL Workbench**
1. Abre MySQL Workbench
2. Conecta usando las credenciales de Railway
3. File → Run SQL Script
4. Selecciona `barberez-web/db/schema.sql`
5. Ejecuta
6. Repite con `datos_prueba.sql`

### 4️⃣ Desplegar Backend en Railway

1. En Railway Dashboard: "New Service"
2. "GitHub Repo" → Selecciona `BarberEz-Proyect`
3. Root Directory: `barberez-web/backend`
4. Build Command: `npm install`
5. Start Command: `npm start`

**Variables de Entorno (Settings → Variables):**
```env
NODE_ENV=production
PORT=5000
DB_HOST=${{MySQL.MYSQL_HOST}}
DB_PORT=${{MySQL.MYSQL_PORT}}
DB_USER=${{MySQL.MYSQL_USER}}
DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}
DB_NAME=${{MySQL.MYSQL_DATABASE}}
JWT_SECRET=tu_clave_secreta_super_segura_production_123456
FRONTEND_URL=https://tu-proyecto.up.railway.app
```

Railway auto-genera una URL como: `https://tu-backend.up.railway.app`

### 5️⃣ Desplegar Frontend en Railway

1. "New Service" → GitHub Repo
2. Root Directory: `barberez-web/frontend`
3. Build Command: `npm install && npm run build`
4. Start Command: `npx serve -s dist -p $PORT`

**Variables de Entorno:**
```env
VITE_API_URL=https://tu-backend.up.railway.app/api
```

Railway auto-genera una URL como: `https://tu-frontend.up.railway.app`

### 6️⃣ Actualizar CORS en Backend

Después del despliegue, actualiza la URL del frontend en las variables de Railway:
```env
FRONTEND_URL=https://tu-frontend.up.railway.app
```

---

## 🎯 OPCIÓN B: GITHUB PAGES + RAILWAY BACKEND

### 1️⃣ Configurar Backend y BD en Railway

Sigue los pasos 2, 3 y 4 de la Opción A.

### 2️⃣ Preparar Frontend para GitHub Pages

Necesitamos crear archivos de configuración:

**Crear: `barberez-web/frontend/.env.production`**
```env
VITE_API_URL=https://tu-backend.up.railway.app/api
```

**Actualizar: `barberez-web/frontend/vite.config.ts`**
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/BarberEz-Proyect/',  // Nombre de tu repo
  // ...resto de config
})
```

### 3️⃣ Crear Workflow de GitHub Actions

Crea: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      working-directory: ./barberez-web/frontend
      run: npm install
    
    - name: Build
      working-directory: ./barberez-web/frontend
      env:
        VITE_API_URL: ${{ secrets.VITE_API_URL }}
      run: npm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./barberez-web/frontend/dist
```

### 4️⃣ Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: `gh-pages` → `/root`
5. Save

### 5️⃣ Agregar Secret en GitHub

1. Settings → Secrets and variables → Actions
2. New repository secret
3. Name: `VITE_API_URL`
4. Value: `https://tu-backend.up.railway.app/api`
5. Add secret

### 6️⃣ Actualizar CORS en Backend

En Railway, actualiza la variable:
```env
FRONTEND_URL=https://isKarTuX.github.io
```

---

## 🛠️ SCRIPTS AUTOMATIZADOS

Voy a crear scripts para facilitar el despliegue.

---

## 📊 COMPARACIÓN DE OPCIONES

| Característica | Railway Completo | GitHub Pages + Railway |
|----------------|------------------|------------------------|
| Facilidad | ⭐⭐⭐⭐⭐ Muy fácil | ⭐⭐⭐ Moderado |
| Velocidad | ⚡ Rápido | ⚡⚡ Más rápido (CDN) |
| Costo | 💰 Gratis | 💰 Gratis |
| Dominio | railway.app | github.io |
| Configuración | Simple | Requiere CI/CD |
| Mantenimiento | Bajo | Medio |

**Recomendación: Usa Railway completo (Opción A) - Es mucho más simple.**

---

## 🔄 MANTENER TU BD LOCAL Y SINCRONIZAR

Si quieres seguir usando tu BD local para desarrollo:

### Desarrollo Local:
```env
# barberez-web/backend/.env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_local
DB_NAME=barberia_barberez
```

### Producción (Railway):
```env
DB_HOST=${{MySQL.MYSQL_HOST}}
DB_USER=${{MySQL.MYSQL_USER}}
DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}
DB_NAME=${{MySQL.MYSQL_DATABASE}}
```

### Sincronizar BD Local → Railway

**Opción 1: Dump y restaurar**
```powershell
# Exportar BD local
mysqldump -u root -p barberia_barberez > backup.sql

# Importar a Railway
railway run mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD railway < backup.sql
```

**Opción 2: Usar la misma BD para todo (NO recomendado)**
- Exponer tu MySQL local a internet (inseguro)
- Usar túnel como ngrok (lento)

---

## ✅ SIGUIENTE PASO

¿Qué opción prefieres?

### A) Railway Completo (Recomendado)
```
Te guiaré paso a paso para desplegar todo en Railway
```

### B) GitHub Pages + Railway Backend
```
Crearé los archivos de configuración necesarios
```

---

## 🆘 AYUDA RÁPIDA

### Ver logs en Railway:
```bash
railway logs
```

### Conectar a BD Railway desde local:
```bash
railway connect
```

### Actualizar código:
```bash
git push origin main
# Railway redespliega automáticamente
```

---

Dime qué opción prefieres y continúo con la configuración automática. 🚀

