import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    //create product in db
    return this.prisma.model.create({
      data: {
        name: createProductDto.name,
        price: createProductDto.price,
        description: createProductDto.description,
        img: createProductDto.img,
        isActive: createProductDto.isActive,
        category: {
          connect: {
            id: createProductDto.category,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.model.findMany({
      include: {
        category: true,
      },
    });
  }

  async findOne(id: string) {
    const res = await this.prisma.model.findUnique({
      where: {
        id: id,
      },
      include: {
        category: true,
      },
    });
    return res;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.prisma.model.update({
      where: {
        id: id,
      },
      data: {
        name: updateProductDto.name,
        price: updateProductDto.price,
        description: updateProductDto.description,
        img: updateProductDto.img,
        isActive: updateProductDto.isActive,
        category: {
          connect: {
            id: updateProductDto.category,
          },
        },
      },
    });
  }

  remove(id: string) {
    return this.prisma.model.update({
      where: {
        id: id,
      },
      data: {
        isActive: false,
      },
    });
  }

  async byName(name: string) {
    const res = await this.prisma.model.findMany({
      where: {
        name: {
          contains: name,
        },
      },
      include: {
        category: true,
      },
    });
    return res;
  }
}
