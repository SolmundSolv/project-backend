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
        ModelDetails: {
          create: createProductDto.attributes.map((item) => {
            return {
              name: item.name,
              value: item.value,
            };
          }),
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
    const availableQuantity = await this.prisma.product.count({
      where: {
        modelId: id,
        ProductStatus: {
          id: 'clb3fhehx0000tk74rm7oibs7',
        },
      },
    });
    console.log('availableQuantity', availableQuantity);
    const res = await this.prisma.model.findUnique({
      where: {
        id: id,
      },
      include: {
        category: true,
        ModelDetails: {
          where: {
            modelId: id,
          },
        },
      },
    });
    return { ...res, availableQuantity };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return await this.prisma.model.update({
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
        ModelDetails: {
          create: updateProductDto.attributes.map((item) => {
            return {
              name: item.name,
              value: item.value,
            };
          }),
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

  async byCategory(id: string) {
    const res = await this.prisma.model.findMany({
      where: {
        category: {
          name: {
            contains: id,
          },
        },
      },
      include: {
        category: true,
      },
    });
    return res;
  }

  async category() {
    const res = await this.prisma.category.findMany();
    return res;
  }
  async get5Random() {
    const res = await this.prisma.model.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });
    return res;
  }
}
