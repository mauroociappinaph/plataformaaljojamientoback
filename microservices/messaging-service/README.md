# Messaging Service

Este microservicio gestiona todas las comunicaciones **bidireccionales** en tiempo real entre usuarios dentro de la plataforma.

## Responsabilidades

- Chat en tiempo real entre huéspedes y anfitriones
- Sistema de mensajería interna
- Gestión de estado de conexión y presencia de usuarios
- Historial de conversaciones
- Envío de archivos y multimedia en conversaciones

## Funcionalidades principales

- Chat en tiempo real con WebSockets
- Estado de mensajes (enviado, entregado, leído)
- Notificación de escritura en tiempo real
- Persistencia de mensajes para historial
- Búsqueda en historial de conversaciones
- Agrupación de conversaciones por propiedad/reserva

## Tecnologías

- NestJS como framework
- Socket.IO para comunicación en tiempo real
- Redis para gestión de presencia y estado
- MongoDB para almacenamiento de mensajes (optimizado para alta escritura)
- AWS S3 para almacenamiento de archivos compartidos

## Interacción con otros servicios

A diferencia del `notification-service` que maneja comunicaciones unidireccionales del sistema hacia los usuarios, este servicio facilita la comunicación directa entre usuarios.

### Integración con:

- user-service (para información de perfiles)
- booking-service (para asociar conversaciones con reservas)
- property-service (para asociar conversaciones con propiedades)
- notification-service (para notificar a usuarios cuando reciben mensajes offline)

## Modelo de datos

- Conversaciones
- Mensajes
- Estado de lectura
- Archivos adjuntos
- Metadatos de mensajes
