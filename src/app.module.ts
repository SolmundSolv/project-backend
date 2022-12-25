import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ModelModule } from './model/model.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { AnalyticMiddleware } from './middleware/analytics.middleware';
import { AnalyticsModule } from './analytics/analytics.module';
import { ProductController } from './model/model.controller';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ModelModule,
    AuthModule,
    PrismaModule,
    OrderModule,
    UserModule,
    ProductModule,
    AnalyticsModule,
    EmployeeModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any | Promise<any> {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer
      .apply(AnalyticMiddleware)
      .exclude('model/search/(.*)')
      .forRoutes(ProductController);
  }
}
