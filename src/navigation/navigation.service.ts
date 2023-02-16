import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNavigationDto } from './dto/create-navigation.dto';
import { UpdateNavigationDto } from './dto/update-navigation.dto';

@Injectable()
export class NavigationService {
  constructor(private prisma: PrismaService) {}
  async create(name: string, href: string, type: string, iconPath: string) {
    const res = await this.prisma.navigationType.findFirst({
      where: {
        name: type,
      },
    });

    return this.prisma.navigation.create({
      data: {
        name: name,
        href: href,
        iconPath: iconPath,
        NavigationType: {
          connect: {
            id: res.id,
          },
        },
      },
    });
  }

  createType(name: string) {
    return this.prisma.navigationType.create({
      data: {
        name,
      },
    });
  }
  findAllTypes() {
    return this.prisma.navigationType.findMany();
  }
  updateType(id: string, name: string) {
    return this.prisma.navigationType.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });
  }
  findByType(type: string) {
    return this.prisma.navigation.findMany({
      where: {
        NavigationType: {
          name: type,
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.navigation.findUnique({
      where: {
        id: id,
      },
    });
  }

  update(
    id: string,
    name: string,
    href: string,
    type: string,
    iconPath: string,
  ) {
    return this.prisma.navigation.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        href: href,
        iconPath: iconPath,
        NavigationType: {
          connect: {
            id: type,
          },
        },
      },
    });
  }

  remove(id: string) {
    return this.prisma.navigation.delete({
      where: {
        id: id,
      },
    });
  }
}
