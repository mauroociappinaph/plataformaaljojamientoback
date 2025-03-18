# API de Plataforma de Alojamiento Vacacional

## Configuración

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

## Endpoints

### Autenticación

#### Registro de Usuario

- **URL**: `/auth/register`
- **Método**: `POST`
- **Headers**:
  - `Content-Type: application/json`
- **Body**:

```json
{
  "email": "test@example.com",
  "password": "test123",
  "name": "Test User"
}
```

- **Respuesta**:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login de Usuario

- **URL**: `/auth/login`
- **Método**: `POST`
- **Headers**:
  - `Content-Type: application/json`
- **Body**:

```json
{
  "email": "test@example.com",
  "password": "test123"
}
```

- **Respuesta**:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Colección de Postman

Se incluye una colección de Postman (`postman_collection.json`) que puedes importar directamente en Postman para probar los endpoints.

Para importar la colección:

1. Abrir Postman
2. Click en "Import"
3. Arrastrar el archivo `postman_collection.json` o seleccionarlo desde el explorador de archivos
4. La colección se importará con todos los endpoints configurados
