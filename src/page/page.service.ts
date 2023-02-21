import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PageService {
  constructor(private prisma: PrismaService) {}
  async create(createPageDto: CreatePageDto) {
    const id = await this.prisma.pageType.findFirst({
      where: {
        name: createPageDto.type,
      },
    });

    return this.prisma.page.create({
      data: {
        name: createPageDto.name,
        title: createPageDto.title,
        href: createPageDto.href,
        PageType: {
          connect: {
            id: id.id,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.page.findMany({
      include: {
        PageType: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.page.findUnique({
      where: {
        id: id,
      },
      include: {
        PageType: true,
      },
    });
  }

  findByType(type: string) {
    return this.prisma.page.findMany({
      where: {
        PageType: {
          name: type,
        },
      },
      include: {
        PageType: true,
      },
    });
  }

  update(id: string, updatePageDto: UpdatePageDto) {
    return this.prisma.page.update({
      where: {
        id: id,
      },
      data: {
        name: updatePageDto.name,
        title: updatePageDto.title,
        href: updatePageDto.href,
        PageType: {
          connect: {
            id: updatePageDto.type,
          },
        },
      },
    });
  }

  remove(id: string) {
    return this.prisma.page.delete({
      where: {
        id: id,
      },
    });
  }
  addType(body: any) {
    return this.prisma.pageType.create({
      data: {
        name: body.name,
      },
    });
  }
  getTypes() {
    return this.prisma.pageType.findMany();
  }

  async createCompanyInfo(name: string, value: string) {
    const info = await this.prisma.information.findFirst({
      where: {
        name: name,
      },
    });
    if (info) {
      return this.prisma.information.update({
        where: {
          id: info.id,
        },
        data: {
          value: value,
        },
      });
    } else {
      return this.prisma.information.create({
        data: {
          name: name,
          value: value,
        },
      });
    }
  }
  getCompanyInfo() {
    return this.prisma.information.findMany();
  }
  deleteCompanyInfo(id: string) {
    return this.prisma.information.delete({
      where: {
        id: id,
      },
    });
  }
}
