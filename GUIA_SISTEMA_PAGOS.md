# 💳 GUÍA COMPLETA: SISTEMA DE PAGOS CON TRANSFERENCIAS

## 📋 RESUMEN

Se ha implementado un sistema completo de pagos que incluye:
- ✅ **Efectivo**
- ✅ **Tarjeta** (Débito/Crédito)
- ✅ **Transferencia** (NUEVO)

---

## 🗄️ PASO 1: EJECUTAR SCRIPT SQL

### Opción A: Desde MySQL Workbench

1. **Abrir MySQL Workbench**
2. **Conectarse a tu base de datos**
3. **File → Open SQL Script**
4. **Seleccionar:** `barberez-web/db/agregar_sistema_pagos.sql`
5. **Click en el rayo ⚡ (Execute)**
6. **Verificar mensaje:** "Sistema de pagos creado exitosamente"

### Opción B: Desde la Terminal/PowerShell

```powershell
# Navegar a la carpeta del proyecto
cd C:\Users\2005k\Documents\pyvscodee\descargas\BarberEz-Proyect-master

# Ejecutar el script
mysql -u root -p barberia_barberez < barberez-web/db/agregar_sistema_pagos.sql

# Ingresar contraseña cuando se solicite
```

### Opción C: Desde phpMyAdmin

1. Acceder a phpMyAdmin
2. Seleccionar base de datos `barberia_barberez`
3. Click en pestaña "SQL"
4. Copiar y pegar contenido de `agregar_sistema_pagos.sql`
5. Click "Continuar"

---

## 🔧 PASO 2: REINICIAR EL BACKEND

El backend necesita reiniciarse para cargar las nuevas rutas:

```powershell
# En la terminal del backend
cd barberez-web/backend

# Detener el servidor (Ctrl + C si está corriendo)

# Reiniciar
npm start
# O si usas nodemon:
npm run dev
```

---

## 📝 PASO 3: VERIFICAR LA INSTALACIÓN

### 1. Verificar la Base de Datos

```sql
-- Verificar que la tabla existe
SHOW TABLES LIKE 'pagos';

-- Ver estructura de la tabla
DESC pagos;

-- Ver la vista
SELECT * FROM vista_pagos_completos LIMIT 1;
```

### 2. Verificar el Backend

Abre el navegador o Postman:
```
http://localhost:5000/
```

Deberías ver en los endpoints:
```json
{
  "endpoints": {
    "auth": "/api/auth",
    "citas": "/api/citas",
    "barberos": "/api/barberos",
    "servicios": "/api/servicios",
    "admin": "/api/admin",
    "pagos": "/api/pagos"  // ← NUEVO
  }
}
```

---

## 💻 USO DEL SISTEMA

### REGISTRAR UN PAGO

#### Desde el Dashboard de Admin o Barbero:

1. **Ve a la sección de Citas**
2. **Encuentra una cita confirmada**
3. **Click en "Registrar Pago"**
4. **Selecciona el método de pago:**

   **Efectivo:**
   - Solo selecciona "Efectivo"
   - Agrega notas si es necesario
   - Click "Registrar Pago"

   **Tarjeta:**
   - Selecciona "Tarjeta"
   - Ingresa los últimos 4 dígitos
   - Selecciona tipo (Débito/Crédito)
   - Click "Registrar Pago"

   **Transferencia:** (NUEVO)
   - Selecciona "Transferencia"
   - Ingresa la referencia de transferencia
   - Selecciona el banco de origen
   - Click "Registrar Pago"

---

## 🔐 VALIDACIONES IMPLEMENTADAS

### ✅ Validaciones del Backend:

1. **Método de Pago Válido**
   - Solo permite: efectivo, tarjeta, transferencia

2. **Para Transferencia:**
   - ✅ Referencia obligatoria (no vacía)
   - ✅ Banco de origen obligatorio

3. **Para Tarjeta:**
   - ✅ Últimos 4 dígitos obligatorios
   - ✅ Deben ser exactamente 4 dígitos numéricos
   - ✅ Tipo de tarjeta obligatorio (débito/crédito)

4. **Monto del Pago:**
   - ✅ Debe coincidir exactamente con el total de la cita
   - ✅ Validado automáticamente por TRIGGER en la BD

5. **No Duplicación:**
   - ✅ No permite registrar pago si ya existe uno pagado
   - ✅ Validado por procedimiento almacenado

6. **Actualización Automática:**
   - ✅ Al registrar pago, la cita se marca como "completada"

---

## 🎯 ENDPOINTS DE LA API

### POST /api/pagos
Registrar un nuevo pago

**Headers:**
```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Body - Efectivo:**
```json
{
  "citaId": 1,
  "metodoPago": "efectivo",
  "notas": "Pago recibido en efectivo"
}
```

**Body - Tarjeta:**
```json
{
  "citaId": 1,
  "metodoPago": "tarjeta",
  "ultimos4Digitos": "1234",
  "tipoTarjeta": "debito",
  "notas": "Tarjeta débito Bancolombia"
}
```

**Body - Transferencia:**
```json
{
  "citaId": 1,
  "metodoPago": "transferencia",
  "referenciaTransferencia": "987654321",
  "bancoOrigen": "Bancolombia",
  "notas": "Transferencia verificada"
}
```

### GET /api/pagos
Obtener todos los pagos

**Query Params:**
- `metodoPago`: efectivo|tarjeta|transferencia
- `estadoPago`: pendiente|pagado|reembolsado
- `fechaInicio`: YYYY-MM-DD
- `fechaFin`: YYYY-MM-DD

**Ejemplo:**
```
GET /api/pagos?metodoPago=transferencia&fechaInicio=2025-01-01
```

### GET /api/pagos/cita/:citaId
Obtener pago de una cita específica

### GET /api/pagos/estadisticas/resumen
Obtener estadísticas de pagos

### GET /api/pagos/verificar/:citaId
Verificar si una cita tiene pago

---

## 📊 CONSULTAS SQL ÚTILES

### Ver todos los pagos de hoy
```sql
SELECT * FROM vista_pagos_completos
WHERE DATE(fecha_pago) = CURDATE();
```

### Total por método de pago
```sql
SELECT 
    metodo_pago,
    COUNT(*) as cantidad,
    SUM(monto) as total
FROM pagos
WHERE estado_pago = 'pagado'
GROUP BY metodo_pago;
```

### Transferencias pendientes de confirmar
```sql
SELECT * FROM vista_pagos_completos
WHERE metodo_pago = 'transferencia'
AND estado_pago = 'pendiente';
```

### Ingresos del mes
```sql
SELECT 
    SUM(monto) as total_mes,
    COUNT(*) as pagos_mes
FROM pagos
WHERE estado_pago = 'pagado'
AND MONTH(fecha_pago) = MONTH(CURDATE())
AND YEAR(fecha_pago) = YEAR(CURDATE());
```

---

## 🔄 FLUJO COMPLETO

1. **Cliente agenda cita** → Estado: "pendiente"
2. **Barbero confirma cita** → Estado: "confirmada"
3. **Cliente llega y recibe servicio**
4. **Barbero/Admin registra pago:**
   - Selecciona método de pago
   - Completa información requerida
   - Click "Registrar Pago"
5. **Sistema valida:**
   - Monto correcto
   - Datos completos según método
   - No hay pago duplicado
6. **Si todo es correcto:**
   - ✅ Pago registrado
   - ✅ Cita marcada como "completada"
   - ✅ Se puede generar reporte

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "La tabla pagos no existe"
**Solución:** Ejecutar el script SQL `agregar_sistema_pagos.sql`

### Error: "Cannot find module './routes/pagoRoutes.js'"
**Solución:** Reiniciar el servidor backend

### Error: "La referencia de transferencia es obligatoria"
**Solución:** Completar todos los campos requeridos para transferencia

### Error: "El monto del pago no coincide"
**Solución:** El sistema calcula automáticamente, no modificar el total

### Error: "Esta cita ya tiene un pago registrado"
**Solución:** La cita ya fue pagada. Verificar en el historial.

---

## 📈 MEJORAS IMPLEMENTADAS

### 1. Validaciones Robustas
- ✅ Validación en frontend (UX)
- ✅ Validación en backend (Seguridad)
- ✅ Validación en BD (Integridad)

### 2. Información Completa
- ✅ Referencia para transferencias
- ✅ Banco de origen
- ✅ Últimos 4 dígitos tarjeta
- ✅ Tipo de tarjeta
- ✅ Usuario que procesó
- ✅ Notas adicionales

### 3. Auditoría
- ✅ Fecha y hora de pago
- ✅ Usuario que procesó
- ✅ Fecha de actualización
- ✅ Historial completo

### 4. Reportes
- ✅ Vista completa con JOIN
- ✅ Estadísticas por método
- ✅ Totales por período
- ✅ Filtros avanzados

---

## 🎓 BANCOS SOPORTADOS

El sistema incluye los principales bancos colombianos:
- Bancolombia
- Banco de Bogotá
- Davivienda
- BBVA
- Banco Av Villas
- Banco Popular
- Scotiabank Colpatria
- Banco Caja Social
- Nequi
- Daviplata
- Otro

---

## ✅ CHECKLIST DE INSTALACIÓN

- [ ] Script SQL ejecutado
- [ ] Backend reiniciado
- [ ] Tabla `pagos` existe en BD
- [ ] Vista `vista_pagos_completos` funciona
- [ ] Endpoint `/api/pagos` responde
- [ ] Modal de pago funciona en frontend
- [ ] Probado con efectivo
- [ ] Probado con tarjeta
- [ ] Probado con transferencia
- [ ] Validaciones funcionan correctamente

---

## 📞 SOPORTE

Si tienes problemas:
1. Revisa los logs del backend
2. Verifica que la BD esté corriendo
3. Asegúrate de tener el token de autenticación
4. Verifica que el rol tenga permisos (admin/barbero)

---

## 🎉 ¡SISTEMA LISTO!

Ahora tu sistema BarberEz soporta:
- 💵 Pagos en Efectivo
- 💳 Pagos con Tarjeta (Débito/Crédito)
- 🏦 Pagos por Transferencia (NUEVO)

Con validaciones completas, auditoría y reportes detallados.

