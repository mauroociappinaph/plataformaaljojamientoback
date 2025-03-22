import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  // Configuración para el mensaje personalizado
  const customLogger = new Logger('SERVER');

  // Crear la aplicación con configuración de logger reducida
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'], // Solo mostrar errores y advertencias
  });

  // Configuración de pipes globales
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Configuración del prefijo global
  app.setGlobalPrefix('api');

  // Configuración detallada de CORS
  app.enableCors({
    origin: true, // Permitir todas las origenes en desarrollo
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Obtener puerto de la variable de entorno o usar 3000 por defecto
  const port = process.env.PORT || 3000;
  await app.listen(port);

  // Mensajes muy destacados para que sean visibles
  console.log('\n\n');
  console.log('==========================================================');
  console.log(`|                                                        |`);
  console.log(`|  🚀 SERVIDOR INICIADO EN: http://localhost:${port}         |`);
  console.log(`|                                                        |`);
  console.log('==========================================================');
  console.log('\n\n');
}
bootstrap();
