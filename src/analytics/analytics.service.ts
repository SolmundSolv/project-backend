import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';
import { UpdateAnalyticsDto } from './dto/update-analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}
  findAll() {
    return this.prisma.analytics.findMany();
  }
  async dailyAll() {
    return await this.prisma.analytics.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });
  }
  async mostLooked() {
    //return model's name and count of views in last month
    const grouped = await this.prisma.analytics.groupBy({
      by: ['modelId'],
      where: {
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      },
    });
    const count = [];
    //count views for each model
    for (let i = 0; i < grouped.length; i++) {
      const number = await this.prisma.analytics.count({
        where: {
          modelId: grouped[i].modelId,
        },
      });
      count.push({ modelId: grouped[i].modelId, count: number });
    }
    //sort by count
    count.sort((a, b) => {
      return b.count - a.count;
    });
    //return top 5
    return count.slice(0, 5);
  }
}
