# 🚀 GUÍA PASO A PASO - DESPLIEGUE EN RAILWAY

## ✅ LO MÁS SIMPLE: TODO EN RAILWAY

Esta es la forma más fácil de desplegar tu proyecto completo con la misma base de datos.

---

## 📋 REQUISITOS

- ✅ Cuenta de GitHub (ya la tienes)
- ✅ Proyecto subido a GitHub
- ⏱️ 15-20 minutos

---

## 🎯 PASO 1: CREAR CUENTA EN RAILWAY

1. **Ve a:** https://railway.app
2. **Click en "Login"**
3. **Selecciona "Login with GitHub"**
4. **Autoriza Railway** para acceder a tu GitHub

---

## 🗄️ PASO 2: CREAR BASE DE DATOS MYSQL

1. **En Railway Dashboard:**
   - Click en "New Project"
   - Selecciona "Provision MySQL"
   - Espera a que se cree (30 segundos)

2. **Copiar Credenciales:**
   - Click en el servicio MySQL
   - Pestaña "Variables"
   - Verás las variables automáticas:
     ```
     MYSQL_HOST
     MYSQL_PORT
     MYSQL_USER
     MYSQL_PASSWORD
     MYSQL_DATABASE
     MYSQLHOST
     MYSQLPORT
     MYSQLDATABASE
     MYSQLUSER
     MYSQLPASSWORD
     ```
   - **Copia estos valores** (los necesitarás)

---

## 📊 PASO 3: IMPORTAR TU BASE DE DATOS

### Opción A: Desde MySQL Workbench (Recomendado)

1. **Abre MySQL Workbench**

2. **Crear Nueva Conexión:**
   - Connection Name: `Railway - BarberEz`
   - Hostname: (copia de MYSQLHOST)
   - Port: (copia de MYSQLPORT)
   - Username: (copia de MYSQLUSER)
   - Password: Click "Store in Keychain" → pega MYSQLPASSWORD
   - Default Schema: (copia de MYSQLDATABASE)

3. **Conectar y Test Connection**

4. **Importar Schema:**
   - File → Run SQL Script
   - Selecciona: `barberez-web/db/schema.sql`
   - Click "Run"
   - Espera a que termine

5. **Importar Datos de Prueba:**
   - File → Run SQL Script
   - Selecciona: `barberez-web/db/datos_prueba.sql`
   - Click "Run"

6. **Verificar:**
   - Deberías ver las tablas: usuarios, citas, servicios, etc.
   - Con datos de prueba incluidos

### Opción B: Desde Railway CLI

```powershell
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Vincular al proyecto
railway link

# Importar BD
railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE < barberez-web/db/schema.sql
railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE < barberez-web/db/datos_prueba.sql
```

---

## 🔧 PASO 4: DESPLEGAR BACKEND

1. **En Railway Dashboard:**
   - Click en "+ New"
   - Selecciona "GitHub Repo"
   - Busca y selecciona `BarberEz-Proyect`
   - Click "Deploy"

2. **Configurar Root Directory:**
   - Click en el servicio desplegado
   - Settings → Service
   - Root Directory: `barberez-web/backend`
   - Click "Update"

3. **Configurar Variables de Entorno:**
   - Pestaña "Variables"
   - Click "+ New Variable"
   - Agrega las siguientes:

   ```env
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=tu_clave_secreta_super_segura_production_cambiar_123456
   ```

4. **Conectar con MySQL:**
   - Click "+ Variable"
   - Click "Add Reference"
   - Agrega:
     ```
     DB_HOST → MySQL.MYSQLHOST
     DB_PORT → MySQL.MYSQLPORT
     DB_USER → MySQL.MYSQLUSER
     DB_PASSWORD → MySQL.MYSQLPASSWORD
     DB_NAME → MySQL.MYSQLDATABASE
     ```

5. **Esperar Despliegue:**
   - Railway compilará automáticamente
   - Verás logs en tiempo real
   - Espera el mensaje: "✅ Conexión a MySQL establecida"

6. **Copiar URL del Backend:**
   - Settings → Domains
   - Click "Generate Domain"
   - Copia la URL (ejemplo: `https://tu-backend.up.railway.app`)

---

## 🎨 PASO 5: DESPLEGAR FRONTEND

1. **En Railway Dashboard:**
   - Click en "+ New"
   - Selecciona "GitHub Repo"
   - Selecciona `BarberEz-Proyect` (el mismo repo)
   - Click "Deploy"

2. **Configurar Root Directory:**
   - Settings → Service
   - Root Directory: `barberez-web/frontend`
   - Click "Update"

3. **Configurar Variable de Entorno:**
   - Pestaña "Variables"
   - Click "+ New Variable"
   - Name: `VITE_API_URL`
   - Value: `https://tu-backend.up.railway.app/api` (la URL del paso 4)

4. **Configurar Build Command:**
   - Settings → Build
   - Build Command: `npm install && npm run build`
   - Start Command: `npx serve -s dist -p $PORT`

5. **Esperar Despliegue:**
   - Railway compilará el frontend
   - Tarda ~2-3 minutos

6. **Generar Dominio:**
   - Settings → Domains
   - Click "Generate Domain"
   - Copia la URL (ejemplo: `https://tu-frontend.up.railway.app`)

---

## 🔄 PASO 6: ACTUALIZAR CORS EN BACKEND

1. **Volver al servicio Backend:**
   - Click en el servicio backend
   - Pestaña "Variables"
   - Click "+ New Variable"
   - Name: `FRONTEND_URL`
   - Value: `https://tu-frontend.up.railway.app` (la URL del paso 5)

2. **Railway redesplegará automáticamente**

---

## ✅ PASO 7: PROBAR LA APLICACIÓN

1. **Abre la URL del frontend:** `https://tu-frontend.up.railway.app`

2. **Prueba iniciar sesión:**
   - Admin: `admin@barberez.com` / `admin123`
   - Barbero: `barbero@barberez.com` / `barbero123`
   - Cliente: `cliente@barberez.com` / `cliente123`

3. **Verifica que funcione:**
   - ✅ Login exitoso
   - ✅ Dashboard carga
   - ✅ Puedes ver citas
   - ✅ Puedes crear citas

---

## 🎉 ¡LISTO! TU PROYECTO ESTÁ EN LÍNEA

Ahora puedes compartir la URL:
```
https://tu-frontend.up.railway.app
```

---

## 🔄 ACTUALIZAR EL PROYECTO

Cada vez que hagas cambios y los subas a GitHub:

```powershell
# Hacer cambios en tu código local
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

**Railway detectará los cambios automáticamente y redesplegará** 🚀

---

## 📊 MONITOREAR TU APLICACIÓN

### Ver Logs:
1. Click en el servicio (backend o frontend)
2. Pestaña "Deployments"
3. Click en el último deployment
4. Ver logs en tiempo real

### Ver Métricas:
1. Pestaña "Metrics"
2. CPU, RAM, Network usage

### Ver Variables:
1. Pestaña "Variables"
2. Editar si es necesario

---

## 💾 BACKUP DE BASE DE DATOS

### Exportar BD desde Railway:

```powershell
# Conectar
railway link

# Exportar
mysqldump -h $MYSQLHOST -P $MYSQLPORT -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE > backup_railway.sql
```

### Restaurar a Local:

```powershell
mysql -u root -p barberia_barberez < backup_railway.sql
```

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Backend no conecta a BD:
- Verifica las variables de entorno
- Revisa los logs: busca "Error conectando a MySQL"
- Asegúrate de que las referencias estén correctas

### Frontend no carga:
- Verifica que `VITE_API_URL` esté correcta
- Debe incluir `/api` al final
- Debe ser HTTPS

### Error de CORS:
- Verifica `FRONTEND_URL` en backend
- Debe ser la URL exacta del frontend (sin / al final)
- Redespliega el backend

### 502 Bad Gateway:
- El servicio está arrancando (espera 30 segundos)
- Revisa los logs para ver errores

---

## 💰 COSTOS

Railway ofrece:
- ✅ $5 de crédito gratuito al mes
- ✅ Suficiente para proyectos pequeños
- ✅ ~500 horas de ejecución
- ✅ BD MySQL incluida

Si se agota:
- Opción 1: Agregar tarjeta (solo cobra lo que uses)
- Opción 2: Usar Render.com (también gratis)

---

## 🔗 ENLACES ÚTILES

- **Railway Dashboard:** https://railway.app/dashboard
- **Documentación:** https://docs.railway.app
- **Status:** https://status.railway.app

---

¿Listo para empezar? Sigue los pasos y en 20 minutos tendrás tu proyecto en línea! 🚀

