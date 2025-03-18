# API de Plataforma de Alojamiento Vacacional

## Configuración

### Sin Docker

1. Instalar dependencias:

```bash
npm install
```

2. Configurar variables de entorno:

- Copiar `.env.example` a `.env`
- Actualizar las variables según tu configuración

3. Configurar la base de datos:

```bash
npx prisma generate
npx prisma migrate dev
```

4. Iniciar el servidor:

```bash
npm run start:dev
```

### Con Docker

1. Construir y ejecutar los contenedores:

```bash
docker-compose up --build
```

2. Para ejecutar en segundo plano:

```bash
docker-compose up -d
```

3. Para detener los contenedores:

```bash
docker-compose down
```

4. Para ver los logs:

```bash
docker-compose logs -f
```

## Endpoints

### Autenticación

#### Registro de Usuario

- **URL**: `/auth/register`
- **Método**: `POST`
- **Headers**:
  - `Content-Type: application/json`
