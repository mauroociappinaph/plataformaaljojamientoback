# Arquitectura de Microservicios

Este directorio contiene la implementación de la arquitectura de microservicios para la plataforma de alojamiento vacacional.

## Estructura

```
microservices/
├── analytics-service/      # Analítica de datos y telemetría
├── api-gateway/           # Puerta de enlace API para enrutar solicitudes
├── auth-service/          # Autenticación y autorización de usuarios
├── booking-service/       # Gestión de reservas
├── config-service/        # Servicio de configuración centralizada
├── discovery-service/     # Registro y descubrimiento de servicios
├── media-service/         # Gestión de archivos multimedia (imágenes, videos)
├── messaging-service/     # Mensajería en tiempo real entre usuarios
├── notification-service/  # Envío de notificaciones (email, SMS, push)
├── payment-service/       # Procesamiento de pagos
├── property-service/      # Gestión de propiedades/alojamientos
├── recommendation-service/# Recomendaciones personalizadas con IA
├── search-service/        # Búsqueda avanzada de propiedades
├── user-service/          # Gestión de perfiles y datos de usuario
└── shared/                # Código compartido entre microservicios
```

## Servicios

### Analytics Service

Recopila y procesa datos de uso para alimentar el sistema de recomendación y generar informes de negocio.

### API Gateway

Actúa como punto de entrada único para todas las solicitudes de clientes, enrutando a los microservicios apropiados.

### Auth Service

Maneja autenticación, autorización, registro de usuarios y gestión de tokens.

### Booking Service

Gestiona reservas, disponibilidad y calendario de propiedades.

### Config Service

Proporciona configuración centralizada para todos los microservicios.

### Discovery Service

Registro y descubrimiento dinámico de servicios.

### Media Service

Gestiona el almacenamiento, procesamiento y entrega de imágenes y videos de propiedades.

### Messaging Service

Proporciona funcionalidades de chat en tiempo real entre usuarios y anfitriones utilizando WebSockets.

### Notification Service

Envía notificaciones a usuarios a través de diferentes canales (email, SMS, notificaciones push).

### Payment Service

Procesa pagos, reembolsos y gestiona transacciones.

### Property Service

Gestiona información de propiedades, búsqueda y filtrado.

### Recommendation Service

Ofrece recomendaciones personalizadas utilizando algoritmos de IA.

### Search Service

Proporciona búsqueda avanzada con filtros complejos utilizando Elasticsearch.

### User Service

Gestiona perfiles de usuarios, preferencias y datos personales.

### Shared

Código compartido entre microservicios: modelos, utilidades, middlewares y configuraciones comunes.

## Comunicación entre Servicios

Los microservicios se comunican entre sí a través de:

- API REST
- Mensajería asíncrona (con RabbitMQ/Kafka)
- gRPC para comunicaciones internas de alto rendimiento

## Despliegue

Cada microservicio tiene su propio Dockerfile y puede ser desplegado individualmente.
Ver el archivo docker-compose.yml en cada directorio para configuración específica.

## Desarrollo

Para iniciar el desarrollo de microservicios, consulte la documentación en `/docs/architecture` para lineamientos y mejores prácticas.
