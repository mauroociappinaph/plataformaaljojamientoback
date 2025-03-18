# Plataforma de Alojamiento Vacacional

Sistema de reservas de alojamiento vacacional con recomendaciones personalizadas usando IA.

## Estructura del Proyecto

```
plataforma-alojamiento/
├── backend/           # API REST con NestJS
├── frontend/          # Interfaz de usuario con Next.js
├── docs/             # Documentación
└── .github/          # GitHub Actions y workflows
```

## Tecnologías Principales

- **Backend**:

  - NestJS
  - Prisma (ORM)
  - PostgreSQL
  - Redis
  - TensorFlow.js (Recomendaciones)

- **Frontend**:

  - Next.js
  - React
  - Tailwind CSS
  - shadcn/ui

- **Infraestructura**:
  - Docker
  - AWS
  - GitHub Actions

## Requisitos

- Node.js >= 20
- Docker y Docker Compose
- PostgreSQL
- Redis

## Instalación

1. Clonar el repositorio:

```bash
git clone [URL_DEL_REPOSITORIO]
```

2. Instalar dependencias:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Configurar variables de entorno:

```bash
# Backend
cp .env.example .env

# Frontend
cp .env.example .env
```

4. Iniciar con Docker:

```bash
cd backend
docker-compose up -d
```

## Desarrollo

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:3001`
- pgAdmin: `http://localhost:5050`
- Redis: `localhost:6379`

## Scripts Disponibles

### Backend

- `npm run start:dev`: Iniciar en modo desarrollo
- `npm run build`: Construir la aplicación
- `npm run start:prod`: Iniciar en modo producción
- `npm run test`: Ejecutar tests

### Frontend

- `npm run dev`: Iniciar en modo desarrollo
- `npm run build`: Construir la aplicación
- `npm run start`: Iniciar en modo producción
- `npm run lint`: Ejecutar linter

## Licencia

MIT
