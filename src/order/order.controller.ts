import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  //done and working
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    try {
      return this.orderService.create(createOrderDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Some products are not available',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
  @Get()
  findAll() {
    return this.orderService.findAll();
  }
  @Get('count')
  count() {
    return this.orderService.count();
  }
  @Get('revenue')
  revenue() {
    return this.orderService.revenue();
  }
  @Get('in-progress')
  findInProgress() {
    return this.orderService.findInProgress();
  }

  @Get('user/:id')
  findUserOrders(@Param('id') id: string) {
    return this.orderService.findOrdersByUser(id);
  }

  @Get('waiting')
  findWaiting() {
    return this.orderService.findWaiting();
  }
  @Get('charts')
  getCharts() {
    return this.orderService.getWeeklyOrders();
  }

  @Get('exceded')
  findExceded() {
    return this.orderService.findExceded();
  }
  @Get('status')
  findStatus() {
    return this.orderService.findStatuses();
  }

  @Post('status')
  createStatus(@Body() status: { name: string }) {
    return this.orderService.createStatus(status);
  }
  @Patch('status/:id')
  updateStatus(@Param('id') id: string, @Body() status: { name: string }) {
    return this.orderService.updateStatus(id, status);
  }
  @Delete('status/:id')
  deleteStatus(@Param('id') id: string) {
    return this.orderService.deleteStatus(id);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }

  @Post(':id/add-products')
  addProductToOrder(
    @Param('id') id: string,
    @Body() productsId: { selectedProducts: { id: string }[] },
    @Body() price: { price: number },
  ) {
    return this.orderService.addProductsToOrder(id, productsId, price);
  }

  @Delete(':id/products/:productId')
  deleteProductFromOrder(
    @Param('id') id: string,
    @Param('productId') productId: string,
  ) {
    return this.orderService.deleteProductFromOrder(id, productId);
  }
  @Post(':id/completed')
  completeOrder(@Param('id') id: string) {
    return this.orderService.completeOrder(id);
  }
  @Post(':id/procide')
  procideOrder(@Param('id') id: string) {
    return this.orderService.procideOrder(id);
  }

  @Post(':id/cancel')
  cancelOrder(@Param('id') id: string) {
    return this.orderService.cancelOrder(id);
  }
  @Post('raport')
  raport(@Body() raport: { startDate: string; endDate: string }) {
    return this.orderService.orderRaport(raport.startDate, raport.endDate);
  }
}
