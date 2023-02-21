import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PageService } from './page.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Controller('page')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post()
  create(@Body() createPageDto: CreatePageDto) {
    return this.pageService.create(createPageDto);
  }
  @Post('info')
  createInfo(@Body() createPageDto: { name: string; value: string }) {
    return this.pageService.createCompanyInfo(
      createPageDto.name,
      createPageDto.value,
    );
  }
  @Get('info')
  getCompanyInfo() {
    return this.pageService.getCompanyInfo();
  }
  @Delete('info/:id')
  deleteCompanyInfo(@Param('id') id: string) {
    return this.pageService.deleteCompanyInfo(id);
  }

  @Get()
  findAll() {
    return this.pageService.findAll();
  }

  @Get('type/:type')
  findByType(@Param('type') type: string) {
    return this.pageService.findByType(type);
  }

  @Get('type')
  getTypes() {
    return this.pageService.getTypes();
  }
  @Post('type/add')
  addType(@Body() body: any) {
    return this.pageService.addType(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pageService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
    return this.pageService.update(id, updatePageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pageService.remove(id);
  }
}
