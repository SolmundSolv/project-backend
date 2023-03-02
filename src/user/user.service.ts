import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async update(id: string, data: UpdateUserDto) {
    const customer = (await this.prisma.customer.findFirst({
      where: {
        userId: id,
      },
      select: {
        id: true,
      },
    })) || { id: '-1' };

    const upd = await this.prisma.customer.upsert({
      where: {
        id: customer.id,
      },
      create: {
        name: data.name,
        phone: data.phone,
        adress: {
          create: {
            street: data.street,
            city: data.city,
            zip: data.zip,
            building: data.building,
          },
        },
        User: {
          connect: {
            id: id,
          },
        },
      },
      update: {
        name: data.name,
        phone: data.phone,
        adress: {
          update: {
            street: data.street,
            city: data.city,
            zip: data.zip,
            building: data.building,
          },
        },
      },
    });

    return await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: data.name,
        email: data.email,
      },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }
  async link(employeeId: string, userId: string) {
    return await this.prisma.employee.update({
      where: {
        id: employeeId,
      },
      data: {
        User: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }
}
