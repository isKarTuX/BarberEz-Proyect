# 🎨 BarberEz Frontend - React + Vite

Frontend moderno del sistema de gestión de barbería BarberEz desarrollado con React, Vite y Tailwind CSS.

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- Backend ejecutándose en `http://localhost:5000`

## 🔧 Instalación

1. **Instalar dependencias:**
```bash
cd frontend
npm install
```

2. **Configurar variables de entorno:**
```bash
# Copiar el archivo de ejemplo
copy .env.example .env

# Editar .env si es necesario (ya viene configurado por defecto)
```

## 🚀 Ejecutar la aplicación

### Modo desarrollo
```bash
npm run dev
```

La aplicación se abrirá en: `http://localhost:5173`

### Build para producción
```bash
npm run build
```

### Preview del build
```bash
npm run preview
```

## 👥 Usuarios de Prueba

### Admin
- **Correo:** admin@barberez.com
- **Contraseña:** admin123
- **Funciones:** Ver estadísticas, gestionar citas, ver ingresos, crear cuentas

### Cliente
- **Correo:** juan@email.com
- **Contraseña:** cliente123
- **Funciones:** Agendar citas, ver citas pendientes, ver historial

### Barbero
- **Correo:** carlos@barberez.com
- **Contraseña:** barbero123
- **Funciones:** Ver citas del día, confirmar/completar citas, ver ingresos

## 🎨 Características

### 🔐 Autenticación
- Login con validación
- Registro de nuevos usuarios
- Protección de rutas por rol
- Persistencia de sesión en localStorage

### 👤 Dashboard Cliente
- **Agendar Cita:** 
  - Seleccionar fecha y hora
  - Elegir barbero disponible
  - Seleccionar múltiples servicios
  - Ver total antes de confirmar
  - Seleccionar método de pago
- **Mis Citas:** Ver y cancelar citas pendientes
- **Historial:** Ver todas las citas pasadas con su estado

### 💇 Dashboard Barbero
- **Citas de Hoy:** Ver agenda del día actual
- **Citas Pendientes:** Confirmar o rechazar solicitudes de citas
- **Ingresos:** 
  - Ver total de ingresos
  - Calcular comisión personal
  - Detalle de cada servicio realizado

### 👔 Dashboard Admin
- **Estadísticas:**
  - Total de clientes registrados
  - Total de barberos activos
  - Citas pendientes de confirmar
  - Citas programadas para hoy
  - Ingresos totales facturados
- **Todas las Citas:** Tabla completa con filtros
- **Ingresos por Barbero:** 
  - Desglose por cada barbero
  - Total de citas atendidas
  - Ingresos generados
  - Comisiones pagadas
  - Ganancia neta para la barbería
- **Crear Cuentas:** Registrar nuevos usuarios (clientes, barberos, admins)

## 📁 Estructura del Proyecto

```
frontend/
├── public/                  # Archivos estáticos
├── src/
│   ├── components/         # Componentes reutilizables
│   │   └── ProtectedRoute.jsx
│   ├── context/            # Contextos de React
│   │   └── AuthContext.jsx
│   ├── pages/              # Páginas de la aplicación
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ClienteDashboard.jsx
│   │   ├── BarberoDashboard.jsx
│   │   └── AdminDashboard.jsx
│   ├── services/           # Servicios de API
│   │   └── api.js
│   ├── App.jsx             # Componente principal con rutas
│   ├── main.jsx            # Punto de entrada
│   └── index.css           # Estilos globales con Tailwind
├── .env                    # Variables de entorno
├── tailwind.config.js      # Configuración de Tailwind
├── vite.config.js          # Configuración de Vite
└── package.json            # Dependencias
```

## 🛠️ Tecnologías Utilizadas

- **React 18** - Biblioteca de UI
- **Vite** - Build tool ultrarrápido
- **React Router DOM** - Enrutamiento
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide React** - Iconos modernos
- **React Hook Form** - Manejo de formularios (preparado)

## 🎨 Diseño

- **Colores principales:**
  - Primary: `#8B4513` (Marrón barbería)
  - Secondary: `#D2691E` (Naranja cálido)
  - Accent: `#F4A460` (Beige claro)

- **Componentes Tailwind personalizados:**
  - `.btn-primary` - Botón principal
  - `.btn-secondary` - Botón secundario
  - `.input-field` - Campo de entrada
  - `.card` - Tarjeta de contenido

## 🔄 Flujo de la Aplicación

1. **Login/Registro** → Usuario ingresa credenciales
2. **Redireccionamiento** → Según el rol (admin/barbero/cliente)
3. **Dashboard específico** → Acceso a funcionalidades según rol
4. **Operaciones** → CRUD de citas, ver datos, gestionar cuentas
5. **Logout** → Cierre de sesión seguro

## 📱 Responsive Design

La aplicación es completamente responsive y se adapta a:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1280px+)

## 🔒 Seguridad

- Rutas protegidas por autenticación
- Validación de roles en el frontend
- Tokens almacenados de forma segura
- Validación de formularios
- Manejo de errores

## 🚀 Próximas Mejoras

- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Filtros avanzados en tablas
- [ ] Exportación de reportes a PDF/Excel
- [ ] Sistema de calificación de servicios
- [ ] Chat entre cliente y barbero
- [ ] Recordatorios de citas por email/SMS
- [ ] Panel de configuración de la barbería
- [ ] Temas claro/oscuro

## 🐛 Problemas Conocidos

Ninguno por el momento. Reporta cualquier bug que encuentres.

## 📝 Notas

- El frontend consume la API REST del backend
- Todas las operaciones son en tiempo real
- La sesión persiste al recargar la página
- Compatible con Chrome, Firefox, Safari y Edge

