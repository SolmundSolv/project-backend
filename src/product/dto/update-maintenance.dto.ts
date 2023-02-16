import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMaintenanceDto {
  @IsString()
  @IsNotEmpty()
  status: string;
}
