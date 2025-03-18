# Arquitectura de Microservicios

Este directorio contiene la implementación de la arquitectura de microservicios para la plataforma de alojamiento vacacional.

## Estructura

```
microservices/
├── api-gateway/           # Puerta de enlace API para enrutar solicitudes
├── auth-service/          # Autenticación y autorización de usuarios
├── media-service/         # Gestión de archivos multimedia (imágenes, videos)
├── messaging-service/     # Mensajería en tiempo real entre usuarios (chat)
├── notification-service/  # Envío de notificaciones (email, SMS, push)
├── payment-service/       # Procesamiento de pagos con Stripe
├── recommendation-service/# Recomendaciones personalizadas con IA
└── shared/                # Código compartido entre microservicios
```

## Servicios

### API Gateway

Actúa como punto de entrada único para todas las solicitudes de clientes, enrutando a los microservicios apropiados.

### Auth Service

Maneja autenticación, autorización, registro de usuarios y gestión de tokens.

### Media Service

Gestiona el almacenamiento, procesamiento y entrega de imágenes y videos de propiedades usando servicios cloud.

### Messaging Service

Proporciona funcionalidades de chat en tiempo real entre usuarios y anfitriones utilizando WebSockets.

### Notification Service

Envía notificaciones a usuarios a través de diferentes canales (email, SMS, notificaciones push) utilizando Twilio.

### Payment Service

Procesa pagos, reembolsos y gestiona transacciones utilizando la API de Stripe.

### Recommendation Service

Ofrece recomendaciones personalizadas utilizando algoritmos de IA (TensorFlow).

### Shared

Código compartido entre microservicios: modelos, utilidades, middlewares y configuraciones comunes.

## Comunicación entre Servicios

Los microservicios se comunican entre sí a través de:

- API REST
- Mensajería asíncrona (con RabbitMQ/Kafka)
- gRPC para comunicaciones internas de alto rendimiento

## Gestión de Bases de Datos con Prisma

### Estrategia de Base de Datos

Cada microservicio que requiere persistencia de datos utiliza su propia instancia de Prisma con:

1. **Schema específico**: Cada servicio define su propio schema.prisma con solo los modelos relevantes
2. **Base de datos dedicada o esquema separado**: Siguiendo el patrón Database-per-Service o Schema-per-Service
3. **Migraciones independientes**: Cada servicio gestiona sus propias migraciones

### Implementación de Prisma

Los siguientes servicios implementan Prisma:

- auth-service (usuarios y autenticación)
- payment-service (transacciones y pagos)
- notification-service (plantillas y registro de notificaciones)

### Estructura dentro de cada servicio

```
[servicio]/
├── prisma/
│   ├── schema.prisma       # Definición del esquema específico
│   ├── migrations/         # Migraciones para este servicio
│   └── seed.ts             # Datos iniciales (si aplica)
└── src/
    ├── repositories/       # Capa de acceso a datos usando Prisma
    └── ...
```

## Despliegue

Cada microservicio tiene su propio Dockerfile y puede ser desplegado individualmente.
Ver el archivo docker-compose.yml en cada directorio para configuración específica.

## Desarrollo

Para iniciar el desarrollo de microservicios, consulte la documentación en `/docs/architecture` para lineamientos y mejores prácticas.
