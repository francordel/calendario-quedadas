import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
    windowMs: 1000, // 1 segundo
    max: 10, // Límite de 10 solicitudes por IP
    message: {
        error: 'Demasiadas peticiones desde esta IP, por favor intente de nuevo en un momento'
    },
    standardHeaders: true, // Devuelve info de límite en los headers `RateLimit-*`
    legacyHeaders: false, // Deshabilita los headers `X-RateLimit-*`
});

export const mutationLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 20, // máximo 20 mutaciones por minuto por IP
    message: {
        error: 'Límite de modificaciones excedido, por favor intente más tarde'
    }
}); 