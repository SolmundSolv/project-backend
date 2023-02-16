import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PageService {
  constructor(private prisma: PrismaService) {}
  create(createPageDto: CreatePageDto) {
    return this.prisma.page.create({
      data: {
        name: createPageDto.name,
        title: createPageDto.title,
        href: createPageDto.href,
        PageType: {
          connect: {
            id: createPageDto.type,
          },
        },
      },
    });
  }

  findAll() {
    return `This action returns all page`;
  }

  findOne(id: number) {
    return `This action returns a #${id} page`;
  }

  update(id: number, updatePageDto: UpdatePageDto) {
    return `This action updates a #${id} page`;
  }

  remove(id: number) {
    return `This action removes a #${id} page`;
  }
}
