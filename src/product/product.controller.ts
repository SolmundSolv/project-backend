import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateMaintenceDto } from './dto/create-maintence.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get('status')
  status() {
    return this.productService.status();
  }
  @Get('count')
  count() {
    return this.productService.count();
  }
  @Post('status')
  createStatus(@Body() status: { name: string }) {
    return this.productService.createStatus(status);
  }
  @Patch('status/:id')
  updateStatus(@Param('id') id: string, @Body() status: string) {
    return this.productService.changeStatus(id, status);
  }
  @Delete('status/:id')
  deleteStatus(@Param('id') id: string) {
    return this.productService.deleteStatus(id);
  }

  @Get('history/:id')
  history(@Param('id') id: string) {
    return this.productService.historyOfProduct(id);
  }

  @Get('maintenance')
  maintence() {
    return this.productService.allMaintance();
  }

  @Get('maintenance/count')
  maintenceCount() {
    return this.productService.maintenceLast30Days();
  }

  @Get('maintenance/cost')
  maintenanceCost() {
    return this.productService.maintenceCostLast30Days();
  }

  @Get('maintenance/status')
  maintenceStatus() {
    return this.productService.getMaintanceStatus();
  }
  @Post('maintenance/status')
  createMaintenceStatus(@Body() status: string) {
    return this.productService.createMaintanceStatus(status);
  }
  @Patch('maintenance/status/:id')
  updateMaintenceStatus(
    @Param('id') id: string,
    @Body() status: { name: string; visibleOnCreate: boolean },
  ) {
    return this.productService.updateMaintanceStatus(id, status);
  }

  @Delete('maintenance/status/:id')
  deleteMaintenceStatus(@Param('id') id: string) {
    return this.productService.deleteMaintanceStatus(id);
  }

  @Get('maintenance/:id')
  maintenance(@Param('id') id: string) {
    return this.productService.findMaintance(id);
  }

  @Post('maintenance')
  createMaintence(@Body() createMaintenceDto: CreateMaintenceDto) {
    try {
      return this.productService.createMaintance(createMaintenceDto);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  @Patch('maintenance/:id')
  updateMaintence(
    @Param('id') id: string,
    @Body() status: UpdateMaintenanceDto,
  ) {
    return this.productService.updateMaintance(id, status);
  }

  @Get('product-maintence/:id')
  maintenceForProduct(@Param('id') id: string) {
    return this.productService.findMaintanceForProduct(id);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get('model/:id')
  findForModel(@Param('id') id: string) {
    return this.productService.findForModel(id);
  }
  @Patch('model/:id')
  updateModel(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateEquipment(id, updateProductDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
