import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreateTimeoffrequestDto } from './dto/create-timeoffrequest.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Post('timeoffrequest/procied')
  prociedTimeOffRequest(@Body() data: { id: string; status: string }) {
    return this.employeeService.updateTimeOffRequest(data.id, data.status);
  }

  @Post('timeoffrequest')
  createTimeOffRequest(
    @Body()
    data: CreateTimeoffrequestDto,
  ) {
    return this.employeeService.createTimeOffRequest(
      data.employeeId,
      data.startDate,
      data.endDate,
      data.reason,
    );
  }
  @Get('timeoffrequest')
  getTimeOffRequest(@Body() data: { id: string }) {
    return this.employeeService.findTimeOffRequests(data.id);
  }

  @Get('roles')
  getRoles() {
    return this.employeeService.findRoles();
  }
  @Post('roles')
  createRole(@Body() data: { name: string }) {
    return this.employeeService.createRole(data.name);
  }
  @Patch('roles/:id')
  updateRole(@Param('id') id: string, @Body() data: { name: string }) {
    return this.employeeService.updateRole(id, data.name);
  }
  @Delete('roles/:id')
  deleteRole(@Param('id') id: string) {
    return this.employeeService.deleteRole(id);
  }
  @Post('change-role')
  changeRole(@Body() data: { id: string; roleId: string }) {
    return this.employeeService.changeRole(data.id, data.roleId);
  }

  @Get()
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}
