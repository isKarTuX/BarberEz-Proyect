# 🚀 CÓMO EJECUTAR LOS SCRIPTS SQL

## 📋 SCRIPTS DISPONIBLES

### 1. **agregar_servicios.sql** - Agregar nuevos servicios
- Limpieza facial
- Arreglo de cejas  
- Tinte de pelo

### 2. **agregar_estado_confirmada.sql** - Agregar estado "confirmada" ⭐ NUEVO
- Modifica la tabla `cita` para incluir el estado "confirmada"
- Estados disponibles: pendiente, **confirmada**, completada, cancelada

---

## ✅ OPCIÓN 1: MySQL Workbench (RECOMENDADO - MÁS FÁCIL)

### Para agregar servicios:
1. Abre **MySQL Workbench**
2. Conecta a tu servidor local (localhost)
3. Click en **File → Open SQL Script**
4. Navega a: `backend\agregar_servicios.sql`
5. Click en el icono del **rayo ⚡** para ejecutar
6. Deberías ver: "3 row(s) affected"
7. ✅ ¡Listo!

### Para agregar estado "confirmada":
1. Abre **MySQL Workbench** (si no está abierto)
2. Click en **File → Open SQL Script**
3. Navega a: `backend\agregar_estado_confirmada.sql`
4. Click en el icono del **rayo ⚡** para ejecutar
5. Deberías ver: "0 row(s) affected" (esto es normal, solo modifica la estructura)
6. ✅ ¡Listo!

---

## ✅ OPCIÓN 2: Copiar y Pegar Directamente

### Paso 1: Agregar nuevos servicios
1. Abre **MySQL Workbench**
2. Conecta a tu servidor local
3. Copia este código y pégalo en una nueva query:

```sql
USE barberia_barberez;

-- Insertar nuevos servicios
INSERT INTO servicio (nombre, duracion, precio, activo) VALUES
('Limpieza facial', 40, 30000, TRUE),
('Arreglo de cejas', 15, 8000, TRUE),
('Tinte de pelo', 60, 35000, TRUE);

-- Verificar servicios
SELECT * FROM servicio;
```

4. Click en el icono del **rayo ⚡**
5. Deberías ver los 6 servicios
6. ✅ ¡Listo!

### Paso 2: Agregar estado "confirmada" ⭐ IMPORTANTE
1. En la misma ventana de MySQL Workbench
2. Copia este código en una nueva query:

```sql
USE barberia_barberez;

-- Agregar estado 'confirmada' al ENUM
ALTER TABLE cita 
MODIFY COLUMN estado ENUM('pendiente', 'confirmada', 'completada', 'cancelada') 
DEFAULT 'pendiente';

-- Verificar que se agregó correctamente
SELECT COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'barberia_barberez' 
  AND TABLE_NAME = 'cita' 
  AND COLUMN_NAME = 'estado';
```

3. Click en el icono del **rayo ⚡**
4. Deberías ver: `enum('pendiente','confirmada','completada','cancelada')`
5. ✅ ¡Listo!

---

## ✅ OPCIÓN 3: PowerShell con ruta completa de MySQL

Si quieres usar línea de comandos, necesitas la ruta completa de MySQL:

### Encontrar MySQL:
```powershell
# Buscar donde está instalado MySQL
Get-ChildItem "C:\Program Files\MySQL" -Recurse -Filter "mysql.exe" -ErrorAction SilentlyContinue
Get-ChildItem "C:\Program Files (x86)\MySQL" -Recurse -Filter "mysql.exe" -ErrorAction SilentlyContinue
```

### Una vez que lo encuentres, usa la ruta completa:
```powershell
# Ejemplo (ajusta la ruta según tu instalación):
cd "C:\Users\2005k\Documents\pyvscodee\descargas\BarberEz-Proyect-master\barberez-web\backend"

"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p barberia_barberez -e "source agregar_servicios.sql"
```

---

## ✅ OPCIÓN 4: Agregar MySQL al PATH (Para el futuro)

Si quieres poder usar `mysql` directamente en PowerShell:

1. Abre **Configuración del sistema**
2. Busca "Variables de entorno"
3. En "Variables del sistema", edita "Path"
4. Agrega: `C:\Program Files\MySQL\MySQL Server 8.0\bin`
5. Reinicia PowerShell
6. Ahora podrás usar `mysql` directamente

---

## 🧪 VERIFICAR QUE TODO FUNCIONÓ

### 1. Verificar servicios:
```sql
USE barberia_barberez;
SELECT * FROM servicio;
```

**Deberías ver 6 servicios:**
1. Corte de cabello - $15,000
2. Arreglo de barba - $10,000
3. Tinte - $25,000
4. **Limpieza facial - $30,000** ← NUEVO
5. **Arreglo de cejas - $8,000** ← NUEVO
6. **Tinte de pelo - $35,000** ← NUEVO

### 2. Verificar estados de cita: ⭐ IMPORTANTE
```sql
USE barberia_barberez;

SELECT COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'barberia_barberez' 
  AND TABLE_NAME = 'cita' 
  AND COLUMN_NAME = 'estado';
```

**Deberías ver:**
```
enum('pendiente','confirmada','completada','cancelada')
```

✅ Si ves los 4 estados, ¡todo está correcto!

---

## 🎯 RECOMENDACIÓN

**Usa la OPCIÓN 1 o 2 (MySQL Workbench)** - Es la más fácil y segura.

1. Abre MySQL Workbench
2. File → Open SQL Script
3. Selecciona `agregar_servicios.sql`
4. Click en el rayo ⚡
5. ✅ ¡Listo!

---

## ❓ SI TIENES PROBLEMAS

### Error: "Duplicate entry"
Si ya agregaste los servicios antes, verás este error. Significa que ya están creados. Puedes:

```sql
-- Verificar servicios existentes
SELECT * FROM servicio;

-- Si quieres actualizar precios:
UPDATE servicio SET precio = 30000 WHERE nombre = 'Limpieza facial';
UPDATE servicio SET precio = 8000 WHERE nombre = 'Arreglo de cejas';
UPDATE servicio SET precio = 35000 WHERE nombre = 'Tinte de pelo';
```

### No puedo conectar a MySQL
Verifica que el servicio MySQL esté corriendo:
1. Abre "Servicios" en Windows
2. Busca "MySQL"
3. Debe estar "En ejecución"
4. Si no, click derecho → Iniciar

---

## ✅ SIGUIENTE PASO

Una vez que ejecutes el SQL:

1. Reinicia el frontend:
```powershell
cd C:\Users\2005k\Documents\pyvscodee\descargas\BarberEz-Proyect-master\barberez-web\frontend
npm run dev
```

2. Login como cliente y verifica que aparezcan los 6 servicios al agendar cita

**¡Listo! 🚀💈**

