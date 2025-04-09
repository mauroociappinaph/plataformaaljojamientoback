import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Creamos una versión personalizada de PrismaClient que evita problemas de inicialización
const { PrismaClient } = require('@prisma/client');

// Clase singleton para acceder a Prisma
const prisma = new PrismaClient({
  // Las opciones básicas para evitar el error de enableTracing
  __internal: {
    enableExperimentalTracing: false,
    engine: {
      enableTracing: false,
    },
  },
});

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // Exponemos todas las propiedades y métodos del cliente Prisma
  [key: string]: any;

  constructor(private config: ConfigService) {
    // Copiamos todas las propiedades y métodos de prisma a esta instancia
    return new Proxy(this, {
      get: (target, prop) => {
        // Si la propiedad existe en this, la devolvemos
        if (prop in target) {
          return target[prop as string];
        }
        // Sino, accedemos a la propiedad en prisma
        return prisma[prop as string];
      },
    });
  }

  async onModuleInit() {
    await prisma.$connect();
  }

  async onModuleDestroy() {
    await prisma.$disconnect();
  }
}
