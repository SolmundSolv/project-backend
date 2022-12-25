import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}
  async create(createEmployeeDto: CreateEmployeeDto) {
    return await this.prisma.employee.create({
      data: {
        name: createEmployeeDto.name,
        email: createEmployeeDto.email,
        phone: createEmployeeDto.phone,
        address: createEmployeeDto.address,
        city: createEmployeeDto.city,
        zip: createEmployeeDto.zip,
        country: createEmployeeDto.country,
        status: createEmployeeDto.status,
        role: {
          connect: {
            id: createEmployeeDto.roleId,
          },
        },
        avatar: createEmployeeDto.avatar,
      },
    });
  }

  async createMany(createEmployeeDto: CreateEmployeeDto[]) {
    for (let i = 0; i < createEmployeeDto.length; i++) {
      await this.prisma.employee.create({
        data: {
          name: createEmployeeDto[i].name,
          email: createEmployeeDto[i].email,
          phone: createEmployeeDto[i].phone,
          address: createEmployeeDto[i].address,
          city: createEmployeeDto[i].city,
          zip: createEmployeeDto[i].zip,
          country: createEmployeeDto[i].country,
          status: '1',
          role: {
            connect: {
              id: 'clbxnxuz70000tkf0frxts7x7',
            },
          },
          avatar: createEmployeeDto[i].avatar,
        },
      });
    }
  }

  async createTimeOffRequest(
    employeeId: string,
    startDate: Date,
    endDate: Date,
    reason: string,
  ) {
    return await this.prisma.timeOffRequest.create({
      data: {
        start: startDate,
        end: endDate,
        reason: reason,
        Employee: {
          connect: {
            id: employeeId,
          },
        },
      },
    });
  }

  async findTimeOffRequests(employeeId: string) {
    return await this.prisma.timeOffRequest.findMany({
      where: {
        employeeId: employeeId,
      },
    });
  }

  async findTimeOffRequestById(employeeId: string, timeOffRequestId: string) {
    return await this.prisma.timeOffRequest.findUnique({
      where: {
        id: timeOffRequestId,
      },
    });
  }

  async createPosition(name: string, description: string) {
    return await this.prisma.position.create({
      data: {
        name: name,
        status: description,
      },
    });
  }

  async findPositions() {
    return await this.prisma.position.findMany();
  }

  async findPositionById(positionId: string) {
    return await this.prisma.position.findUnique({
      where: {
        id: positionId,
      },
    });
  }

  async createRole(name: string, description: string) {
    return await this.prisma.employeeRole.create({
      data: {
        name: name,
        status: description,
      },
    });
  }

  async findRoles() {
    return await this.prisma.employeeRole.findMany();
  }

  async findRoleById(roleId: string) {
    return await this.prisma.employeeRole.findUnique({
      where: {
        id: roleId,
      },
    });
  }

  async findAll() {
    return await this.prisma.employee.findMany({
      include: {
        role: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.employee.findUnique({
      where: {
        id: id,
      },
      include: {
        role: true,
      },
    });
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  async remove(id: string) {
    return await this.prisma.employee.update({
      where: {
        id: id,
      },
      data: {
        status: 'INACTIVE',
      },
    });
  }
}
