# Property Service

Este microservicio gestiona el ciclo de vida y la información de las propiedades disponibles para alquiler en la plataforma.

## Responsabilidades

- Creación, actualización y eliminación de propiedades
- Gestión de detalles de propiedad (ubicación, capacidad, características)
- Administración de disponibilidad y calendarios
- Gestión de precios y políticas de cancelación
- Vinculación de propiedades con anfitriones
- Gestión de imágenes y recursos multimedia asociados

## Funcionalidades clave

- CRUD completo de propiedades
- Validación de datos de propiedad
- Manejo de categorías y características
- Gestión de disponibilidad por fechas
- Pricing dinámico y reglas de precios especiales
- API básica de consulta para operaciones simples

## Búsqueda vs. Gestión

Este servicio se centra en la **gestión de entidades** y proporciona solo consultas básicas por ID o criterios simples. **No implementa la funcionalidad de búsqueda avanzada**, que es responsabilidad del `search-service`.

### División de responsabilidades:

- **property-service**: Administra el ciclo CRUD completo, enfocado en la precisión y consistencia de los datos
- **search-service**: Proporciona búsqueda avanzada, filtrado, geolocalización y ranking basado en relevancia

## Tecnologías

- NestJS como framework
- Prisma como ORM
- PostgreSQL para almacenamiento principal
- AWS S3 para almacenamiento de imágenes (a través del media-service)

## Interacción con otros servicios

- Proporciona datos a `search-service` mediante eventos o sincronización
- Coordina con `booking-service` para gestión de disponibilidad
- Integra con `user-service` para información de anfitriones
- Utiliza `media-service` para gestión de archivos multimedia

## Modelo de datos

- Propiedades
- Categorías
- Características
- Disponibilidad
- Precios
- Políticas
