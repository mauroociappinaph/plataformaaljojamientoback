# Arquitectura del Sistema

## Visión General

El sistema está diseñado con una arquitectura moderna y escalable, utilizando las siguientes tecnologías y patrones:

- Arquitectura de Microservicios
- Diseño Event-Driven
- Patrón CQRS
- Clean Architecture

## Componentes Principales

### Backend (NestJS)

- API REST
- Autenticación JWT
- ORM Prisma
- Caché Redis
- Sistema de Recomendaciones con TensorFlow.js

### Frontend (Next.js)

- React con TypeScript
- Tailwind CSS
- shadcn/ui
- Estado Global con Zustand
- React Query para caché

### Base de Datos

- PostgreSQL para datos principales
- Redis para caché y sesiones

### Infraestructura

- Docker para contenedorización
- AWS para hosting
- GitHub Actions para CI/CD

## Diagramas

### Arquitectura General

```
[Cliente] → [Frontend (Next.js)] → [Backend (NestJS)] → [Base de Datos]
     ↑            ↑                      ↑
     └────────────┴──────────────────────┘
              [Redis Cache]
```

### Flujo de Datos

```
[Usuario] → [UI] → [API] → [Servicios] → [Base de Datos]
     ↑         ↑        ↑         ↑
     └─────────┴────────┴─────────┘
              [Redis Cache]
```

## Decisiones de Diseño

1. **Microservicios**

   - Separación clara de responsabilidades
   - Escalabilidad independiente
   - Despliegue independiente

2. **Event-Driven**

   - Mejor manejo de operaciones asíncronas
   - Desacoplamiento de servicios
   - Mejor escalabilidad

3. **Clean Architecture**
   - Separación clara de capas
   - Independencia de frameworks
   - Testabilidad mejorada
