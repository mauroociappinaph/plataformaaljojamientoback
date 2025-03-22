import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaPropertyRepository } from './repositories/prisma-property.repository';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';

@Module({
  imports: [PrismaModule],
  controllers: [PropertyController],
  providers: [
    PropertyService,
    {
      provide: 'PropertyRepository',
      useClass: PrismaPropertyRepository,
    },
  ],
  exports: [PropertyService, 'PropertyRepository'],
})
export class PropertyModule {}
