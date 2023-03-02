import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, IsUrl } from 'class-validator';
import { CreateEmployeeDto } from './create-employee.dto';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @IsString()
  @IsOptional()
  position: string;

  @IsString()
  @IsOptional()
  salary: string;

  @IsString()
  @IsOptional()
  bonus: string;
}
