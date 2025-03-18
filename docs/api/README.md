# Documentación de la API

## Endpoints

### Autenticación

- POST /auth/register
- POST /auth/login
- POST /auth/logout

### Propiedades

- GET /properties
- GET /properties/:id
- POST /properties
- PUT /properties/:id
- DELETE /properties/:id

### Reservas

- GET /bookings
- GET /bookings/:id
- POST /bookings
- PUT /bookings/:id
- DELETE /bookings/:id

### Recomendaciones

- GET /recommendations
- GET /recommendations/properties/:id

## Modelos de Datos

### Usuario

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
}
```

### Propiedad

```typescript
interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  amenities: string[];
  images: string[];
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Reserva

```typescript
interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
```
