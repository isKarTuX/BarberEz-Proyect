# Rate Limiter - Información

## ¿Qué es?
El rate limiter es un mecanismo de seguridad que limita la cantidad de intentos de login para prevenir ataques de fuerza bruta.

## Configuración Actual

### Desarrollo (NODE_ENV !== 'production')
- **Ventana de tiempo**: 5 minutos
- **Máximo de intentos**: 50
- **Mensaje**: "Demasiados intentos de login. Por favor intenta en 5 minutos."

### Producción (NODE_ENV === 'production')
- **Ventana de tiempo**: 15 minutos
- **Máximo de intentos**: 5
- **Mensaje**: "Demasiados intentos de login. Por favor intenta en 15 minutos."

## ¿Cómo solucionarlo si estás bloqueado?

### Opción 1: Esperar
Espera el tiempo indicado (5 min en desarrollo, 15 min en producción)

### Opción 2: Reiniciar el servidor
```bash
# Detener el servidor (Ctrl+C)
# Iniciar de nuevo
npm start
# o
npm run dev
```

### Opción 3: Limpiar cache del navegador
1. Abre las DevTools (F12)
2. Click derecho en el botón de recargar
3. Selecciona "Vaciar caché y recargar"

### Opción 4: Usar modo incógnito
Abre una ventana de incógnito en tu navegador

### Opción 5: Cambiar IP (temporal)
- Desconecta y reconecta tu WiFi
- Usa una VPN
- Usa datos móviles

## Para desactivar completamente (solo desarrollo)

Edita `routes/authRoutes.js`:

```javascript
const loginLimiter = rateLimit({
    // ... configuración existente ...
    skip: (req) => {
        return process.env.NODE_ENV !== 'production'; // Desactivar en desarrollo
    }
});
```

## Notas de Seguridad

⚠️ **IMPORTANTE**: Nunca desactives el rate limiter en producción. Es una medida de seguridad crítica.

El rate limiter actual usa memoria del servidor (no Redis), por lo que se reinicia cuando:
- Reinicias el servidor
- El servidor se cae
- Despliegas una nueva versión

Para una solución más robusta en producción, considera usar Redis como almacenamiento del rate limiter.

