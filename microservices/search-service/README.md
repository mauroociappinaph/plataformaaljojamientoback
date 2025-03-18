# Search Service

Este microservicio proporciona capacidades avanzadas de búsqueda, filtrado y descubrimiento de propiedades en la plataforma.

## Responsabilidades

- Búsqueda y filtrado avanzado de propiedades
- Búsqueda por ubicación geográfica
- Indexación optimizada de contenido
- Ordenamiento por relevancia y popularidad
- Sugerencias y autocompletado
- Búsqueda por facetas (filtros dinámicos)

## Funcionalidades clave

- Búsqueda de texto completo
- Filtros complejos (múltiples criterios combinados)
- Geolocalización y búsqueda por radio/área
- Ordenamiento personalizado por múltiples factores
- Agregación de resultados con estadísticas
- Caché de resultados frecuentes

## Separación del Property Service

A diferencia del `property-service` que se enfoca en la gestión CRUD y la consistencia de datos, este servicio se especializa en proporcionar **búsquedas optimizadas**:

- **search-service**: Optimizado para recuperación rápida y flexible de información
- **property-service**: Optimizado para escritura y consistencia de datos

## Tecnologías

- NestJS como framework
- Elasticsearch como motor de búsqueda
- Redis para caché de resultados frecuentes
- API especializada para consultas complejas

## Sincronización de datos

Este servicio mantiene una réplica optimizada para búsqueda de los datos de propiedades:

1. Se suscribe a eventos de cambio del `property-service`
2. Indexa y optimiza los datos para búsqueda
3. Mantiene índices secundarios para facetas y filtros

## Interacción con otros servicios

- Recibe datos de `property-service` (vía eventos o sincronización)
- Consulta `analytics-service` para incorporar popularidad en rankings
- Integra con `recommendation-service` para búsquedas personalizadas

## API de búsqueda

Proporciona endpoints especializados para:

- Búsqueda por texto
- Filtrado por criterios múltiples
- Búsqueda geoespacial
- Agregación y facetas
- Ordenamiento personalizado
