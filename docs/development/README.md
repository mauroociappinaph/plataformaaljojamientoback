# Guía de Desarrollo

## Configuración del Entorno

### Requisitos

- Node.js >= 20
- Docker y Docker Compose
- Git
- VS Code (recomendado)

### Extensions de VS Code Recomendadas

- ESLint
- Prettier
- Docker
- GitLens
- Prisma

## Flujo de Trabajo Git

### Branches

- `main`: Producción
- `develop`: Desarrollo
- `feature/*`: Nuevas características
- `bugfix/*`: Correcciones de bugs
- `hotfix/*`: Correcciones urgentes

### Commits

```
feat: nueva característica
fix: corrección de bug
docs: cambios en documentación
style: cambios de estilo
refactor: refactorización de código
test: añadir o modificar tests
chore: tareas de mantenimiento
```

## Estándares de Código

### TypeScript

- Usar tipos estrictos
- Evitar `any`
- Documentar interfaces
- Usar enums para valores constantes

### React/Next.js

- Componentes funcionales
- Hooks personalizados
- Props tipadas
- Evitar prop drilling

### NestJS

- DTOs para validación
- Guards para autenticación
- Interceptors para transformación
- Pipes para validación

## Testing

### Backend

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Cobertura
npm run test:cov
```

### Frontend

```bash
# Tests unitarios
npm run test

# Tests de componentes
npm run test:components

# Tests e2e
npm run test:e2e
```

## Linting y Formateo

### Backend

```bash
# Lint
npm run lint

# Formatear
npm run format
```

### Frontend

```bash
# Lint
npm run lint

# Formatear
npm run format
```
