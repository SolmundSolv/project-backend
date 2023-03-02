import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}
  @Get('me')
  async getUser(@GetUser() user: User) {
    return { user: user };
  }
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.UserService.update(id, data);
  }

  @Get()
  async getAllUsers() {
    return this.UserService.findAll();
  }
  @Post(':id/link')
  async linkUser(@Param('id') employeeId: string, @Body('id') userId: string) {
    return this.UserService.link(employeeId, userId);
  }
}
