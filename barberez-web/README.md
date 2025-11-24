# 💈 BarberEz - Sistema de Gestión de Barbería

Sistema completo de gestión para barberías desarrollado con **Full Stack JavaScript** (Node.js + Express + React + MySQL).

![Stack](https://img.shields.io/badge/Stack-Full%20Stack%20JavaScript-yellow)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)
![Database](https://img.shields.io/badge/Database-MySQL-orange)
![Status](https://img.shields.io/badge/Status-Producción-success)

## 📋 Descripción del Proyecto

**BarberEz** es un sistema integral para gestionar barberías que permite:

✅ Registro y autenticación de usuarios (Cliente, Barbero, Admin)  
✅ Agendamiento de citas con selección de servicios  
✅ Gestión de disponibilidad de barberos  
✅ Control de pagos y facturación  
✅ Dashboard administrativo con estadísticas  
✅ Panel para barberos con agenda e ingresos  
✅ Interfaz de cliente para agendar y ver citas  

## 🎯 Problemática que Resuelve

Actualmente las barberías enfrentan:
- ❌ Desorganización en la agenda de citas
- ❌ Clientes esperando largos periodos
- ❌ Dificultad para identificar disponibilidad del personal
- ❌ Confusión en el cálculo de precios
- ❌ Falta de registro adecuado de pagos
- ❌ Control administrativo deficiente

**BarberEz soluciona todo esto** con un sistema moderno, intuitivo y profesional.

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────┐
│              FRONTEND (React)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Cliente │  │  Barbero │  │  Admin   │      │
│  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────┘
                      ↕ HTTP/REST API
┌─────────────────────────────────────────────────┐
│          BACKEND (Node.js + Express)             │
│  ┌──────────────────────────────────────────┐  │
│  │  API REST (Routes + Services)            │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                      ↕ SQL
┌─────────────────────────────────────────────────┐
│              DATABASE (MySQL)                    │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌──────┐ │
│  │Usuario │  │ Cita   │  │Servicio│  │ Pago │ │
│  └────────┘  └────────┘  └────────┘  └──────┘ │
└─────────────────────────────────────────────────┘
```

## 🚀 Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web minimalista
- **MySQL2** - Cliente MySQL con Promises
- **CORS** - Manejo de Cross-Origin
- **dotenv** - Variables de entorno
- **bcryptjs** - Encriptación (preparado)

### Frontend
- **React 18** - Biblioteca UI moderna
- **Vite** - Build tool ultrarrápido
- **React Router** - Enrutamiento
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide React** - Iconos elegantes

### Base de Datos
- **MySQL 8.0+** - Sistema de gestión de bases de datos
- **Procedimientos Almacenados** - Lógica de negocio en DB
- **Triggers** - Validaciones automáticas
- **Vistas** - Consultas optimizadas

## 📦 Estructura del Proyecto

```
barberez-web/
├── backend/                    # API REST con Node.js
│   ├── config/                 # Configuración de BD
│   ├── services/               # Lógica de negocio
│   ├── routes/                 # Endpoints de la API
│   ├── server.js               # Archivo principal
│   ├── package.json            # Dependencias backend
│   └── README.md               # Documentación backend
│
├── frontend/                   # Aplicación React
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   ├── context/            # Context API
│   │   ├── pages/              # Páginas de la app
│   │   ├── services/           # Servicios de API
│   │   ├── App.jsx             # Rutas principales
│   │   └── main.jsx            # Punto de entrada
│   ├── package.json            # Dependencias frontend
│   └── README.md               # Documentación frontend
│
└── README.md                   # Este archivo
```

## ⚙️ Instalación y Configuración

### 1️⃣ Requisitos Previos

- **Node.js** v18+ instalado ([Descargar](https://nodejs.org/))
- **MySQL** v8.0+ instalado y ejecutándose
- **Git** para clonar el repositorio
- Editor de código (VS Code recomendado)

### 2️⃣ Clonar el Repositorio

```bash
git clone https://github.com/tuusuario/barberez.git
cd barberez/barberez-web
```

### 3️⃣ Configurar la Base de Datos

1. Abrir MySQL Workbench o línea de comandos
2. Ejecutar el script de base de datos:

```sql
-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS barberia_barberez;
USE barberia_barberez;

-- Ejecutar todo el script SQL proporcionado
-- (Incluye tablas, procedimientos, triggers, vistas y datos de prueba)
```

### 4️⃣ Configurar el Backend

```bash
cd backend

# Instalar dependencias
npm install

# Copiar y configurar variables de entorno
copy .env.example .env

# Editar .env con tus credenciales de MySQL
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=tu_contraseña
# DB_NAME=barberia_barberez
# PORT=5000
```

### 5️⃣ Configurar el Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install

# Copiar configuración (ya viene por defecto)
copy .env.example .env
```

## 🎬 Ejecutar la Aplicación

### Opción 1: Ejecutar Backend y Frontend por Separado

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Backend corriendo en: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend corriendo en: `http://localhost:5173`

### Opción 2: Ejecutar Todo con un Comando

Desde la raíz del proyecto:
```bash
# Windows (PowerShell)
cd backend ; Start-Process npm run dev ; cd ../frontend ; npm run dev

# Linux/Mac
cd backend && npm run dev & cd ../frontend && npm run dev
```

## 👥 Usuarios de Prueba

La base de datos incluye usuarios de prueba:

| Rol | Correo | Contraseña | Funcionalidades |
|-----|--------|------------|-----------------|
| **Admin** | admin@barberez.com | admin123 | Gestión completa del sistema |
| **Cliente** | juan@email.com | cliente123 | Agendar y gestionar citas |
| **Barbero** | carlos@barberez.com | barbero123 | Ver agenda e ingresos |

## 📱 Funcionalidades por Rol

### 👤 Cliente
- ✅ Registrarse en el sistema
- ✅ Iniciar sesión
- ✅ Agendar citas (fecha, hora, barbero, servicios)
- ✅ Ver citas pendientes
- ✅ Cancelar citas
- ✅ Ver historial de citas
- ✅ Ver total a pagar antes de confirmar

### 💇 Barbero
- ✅ Ver citas del día
- ✅ Ver citas pendientes de confirmar
- ✅ Confirmar o rechazar citas
- ✅ Marcar citas como completadas
- ✅ Ver ingresos totales
- ✅ Ver comisión ganada
- ✅ Ver detalle de cada servicio realizado

### 👔 Administrador
- ✅ Ver estadísticas generales
- ✅ Ver total de clientes y barberos
- ✅ Ver citas del día y pendientes
- ✅ Ver todas las citas del sistema
- ✅ Ver ingresos totales
- ✅ Ver ingresos desglosados por barbero
- ✅ Calcular comisiones y ganancias
- ✅ Crear nuevas cuentas (cliente, barbero, admin)

## 🗄️ Modelo de Base de Datos

### Tablas Principales:
- **usuario** - Información base de todos los usuarios
- **admin, cliente, barbero** - Especialización por rol
- **servicio** - Servicios ofrecidos (corte, barba, etc.)
- **cita** - Citas agendadas
- **servicioCita** - Relación N:M entre citas y servicios
- **pago** - Registro de pagos

### Características:
- ✅ Herencia con tabla padre (usuario)
- ✅ Procedimientos almacenados para operaciones complejas
- ✅ Triggers para validaciones automáticas
- ✅ Vistas para consultas optimizadas
- ✅ Índices para mejorar rendimiento

## 🎨 Capturas de Pantalla

### Login
![Login](docs/screenshots/login.png)

### Dashboard Cliente
![Cliente](docs/screenshots/cliente.png)

### Dashboard Barbero
![Barbero](docs/screenshots/barbero.png)

### Dashboard Admin
![Admin](docs/screenshots/admin.png)

## 📊 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### Citas
- `GET /api/citas/cliente/:id` - Obtener citas de cliente
- `GET /api/citas/barbero/:id` - Obtener citas de barbero
- `POST /api/citas` - Agendar cita
- `PATCH /api/citas/:id/estado` - Actualizar estado
- `DELETE /api/citas/:id` - Cancelar cita

### Barberos
- `GET /api/barberos` - Listar barberos
- `GET /api/barberos/:id/ingresos` - Ver ingresos

### Servicios
- `GET /api/servicios` - Listar servicios
- `POST /api/servicios` - Crear servicio

### Admin
- `GET /api/admin/estadisticas` - Estadísticas generales
- `GET /api/admin/ingresos` - Ingresos totales
- `GET /api/admin/citas` - Todas las citas

Ver documentación completa en [`backend/README.md`](backend/README.md)

## 🔒 Seguridad

- ✅ Validación de datos en frontend y backend
- ✅ Protección de rutas por roles
- ✅ Variables de entorno para credenciales
- ✅ Preparado para JWT (próxima versión)
- ✅ Hash de contraseñas (preparado con bcrypt)

## 🚀 Despliegue a Producción

### Backend (Node.js)
- **Recomendado:** Render, Railway, Heroku
- **Configurar:** Variables de entorno en la plataforma
- **Base de datos:** PlanetScale, Railway MySQL, AWS RDS

### Frontend (React)
- **Recomendado:** Vercel, Netlify, GitHub Pages
- **Build:** `npm run build`
- **Deploy:** Conectar repositorio de Git

## 🛣️ Roadmap

- [x] Sistema de autenticación
- [x] Gestión de citas
- [x] Dashboard de cliente
- [x] Dashboard de barbero
- [x] Dashboard de admin
- [ ] Notificaciones en tiempo real
- [ ] Sistema de calificaciones
- [ ] Recordatorios por email/SMS
- [ ] Reportes en PDF
- [ ] App móvil (React Native)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más información.

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tuusuario](https://github.com/tuusuario)
- Email: tu@email.com

## 🙏 Agradecimientos

- Inspirado en el proyecto original en Java Swing
- Migrado a tecnologías web modernas
- Diseñado para facilitar la gestión de barberías

---

⭐ Si te gusta este proyecto, dale una estrella en GitHub!

**Hecho con ❤️ y ☕**

