# 🚀 BarberEz Backend - API REST

Backend del sistema de gestión de barbería BarberEz desarrollado con Node.js, Express y MySQL.

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- MySQL (v8.0 o superior)
- Base de datos `barberia_barberez` creada

## 🔧 Instalación

1. **Instalar dependencias:**
```bash
cd backend
npm install
```

2. **Configurar variables de entorno:**
```bash
# Copiar el archivo de ejemplo
copy .env.example .env

# Editar .env con tus credenciales
```

3. **Configurar base de datos:**
- Asegúrate de tener la base de datos `barberia_barberez` creada
- Los procedimientos almacenados deben estar creados

## 🚀 Ejecutar el servidor

### Modo desarrollo (con auto-reinicio)
```bash
npm run dev
```

### Modo producción
```bash
npm start
```

El servidor se iniciará en: `http://localhost:5000`

## 📡 Endpoints Disponibles

### 🔐 Autenticación (`/api/auth`)

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "correo": "juan@email.com",
  "contrasena": "cliente123"
}
```

#### Registro
```http
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "correo": "juan@email.com",
  "telefono": "3009876543",
  "contrasena": "cliente123",
  "cedula": "1234567890",
  "rol": "cliente",
  "comision": 0
}
```

### 📅 Citas (`/api/citas`)

#### Obtener citas de un cliente
```http
GET /api/citas/cliente/:idCliente?estado=pendiente
```

#### Obtener citas de un barbero
```http
GET /api/citas/barbero/:idBarbero?estado=pendiente
```

#### Agendar cita
```http
POST /api/citas
Content-Type: application/json

{
  "fecha": "2025-11-25",
  "horaIn": "10:00:00",
  "idCliente": 2,
  "idBarbero": 3,
  "servicios": [1, 2],
  "metodoPago": "efectivo"
}
```

#### Actualizar estado de cita
```http
PATCH /api/citas/:idCita/estado
Content-Type: application/json

{
  "estado": "confirmada"
}
```

#### Cancelar cita
```http
DELETE /api/citas/:idCita
Content-Type: application/json

{
  "idUsuario": 2,
  "rol": "cliente"
}
```

#### Verificar disponibilidad
```http
GET /api/citas/disponibilidad/:idBarbero/:fecha
```

### 💇 Barberos (`/api/barberos`)

#### Obtener todos los barberos
```http
GET /api/barberos
```

#### Obtener ingresos de barbero
```http
GET /api/barberos/:idBarbero/ingresos?fechaInicio=2025-11-01&fechaFin=2025-11-30
```

### ✂️ Servicios (`/api/servicios`)

#### Obtener todos los servicios
```http
GET /api/servicios
```

#### Crear servicio
```http
POST /api/servicios
Content-Type: application/json

{
  "nombre": "Corte de cabello",
  "duracion": 30,
  "precio": 15000
}
```

#### Actualizar servicio
```http
PUT /api/servicios/:idSer
Content-Type: application/json

{
  "nombre": "Corte premium",
  "duracion": 45,
  "precio": 20000,
  "activo": true
}
```

### 👔 Admin (`/api/admin`)

#### Obtener estadísticas
```http
GET /api/admin/estadisticas
```

#### Obtener ingresos totales
```http
GET /api/admin/ingresos?fechaInicio=2025-11-01&fechaFin=2025-11-30
```

#### Obtener ingresos por barbero
```http
GET /api/admin/ingresos/barberos?fechaInicio=2025-11-01&fechaFin=2025-11-30
```

#### Obtener todas las citas
```http
GET /api/admin/citas?estado=completada
```

## 📁 Estructura del Proyecto

```
backend/
├── config/
│   └── database.js          # Configuración de MySQL
├── services/
│   ├── authService.js       # Lógica de autenticación
│   ├── citaService.js       # Lógica de citas
│   ├── barberoService.js    # Lógica de barberos
│   ├── servicioService.js   # Lógica de servicios
│   └── adminService.js      # Lógica de admin
├── routes/
│   ├── authRoutes.js        # Rutas de autenticación
│   ├── citaRoutes.js        # Rutas de citas
│   ├── barberoRoutes.js     # Rutas de barberos
│   ├── servicioRoutes.js    # Rutas de servicios
│   └── adminRoutes.js       # Rutas de admin
├── .env                     # Variables de entorno
├── .env.example             # Ejemplo de variables
├── package.json             # Dependencias
└── server.js                # Archivo principal
```

## 🛠️ Tecnologías Utilizadas

- **Express.js** - Framework web
- **MySQL2** - Cliente MySQL con soporte para Promises
- **CORS** - Manejo de Cross-Origin Resource Sharing
- **dotenv** - Manejo de variables de entorno
- **bcryptjs** - Encriptación de contraseñas
- **jsonwebtoken** - Autenticación JWT (preparado)

## 🔒 Seguridad

- Las contraseñas deben ser hasheadas antes de guardarlas en producción
- Se recomienda implementar JWT para autenticación en producción
- Las variables de entorno deben ser secretas

## 📝 Notas

- El servidor usa la misma base de datos que tu aplicación Java
- Todos los procedimientos almacenados se mantienen
- Compatible con tu esquema de base de datos actual

