import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {
    // Constructor sin logs innecesarios
  }

  create(createCategoryDto: CreateCategoryDto) {
    // @ts-ignore
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  findAll() {
    // @ts-ignore
    return this.prisma.category.findMany();
  }

  async findOne(id: string) {
    // @ts-ignore
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      // @ts-ignore
      return await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
      });
    } catch (error) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
  }

  async remove(id: string) {
    try {
      // @ts-ignore
      return await this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
  }
}
