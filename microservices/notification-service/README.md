# Notification Service

Este microservicio es responsable de gestionar todas las comunicaciones **unidireccionales** del sistema hacia los usuarios.

## Responsabilidades

- Envío de notificaciones por email (confirmaciones, recordatorios, etc.)
- Envío de SMS para alertas y verificaciones
- Gestión de notificaciones push para dispositivos móviles
- Plantillas de notificaciones personalizables
- Seguimiento y análisis de entregas y aperturas

## Comunicaciones gestionadas

- Confirmaciones de reserva
- Recordatorios de check-in/check-out
- Alertas de pago
- Notificaciones de cambios en reservas/propiedades
- Comunicaciones de marketing
- Alertas de seguridad

## Tecnologías

- NestJS como framework
- Nodemailer para emails
- Twilio para SMS
- Firebase Cloud Messaging para notificaciones push
- Redis para colas de notificaciones
- PostgreSQL para almacenamiento de plantillas y registro de envíos

## Interacción con otros servicios

Este servicio se comunica principalmente mediante eventos y no gestiona comunicaciones en tiempo real entre usuarios, que son manejadas por el `messaging-service`.

### Recibe eventos de:

- booking-service (para notificaciones de reserva)
- payment-service (para confirmaciones de pago)
- auth-service (para verificaciones)
- property-service (para actualizaciones de propiedades)

## Modelo de datos

- Plantillas de notificación
- Preferencias de notificación del usuario
- Historial de notificaciones enviadas
- Estado de entregas y aperturas
