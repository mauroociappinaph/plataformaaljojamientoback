# Media Service

Este microservicio es responsable de la gestión de archivos multimedia en la plataforma, especialmente imágenes y videos de las propiedades.

## Responsabilidades

- Subida y almacenamiento de imágenes/videos
- Optimización y redimensionamiento de imágenes
- Generación de miniaturas automáticas
- Conversión de formatos de video
- Administración de CDN para entrega optimizada
- Validación y sanitización de archivos
- Gestión de permisos de acceso

## Tecnologías

- NestJS como framework
- Amazon S3 (o similar) para almacenamiento
- Sharp para procesamiento de imágenes
- FFmpeg para procesamiento de videos
- CloudFront (o similar) como CDN

## Características principales

- Subida directa a cloud storage (pre-signed URLs)
- Compresión inteligente manteniendo calidad
- Detección automática de contenido inapropiado
- Metadatos y etiquetado de imágenes
- Respuestas optimizadas según dispositivo cliente

## Rutas API

```
POST /api/media/upload         - Sube un nuevo archivo
GET /api/media/:id             - Obtiene un archivo específico
DELETE /api/media/:id          - Elimina un archivo
POST /api/media/optimize/:id   - Optimiza un archivo existente
GET /api/media/by-property/:id - Obtiene archivos asociados a una propiedad
```

## Integración con otros servicios

Este servicio se integra con:

- **auth-service**: Para validar permisos de usuarios
- **booking-service**: Para vincular imágenes a propiedades en las reservas

## Implementación de almacenamiento

Utiliza un enfoque híbrido:

- Metadatos en base de datos relacional
- Archivos binarios en almacenamiento cloud (S3)
- Caché en CDN para entrega optimizada a usuarios finales
