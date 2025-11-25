# 🔐 CREDENCIALES DE PRUEBA - BarberEz

## ⚠️ PROBLEMA ACTUAL

Tu error `401 Unauthorized` puede deberse a:

1. **Servidor no reiniciado** después de agregar express-validator
2. **Contraseña muy corta** (validación requiere mínimo 6 caracteres)
3. **Usuario no existe** en la base de datos

---

## 📋 CREDENCIALES DE PRUEBA

### 👨‍💼 Administrador
- **Email**: `admin@barberez.com`
- **Contraseña**: `admin123`
- **Rol**: admin

### ✂️ Barberos
- **Email**: `barbero@barberez.com`
- **Contraseña**: `barbero123`
- **Rol**: barbero

### 👤 Cliente
- **Email**: `cliente@barberez.com`
- **Contraseña**: `cliente123`
- **Rol**: cliente

---

## 🔧 SOLUCIÓN RÁPIDA

### Opción 1: Reiniciar Servidor Backend (RECOMENDADO)

```powershell
# 1. Detener todos los procesos Node
Stop-Process -Name node -Force

# 2. Ir al directorio backend
cd backend

# 3. Iniciar servidor
npm start
```

### Opción 2: Verificar Validación

El servidor ahora valida:
- ✅ **Email**: Debe ser formato válido (ejemplo@dominio.com)
- ✅ **Contraseña**: Mínimo 6 caracteres

Si tu contraseña tiene menos de 6 caracteres, recibirás error 400.

---

## 🐛 DEBUG

### Ver logs del servidor:

```powershell
cd backend
npm start
```

Deberías ver en consola:
```
[TIMESTAMP] POST /api/auth/login - IP: ::1
```

### Si ves error 400:
- La validación falló
- Revisa que email sea válido
- Revisa que contraseña tenga 6+ caracteres

### Si ves error 401:
- Usuario no existe, O
- Contraseña incorrecta

---

## ✅ PRUEBA RÁPIDA

1. **Detén el servidor actual**:
   ```powershell
   Stop-Process -Name node -Force
   ```

2. **Reinicia el backend**:
   ```powershell
   cd backend
   npm start
   ```

3. **Intenta login con**:
   - Email: `admin@barberez.com`
   - Password: `admin123`

4. **Si sigue fallando**, verifica que la base de datos tenga los usuarios:
   ```sql
   SELECT correo, rol FROM usuario WHERE correo = 'admin@barberez.com';
   ```

---

## 📌 NOTA IMPORTANTE

Después de las mejoras implementadas, el sistema:
- ✅ Valida formato de email
- ✅ Valida longitud de contraseña (6+)
- ✅ Limita a 5 intentos cada 15 minutos
- ✅ Migra contraseñas automáticamente a bcrypt

Si estabas usando una contraseña de prueba corta (ej: "123"), ahora debes usar una con 6+ caracteres.
