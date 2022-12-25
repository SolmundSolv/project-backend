import { Module } from '@nestjs/common';
import { ProductService } from './model.service';
import { ProductController } from './model.controller';
import { RolesGuard } from 'src/auth/guard/role.guard';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
})
export class ModelModule {}
