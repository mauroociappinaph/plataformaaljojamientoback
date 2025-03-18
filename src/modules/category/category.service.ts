import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {
    console.log('CategoryService constructor - prisma:', this.prisma);
  }

  create(createCategoryDto: CreateCategoryDto) {
    console.log('create method - prisma:', this.prisma);
    console.log('create method - createCategoryDto:', createCategoryDto);
    // @ts-ignore
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  findAll() {
    console.log('findAll method - prisma:', this.prisma);
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
      console.error('update method - error:', error);
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
  }

  async remove(id: string) {
    console.log('remove method - prisma:', this.prisma);
    console.log('remove method - id:', id);
    try {
      // @ts-ignore
      return await this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      console.error('remove method - error:', error);
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
  }
}
