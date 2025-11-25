# 🚨 PROBLEMA CRÍTICO: Incompatibilidad entre Schema y Código Backend

## El Problema

Existe una **incompatibilidad fundamental** entre el esquema de base de datos (`db/schema.sql`) y el código del backend.

### Schema Actual (db/schema.sql)
```sql
CREATE TABLE usuarios (
    id INT PRIMARY KEY,  -- ⚠️ Usa 'id'
    nombre, correo, contrasena, telefono, cedula,
    rol ENUM('admin', 'barbero', 'cliente'),  -- ⚠️ Un solo rol
    comision DECIMAL(5,2)  -- ⚠️ Comisión en usuarios
)

CREATE TABLE citas (
    id INT PRIMARY KEY,  -- ⚠️ Usa 'id'
    cliente_id INT,  -- ⚠️ Usa 'cliente_id'
    barbero_id INT,  -- ⚠️ Usa 'barbero_id'
    hora_inicio TIME,  -- ⚠️ Usa 'hora_inicio'
    hora_fin TIME  -- ⚠️ Usa 'hora_fin'
)
```

### Lo que Espera el Código Backend
```javascript
// En citaService.js, adminService.js, barberoService.js
SELECT * FROM barbero  -- ❌ Tabla 'barbero' NO EXISTE
SELECT * FROM cliente  -- ❌ Tabla 'cliente' NO EXISTE
SELECT * FROM usuario  -- ❌ Debería ser 'usuarios' (plural)
SELECT * FROM cita WHERE idBarbero = ?  -- ❌ Debería ser 'barbero_id'
```

## Soluciones Posibles

### ✅ Opción 1: Reescribir Backend (RECOMENDADO)
Adaptar **todos los archivos de servicios** para usar el schema actual:
- `authService.js` ✅ **YA CORREGIDO**
- `citaService.js` ❌ Necesita corrección completa
- `adminService.js` ❌ Necesita corrección completa
- `barberoService.js` ❌ Necesita corrección completa
- `pagoService.js` ❌ Necesita revisión

**Tiempo estimado:** 2-3 horas de trabajo manual

### ⚠️ Opción 2: Reemplazar Schema
Crear un nuevo `schema.sql` que coincida con el código backend actual.
- Más rápido (30 minutos)
- Pero requiere recrear la base de datos desde cero
- Se pierden los datos actuales

## ¿Qué Hemos Corregido Hasta Ahora?

### authService.js ✅ COMPLETAMENTE FUNCIONAL
```javascript
// ✅ Corregido: usa 'usuarios' (plural)
SELECT * FROM usuarios WHERE correo = ?

// ✅ Corregido: usa columna 'id' (no 'idUsuario')
UPDATE usuarios SET contrasena = ? WHERE id = ?

// ✅ Corregido: INSERT directo (sin procedimiento almacenado)
INSERT INTO usuarios (...) VALUES (...)

// ✅ Corregido: JWT usa user.id
const token = jwt.sign({ idUsuario: user.id, ... })
```

### El Login AHORA DEBERÍA FUNCIONAR ✅

Prueba con:
- **Admin:** admin@barberez.com / admin123
- **Barbero:** barbero@barberez.com / barbero123
- **Cliente:** cliente@barberez.com / cliente123

## ¿Qué Sigue?

1. **Prueba el login** con las credenciales de arriba
2. Si funciona, verás que el dashboard probablemente tenga errores al cargar citas
3. Eso es porque citaService.js todavía usa el esquema viejo

### Si quieres que funcione TODO el sistema:
**Necesito tu decisión:**
- ¿Reescribo TODOS los servicios del backend? (2-3 horas)
- ¿O prefieres usar solo el login/registro por ahora?

