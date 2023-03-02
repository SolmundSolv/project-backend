import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { KanbanTasksModule } from './kanban-tasks/kanban-tasks.module';
import { ImageModule } from './image/image.module';
import { CartModule } from './cart/cart.module';
import { EmailModule } from './email/email.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PageModule } from './page/page.module';
import { NavigationModule } from './navigation/navigation.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: 'konradqxd@gmail.com',
            pass: configService.get('EMAIL_PASS'),
          },
        },
      }),
      inject: [ConfigService],
    }),
    ModelModule,
    AuthModule,
    PrismaModule,
    OrderModule,
    UserModule,
    ProductModule,
    AnalyticsModule,
    EmployeeModule,
    KanbanTasksModule,
    ImageModule,
    CartModule,
    EmailModule,
    PageModule,
    NavigationModule,
    StripeModule,
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
//Q: regex when word has not "."
