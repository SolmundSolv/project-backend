import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NavigationService } from './navigation.service';
import { CreateNavigationDto } from './dto/create-navigation.dto';
import { UpdateNavigationDto } from './dto/update-navigation.dto';

@Controller('navigation')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Post()
  create(@Body() createNavigationDto: CreateNavigationDto) {
    const { name, href, type, iconPath } = createNavigationDto;
    console.log(createNavigationDto);
    return this.navigationService.create(name, href, type, iconPath);
  }

  @Get('type/:name')
  findByType(@Param('name') name: string) {
    return this.navigationService.findByType(name);
  }
  @Get('type')
  findAllTypes() {
    return this.navigationService.findAllTypes();
  }
  @Post('type')
  createType(@Body('name') name: string) {
    return this.navigationService.createType(name);
  }
  @Patch('type/:id')
  updateType(@Param('id') id: string, @Body('name') name: string) {
    return this.navigationService.updateType(id, name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.navigationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNavigationDto: UpdateNavigationDto,
  ) {
    const { name, href, type, iconPath } = updateNavigationDto;

    return this.navigationService.update(id, name, href, type, iconPath);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.navigationService.remove(id);
  }
}
