# 🚨 SOLUCIÓN RÁPIDA - PASOS A SEGUIR

## ❌ PROBLEMA
- **Error:** `Table 'barberia_barberez.usuarios' doesn't exist`
- **Causa:** La base de datos no tiene las tablas creadas

## ✅ SOLUCIÓN EN 3 PASOS

### PASO 1: Crear las Tablas en MySQL

Tienes **2 opciones** (elige la que prefieras):

#### Opción A: MySQL Workbench
1. Abre **MySQL Workbench**
2. Conéctate a tu servidor MySQL
3. Abre el archivo: `CREAR_BASE_DATOS.sql` (está en esta carpeta)
4. Haz clic en el ⚡ rayo (Execute) para ejecutar todo el script

#### Opción B: Línea de Comandos
```powershell
# En PowerShell, ejecuta:
mysql -u root -p

# Cuando te pida contraseña, escríbela y presiona Enter
# Luego copia y pega este comando:
source C:\Users\2005k\Documents\pyvscodee\descargas\BarberEz-Proyect-master\barberez-web\CREAR_BASE_DATOS.sql
```

#### Opción C: phpMyAdmin (si lo tienes instalado)
1. Abre **phpMyAdmin** en tu navegador
2. Haz clic en "SQL" (arriba)
3. Copia TODO el contenido del archivo `CREAR_BASE_DATOS.sql`
4. Pégalo en el cuadro de texto
5. Haz clic en "Continuar"

---

### PASO 2: Verificar que se Crearon las Tablas

En MySQL Workbench o phpMyAdmin, ejecuta:
```sql
USE barberia_barberez;
SHOW TABLES;
```

**Deberías ver:**
- usuarios
- servicios
- citas
- cita_servicios

---

### PASO 3: Reiniciar el Backend

```powershell
cd C:\Users\2005k\Documents\pyvscodee\descargas\BarberEz-Proyect-master\barberez-web\backend
node server.js
```

---

## 🔐 CREDENCIALES DE PRUEBA

Una vez que el servidor esté corriendo, usa estas credenciales:

| Rol | Correo | Contraseña |
|-----|--------|------------|
| **Admin** | admin@barberez.com | admin123 |
| **Barbero** | barbero@barberez.com | barbero123 |
| **Cliente** | cliente@barberez.com | cliente123 |

---

## ⚙️ QUÉ HE CORREGIDO

1. ✅ **authService.js** - Ahora usa la tabla `usuarios` correctamente
2. ✅ **CORS** - Permitido en desarrollo para evitar errores
3. ✅ **SQL Script** - Creado `CREAR_BASE_DATOS.sql` listo para ejecutar

---

## 🆘 Si Sigue Sin Funcionar

**Dime qué error ves exactamente** después de ejecutar el PASO 1, y te ayudo inmediatamente.
