import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsUrl } from 'class-validator';
import { CreateEmployeeDto } from './create-employee.dto';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @IsString()
  position?: string;

  @IsString()
  salary?: string;

  @IsString()
  bonus?: string;
}
