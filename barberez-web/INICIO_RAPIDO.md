# 🚀 GUÍA RÁPIDA DE INICIO - BarberEz

## ⚡ Inicio Rápido (3 pasos)

### 1️⃣ Configurar Base de Datos

Abre MySQL Workbench o tu cliente MySQL favorito y ejecuta:

```sql
CREATE DATABASE IF NOT EXISTS barberia_barberez;
USE barberia_barberez;

-- Luego ejecuta todo el script SQL de la base de datos
-- (El script completo está en la documentación del proyecto)
```

### 2️⃣ Iniciar Backend

```bash
cd backend
npm run dev
```

✅ El servidor se iniciará en: `http://localhost:5000`

Verás algo como:
```
╔════════════════════════════════════════╗
║   🚀 SERVIDOR BARBEREZ INICIADO 🚀   ║
╚════════════════════════════════════════╝
📍 URL: http://localhost:5000
🌍 Entorno: development
💾 Base de datos: barberia_barberez
```

### 3️⃣ Iniciar Frontend

Abre una **nueva terminal** y ejecuta:

```bash
cd frontend
npm run dev
```

✅ La aplicación se abrirá en: `http://localhost:5173`

## 🎯 Acceder a la Aplicación

1. Abre tu navegador en `http://localhost:5173`
2. Usa uno de estos usuarios de prueba:

### 👔 Admin
- **Usuario:** admin@barberez.com
- **Contraseña:** admin123

### 👤 Cliente
- **Usuario:** juan@email.com
- **Contraseña:** cliente123

### 💇 Barbero
- **Usuario:** carlos@barberez.com
- **Contraseña:** barbero123

## ❗ Solución de Problemas

### Error: "Cannot connect to MySQL"
**Solución:** Verifica que MySQL esté corriendo y las credenciales en `backend/.env` sean correctas.

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=barberia_barberez
```

### Error: "Port 5000 already in use"
**Solución:** Cambia el puerto en `backend/.env`:
```env
PORT=5001
```

Y actualiza la URL en `frontend/.env`:
```env
VITE_API_URL=http://localhost:5001/api
```

### Error: "npm command not found"
**Solución:** Instala Node.js desde https://nodejs.org/

### Error: Base de datos vacía
**Solución:** Asegúrate de ejecutar el script SQL completo que incluye los datos de prueba.

## 📝 Comandos Útiles

### Backend
```bash
npm start          # Iniciar en modo producción
npm run dev        # Iniciar en modo desarrollo (con auto-reload)
```

### Frontend
```bash
npm run dev        # Iniciar en modo desarrollo
npm run build      # Construir para producción
npm run preview    # Preview del build
```

## 🔧 Configuración Opcional

### Cambiar Puerto del Backend
Edita `backend/.env`:
```env
PORT=3000
```

### Cambiar URL de la API
Edita `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

## 📚 Documentación Completa

- **README Principal:** `README.md`
- **Backend:** `backend/README.md`
- **Frontend:** `frontend/README.md`

## 🆘 ¿Necesitas Ayuda?

1. Lee la documentación completa en los README
2. Verifica los logs en la consola
3. Revisa que todos los servicios estén corriendo
4. Verifica las credenciales de la base de datos

---

**¡Listo! 🎉 Tu aplicación BarberEz está corriendo.**

Ahora puedes:
- ✅ Registrar nuevos usuarios
- ✅ Agendar citas como cliente
- ✅ Gestionar citas como barbero
- ✅ Administrar todo el sistema como admin

**¡Disfruta usando BarberEz!** 💈✨

