import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnalyticMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}
  use(req: Request, res: Response, next: NextFunction) {
    //pick model id from url
    const modelId = req.originalUrl.split('/')[2];
    //check if ip already enter page last month
    this.prisma.analytics
      .findMany({
        where: {
          ip: req.ip,
          modelId: modelId,
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          },
        },
      })
      .then((res) => {
        if (res.length == 0) {
          let res = this.prisma.analytics.create({
            data: {
              ip: req.ip,
              model: {
                connect: {
                  id: modelId,
                },
              },
            },
          });
          res.then((res) => {});
        }
      });

    next();
  }
}
