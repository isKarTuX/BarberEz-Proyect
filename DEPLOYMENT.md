# 🚀 Guía Rápida de Despliegue

Esta guía te ayudará a poner en producción tu aplicación BarberEz.

## 📦 Preparación

### 1. Backend en Railway (Recomendado)

1. **Crear cuenta en Railway**: https://railway.app
2. **Crear nuevo proyecto** → "Deploy from GitHub repo"
3. **Seleccionar tu repositorio**
4. **Configurar variables de entorno**:
   ```
   NODE_ENV=production
   PORT=5000
   DB_HOST=tu-servidor-mysql.railway.app
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=tu_password
   DB_NAME=barberia_barberez
   JWT_SECRET=clave_secreta_super_segura_para_produccion
   FRONTEND_URL=https://tu-dominio-frontend.vercel.app
   ```
5. **Configurar comando de inicio**: `npm start`
6. **Agregar base de datos MySQL** desde Railway Plugins

### 2. Frontend en Vercel (Recomendado)

1. **Crear cuenta en Vercel**: https://vercel.com
2. **Importar proyecto desde GitHub**
3. **Configurar build settings**:
   - Framework Preset: `Vite`
   - Root Directory: `barberez-web/frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Variables de entorno**:
   ```
   VITE_API_URL=https://tu-backend.railway.app/api
   ```

## 🗄️ Base de Datos MySQL

### Opción 1: Railway MySQL Plugin
- Automático al crear el backend en Railway
- Copia las credenciales a las variables de entorno

### Opción 2: PlanetScale
1. Crear cuenta en https://planetscale.com
2. Crear nueva base de datos
3. Importar schema: `pscale shell barberia_barberez < db/schema.sql`
4. Configurar conexión en Railway

### Opción 3: AWS RDS
1. Crear instancia MySQL en AWS RDS
2. Configurar grupo de seguridad (permitir conexiones)
3. Importar schema usando MySQL Workbench

## 🔧 Configuración de Producción

### Backend

1. **Actualizar CORS en server.js**:
```javascript
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://tu-dominio.vercel.app',
    credentials: true
}));
```

2. **Verificar que uses variables de entorno**:
```javascript
const PORT = process.env.PORT || 5000;
```

### Frontend

1. **Actualizar api.js** para usar variable de entorno:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

## 📊 Importar Base de Datos

### Desde Railway CLI:
```bash
railway login
railway link [project-id]
railway run mysql -u root -p barberia_barberez < barberez-web/db/schema.sql
railway run mysql -u root -p barberia_barberez < barberez-web/db/datos_prueba.sql
```

### Desde MySQL Workbench:
1. Conectar a tu servidor MySQL de producción
2. File → Run SQL Script
3. Seleccionar `schema.sql`
4. Seleccionar `datos_prueba.sql`

## ✅ Verificación

1. **Backend**: Visita `https://tu-backend.railway.app/api/test`
2. **Frontend**: Visita `https://tu-frontend.vercel.app`
3. **Login**: Prueba con `admin@barberez.com` / `admin123`

## 🔒 Seguridad

### Antes de producción:
- ✅ Cambia JWT_SECRET a un valor aleatorio seguro
- ✅ Usa contraseñas fuertes para MySQL
- ✅ Habilita HTTPS (automático en Railway/Vercel)
- ✅ Configura CORS solo para tu dominio
- ✅ No expongas credenciales en el código

### Generar JWT_SECRET seguro:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 📱 Dominios Personalizados

### En Vercel:
1. Settings → Domains
2. Agregar tu dominio
3. Configurar DNS según instrucciones

### En Railway:
1. Settings → Public Networking
2. Generate Domain o agregar Custom Domain

## 🐛 Troubleshooting

### Error de CORS:
- Verifica que `FRONTEND_URL` esté correcta en backend
- Asegúrate de que el frontend use la URL correcta del backend

### Error de conexión a BD:
- Verifica las credenciales en variables de entorno
- Confirma que el servidor MySQL esté accesible
- Revisa los logs en Railway

### Build Error en Vercel:
- Verifica que `package.json` tenga todos los paquetes
- Confirma que el directorio raíz sea correcto
- Revisa los logs de build

## 📞 Recursos

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **PlanetScale Docs**: https://docs.planetscale.com

## 🎉 ¡Listo!

Tu aplicación BarberEz está ahora en producción y lista para usar.

