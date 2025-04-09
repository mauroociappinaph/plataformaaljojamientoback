import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global para todas las rutas de la API
  app.setGlobalPrefix('api');

  // Configuración de CORS para permitir peticiones desde el frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'https://vacacional-frontend.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Configuración de validación global de DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // Puerto de escucha
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Application running on port ${port}`);
}

bootstrap();
