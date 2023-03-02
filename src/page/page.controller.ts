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
  @Post('section/:id')
  createSection(
    @Param('id') id: string,
    @Body()
    body: {
      name: string;
      value: string;
      iconPath?: string;
    },
  ) {
    return this.pageService.createPageSection(
      id,
      body.name,
      body.value,
      body.iconPath,
    );
  }
  @Get('section/:id')
  getSection(@Param('id') id: string) {
    return this.pageService.getPageSections(id);
  }
  @Get('section/one/:id/')
  getOneSection(@Param('id') id: string) {
    return this.pageService.getOnePageSection(id);
  }
  @Get('section')
  getAllSection() {
    return this.pageService.getAllPageSections();
  }
  @Delete('section/:id')
  deleteSection(@Param('id') id: string) {
    return this.pageService.deletePageSection(id);
  }
  @Patch('section/:id')
  updateSection(
    @Param('id') id: string,
    @Body()
    body: {
      name: string;
      value: string;
      iconPath?: string;
    },
  ) {
    return this.pageService.updatePageSection(
      id,
      body.name,
      body.value,
      body.iconPath,
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
