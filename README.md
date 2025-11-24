# 💈 BarberEz - Sistema de Gestión de Barbería

Sistema completo de gestión de citas para barberías con roles de administrador, barbero y cliente.

## 🚀 Características

- ✅ **Gestión de Citas**: Reserva, confirmación, cancelación y completado de citas
- 👥 **Múltiples Roles**: Administrador, Barbero y Cliente
- 📊 **Dashboard Administrativo**: Estadísticas, ingresos y gestión completa
- 💇‍♂️ **Panel de Barbero**: Gestión de agenda y confirmación de citas
- 📱 **Interfaz Moderna**: Diseño responsive con Tailwind CSS
- 🔐 **Autenticación Segura**: JWT y bcrypt para seguridad
- 📧 **Sistema de Notificaciones**: Alertas en tiempo real

## 🛠️ Tecnologías Utilizadas

### Frontend
- React 19
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- Lucide React (iconos)

### Backend
- Node.js
- Express
- MySQL 8.0+
- JWT (JSON Web Tokens)
- bcryptjs

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v16 o superior) - [Descargar](https://nodejs.org/)
- **MySQL** (v8.0 o superior) - [Descargar](https://dev.mysql.com/downloads/)
- **Git** - [Descargar](https://git-scm.com/downloads)

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/BarberEz-Proyect.git
cd BarberEz-Proyect
```

### 2. Configurar la Base de Datos

1. Abre MySQL Workbench o tu cliente MySQL preferido
2. Crea la base de datos:

```sql
CREATE DATABASE barberia_barberez;
USE barberia_barberez;
```

3. Importa el esquema de la base de datos:

```bash
mysql -u root -p barberia_barberez < barberez-web/db/schema.sql
```

4. (Opcional) Importa datos de prueba:

```bash
mysql -u root -p barberia_barberez < barberez-web/db/datos_prueba.sql
```

5. Ejecuta los scripts adicionales:

```bash
mysql -u root -p barberia_barberez < barberez-web/backend/agregar_estado_confirmada.sql
mysql -u root -p barberia_barberez < barberez-web/backend/agregar_servicios.sql
mysql -u root -p barberia_barberez < barberez-web/backend/auto_cancelar_citas.sql
```

### 3. Configurar el Backend

```bash
cd barberez-web/backend

# Copiar archivo de ejemplo de variables de entorno
copy .env.example .env

# Editar .env con tus credenciales de MySQL
notepad .env

# Instalar dependencias
npm install

# Iniciar el servidor
npm start
```

El backend se ejecutará en `http://localhost:5000`

### 4. Configurar el Frontend

Abre una nueva terminal:

```bash
cd barberez-web/frontend

# Copiar archivo de ejemplo de variables de entorno
copy .env.example .env

# Editar .env si es necesario (por defecto apunta a localhost:5000)
notepad .env

# Instalar dependencias
npm install

# Iniciar la aplicación
npm run dev
```

El frontend se ejecutará en `http://localhost:5173`

## 🔐 Configuración de Variables de Entorno

### Backend (.env)

```env
# Servidor
PORT=5000
NODE_ENV=development

# Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_NAME=barberia_barberez

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura_cambiar_en_produccion

# Frontend (para CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## 👤 Usuarios de Prueba

Si importaste los datos de prueba, puedes usar estas credenciales:

### Administrador
- **Correo**: admin@barberez.com
- **Contraseña**: admin123

### Barbero
- **Correo**: barbero@barberez.com
- **Contraseña**: barbero123

### Cliente
- **Correo**: cliente@barberez.com
- **Contraseña**: cliente123

## 📱 Uso de la Aplicación

### Como Administrador
1. Inicia sesión con credenciales de administrador
2. Accede al dashboard para ver estadísticas
3. Gestiona barberos, servicios y citas
4. Crea nuevas cuentas de usuarios
5. Visualiza reportes de ingresos

### Como Barbero
1. Inicia sesión con credenciales de barbero
2. Ve tus citas pendientes y confirmadas
3. Confirma o cancela citas
4. Marca citas como completadas
5. Revisa tu agenda del día

### Como Cliente
1. Regístrate o inicia sesión
2. Selecciona un barbero y servicios
3. Elige fecha y hora disponible
4. Confirma tu reserva
5. Visualiza tus citas programadas

## 🏗️ Estructura del Proyecto

```
BarberEz-Proyect/
├── barberez-web/
│   ├── backend/
│   │   ├── config/           # Configuración de BD
│   │   ├── routes/           # Rutas de la API
│   │   ├── services/         # Lógica de negocio
│   │   ├── server.js         # Servidor Express
│   │   └── package.json
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/   # Componentes reutilizables
│   │   │   ├── context/      # Context API
│   │   │   ├── pages/        # Páginas principales
│   │   │   ├── services/     # Cliente API
│   │   │   └── App.jsx
│   │   └── package.json
│   └── db/
│       ├── schema.sql        # Esquema de la BD
│       └── datos_prueba.sql  # Datos de ejemplo
└── README.md
```

## 🚀 Despliegue en Producción

### Backend (Railway/Render/Heroku)

1. Configura las variables de entorno en tu plataforma
2. Asegúrate de que `NODE_ENV=production`
3. Usa una base de datos MySQL en la nube (PlanetScale, AWS RDS, etc.)

### Frontend (Vercel/Netlify)

1. Construye el proyecto: `npm run build`
2. Configura `VITE_API_URL` con la URL de tu backend en producción
3. Despliega la carpeta `dist/`

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 📚 Documentación Adicional

- **INICIO_RAPIDO_GITHUB.md** - Guía rápida para subir el proyecto a GitHub
- **GUIA_GITHUB.md** - Instrucciones detalladas de GitHub
- **CHECKLIST.md** - Lista de verificación para deployment
- **DEPLOYMENT.md** - Guía completa de despliegue en producción
- **subir_a_github.ps1** - Script automatizado para subir a GitHub

## 📞 Soporte

Si tienes alguna pregunta o problema:

- Abre un [Issue](https://github.com/isKarTuX/BarberEz-Proyect/issues)
- Lee la documentación en los archivos .md
- Contacta al equipo de desarrollo

## 🎉 Agradecimientos

Desarrollado con ❤️ para facilitar la gestión de barberías modernas.

---

⭐ Si te gusta este proyecto, dale una estrella en GitHub!

