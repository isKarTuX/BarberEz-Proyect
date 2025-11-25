# 🔍 DEBUGGING - ¿Qué está pasando?

## ⚠️ Error Actual
- **400 Bad Request** → Validación fallando
- **401 Unauthorized** → Usuario/contraseña incorrectos

## ✅ Cambios Aplicados

He **simplificado las validaciones** y agregado **logs detallados**.

### Antes:
```javascript
body('correo').isEmail()  // ❌ Muy estricto
body('contrasena').isLength({ min: 6 })  // ❌ Rechaza contraseñas cortas
```

### Ahora:
```javascript
body('correo').notEmpty()  // ✅ Solo verifica que no esté vacío
body('contrasena').notEmpty()  // ✅ Acepta cualquier contraseña
```

---

## 🔍 PASOS PARA DIAGNOSTICAR

### 1️⃣ Intenta hacer login de nuevo

### 2️⃣ Verás en la consola del servidor (terminal backend):

**Si ves esto:**
```
📨 Login attempt: { correo: 'tu@correo.com' }
❌ Validation errors: [...]
```
→ **Problema:** Los datos no están llegando correctamente

**Si ves esto:**
```
📨 Login attempt: { correo: 'tu@correo.com' }
❌ Login error: Usuario no encontrado
```
→ **Problema:** El correo no existe en la base de datos

**Si ves esto:**
```
📨 Login attempt: { correo: 'tu@correo.com' }
❌ Login error: Contraseña incorrecta
```
→ **Problema:** La contraseña no coincide

---

## 🎯 SOLUCIONES POSIBLES

### Si el usuario no existe:
Verifica en MySQL:
```sql
USE barberia_barberez;
SELECT * FROM usuario;
```

### Si la contraseña no coincide:
Las contraseñas deben estar hasheadas con bcrypt. Si están en texto plano, el código las migrará automáticamente.

---

## 📝 COPIA EL LOG

**Después de intentar login, copia TODA la salida del terminal del backend y pégamela aquí.**

Así podré ver exactamente qué está fallando.
