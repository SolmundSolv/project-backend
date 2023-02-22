import { IsDateString, IsString } from 'class-validator';

export class CreateTimeoffrequestDto {
  @IsString()
  employeeId: string;
  @IsDateString()
  startDate: Date;
  @IsDateString()
  endDate: Date;
  @IsString()
  reason: string;
}
