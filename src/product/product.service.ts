import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMaintenceDto } from './dto/create-maintence.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        Model: {
          connect: {
            id: createProductDto.model,
          },
        },
        serialNumer: createProductDto.serialNumber,
        boughtAt: createProductDto.dateOfPurchase,
        warranty: createProductDto.warranty,
        ProductStatus: {
          connect: {
            id: createProductDto.status,
          },
        },
      },
    });
  }

  findAll() {
    return `This action returns all product`;
  }

  findForModel(id: string) {
    return this.prisma.product.findMany({
      where: {
        modelId: id,
      },
      include: {
        ProductStatus: true,
        Maintenance: {
          where: {
            productId: id,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const sumOfMaintanceCost = await this.prisma.maintenance.aggregate({
      where: {
        productId: id,
      },
      _sum: {
        price: true,
      },
    });
    const numberOfOrders = await this.prisma.productHistory.count({
      where: {
        productId: id,
      },
    });
    const lastMaintance = await this.prisma.maintenance.findFirst({
      where: {
        productId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const lastOrder = await this.prisma.order.findFirst({
      where: {
        products: {
          every: {
            id: id,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const statuses = await this.status();
    const res = await this.prisma.product.findUnique({
      where: {
        id: id,
      },
      include: {
        ProductStatus: true,
        Model: true,
      },
    });
    return {
      ...res,
      sumOfMaintanceCost: sumOfMaintanceCost._sum.price ?? 0,
      numberOfOrders: numberOfOrders ?? 0,
      lastMaintance: lastMaintance?.createdAt ?? 'Never',
      lastOrder: lastOrder?.createdAt ?? 'Never',
      statuses: statuses,
    };
  }

  async status() {
    return await this.prisma.productStatus.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }
  createStatus(status: { name: string }) {
    return this.prisma.productStatus.create({
      data: {
        name: status.name,
      },
    });
  }

  changeStatus(id: string, status: string) {
    return this.prisma.product.update({
      where: {
        id: id,
      },
      data: {
        ProductStatus: {
          connect: {
            id: status,
          },
        },
      },
    });
  }
  deleteStatus(id: string) {
    return this.prisma.productStatus.delete({
      where: {
        id: id,
      },
    });
  }

  count() {
    return this.prisma.product.count();
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async findMaintance(id: string) {
    const res = await this.prisma.maintenance.findFirst({
      where: {
        id: id,
      },
      include: {
        Product: { include: { Model: true } },
        maintenanceStatus: true,
        MaintenanceDetails: {
          where: {
            maintenanceId: id,
          },
        },
      },
    });
    if (res.start) {
      const endDate = new Date(
        new Date(res?.start).getTime() +
          res?.estimatedTime * 24 * 60 * 60 * 1000,
      );
      return {
        ...res,
        endDate: endDate,
      };
    }
    return res;
  }
  findMaintanceForProduct(id: string) {
    return this.prisma.maintenance.findMany({
      where: {
        productId: id,
      },
      include: {
        Product: true,
        maintenanceStatus: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  allMaintance() {
    return this.prisma.maintenance.findMany({
      include: {
        Product: {
          include: {
            Model: true,
          },
        },
        maintenanceStatus: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createMaintance(data: CreateMaintenceDto) {
    //check if product is in maintance
    const maintance = await this.prisma.maintenance.findFirst({
      where: {
        productId: data.productId,
        NOT: {
          maintenanceStatus: {
            name: 'Finnished' || 'Failed',
          },
        },
      },
      include: {
        maintenanceStatus: true,
      },
    });
    console.log(maintance);
    if (maintance) {
      throw new HttpException(
        'Product is already in maintance',
        HttpStatus.BAD_REQUEST,
      );
    }
    const price = data.details
      .map((e: any) => e.price)
      .reduce((a: string, b: string) => parseInt(a) + parseInt(b), 0);

    const res = await this.prisma.maintenance.create({
      data: {
        description: data.description,
        estimatedTime: data.estimatedTime,
        price: price,
        Product: {
          connect: {
            id: data.productId,
          },
        },
        maintenanceStatus: {
          connect: {
            id: data.maintenanceStatus,
          },
        },
        MaintenanceDetails: {
          create: data.details,
        },
      },
    });
    return res;
  }

  async updateMaintance(id: string, data: any) {
    //check if maintance is finished
    const maintance = await this.prisma.maintenance.findFirst({
      where: {
        id: id,
        maintenanceStatus: {
          name: 'Finished' || 'Failed',
        },
      },
    });
    if (maintance) {
      throw new HttpException(
        'Maintance is already finished',
        HttpStatus.BAD_REQUEST,
      );
    }
    console.log(data.status);
    const statusId = await this.prisma.maintenanceStatus.findFirst({
      where: {
        name: data.status,
      },
      select: {
        id: true,
      },
    });
    console.log(statusId?.id);
    const res = await this.prisma.maintenance.update({
      where: {
        id: id,
      },
      data: {
        maintenanceStatus: {
          connect: {
            name: data.status,
          },
        },
      },
    });
    return res;
  }
  getMaintanceStatus() {
    return this.prisma.maintenanceStatus.findMany();
  }

  createMaintanceStatus(data: any) {
    return this.prisma.maintenanceStatus.create({
      data: {
        name: data.name,
      },
    });
  }
  updateMaintanceStatus(id: string, data: any) {
    console.log(data, id);
    return this.prisma.maintenanceStatus.update({
      where: {
        id: id,
      },
      data: {
        name: data?.name,
        visibleOnCreate: data?.visibleOnCreate,
      },
    });
  }

  deleteMaintanceStatus(id: string) {
    return this.prisma.maintenanceStatus.delete({
      where: {
        id: id,
      },
    });
  }

  maintenceLast30Days() {
    return this.prisma.maintenance.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });
  }

  async maintenceCostLast30Days() {
    const res = await this.prisma.maintenance.aggregate({
      where: {
        createdAt: {
          gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
        },
      },
      _sum: {
        price: true,
      },
    });
    console.log(res._sum.price);
    return res._sum.price ?? 0;
  }

  updateEquipment(id: string, data: any) {
    return this.prisma.product.update({
      where: {
        id: id,
      },
      data: {
        serialNumer: data.serialNumber,
        ProductStatus: {
          connect: {
            name: data.status,
          },
        },
      },
    });
  }
  historyOfProduct(id: string) {
    return this.prisma.productHistory.findMany({
      where: {
        productId: id,
      },
      include: {
        Product: true,
        Order: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async maintenceRaport(from: string, to: string) {
    const daily = [];
    const fromStart = new Date(from).setHours(0, 0, 0, 0);
    const toStart = new Date(to).setHours(0, 0, 0, 0);
    const days = (toStart - fromStart) / (1000 * 60 * 60 * 24);
    for (let i = 0; i <= days; i++) {
      const date = new Date(fromStart + (i + 1) * 24 * 60 * 60 * 1000);
      const res = await this.prisma.maintenance.aggregate({
        where: {
          createdAt: {
            gte: new Date(date),
            lt: new Date(date.getTime() + 24 * 60 * 60 * 1000),
          },
        },
        _sum: {
          price: true,
        },
        _count: {
          id: true,
        },
      });
      daily.push({
        date: date,
        noOfMaintenance: res._count.id ?? 0,
        total: res._sum.price ?? 0,
      });
    }
    return daily;
  }
  async maintenceScheduledCountLast30Days() {
    const res = await this.prisma.maintenance.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
        },
        maintenanceStatus: {
          name: 'Scheduled',
        },
      },
    });
    return res;
  }
}
