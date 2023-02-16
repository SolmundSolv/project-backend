import { IsString, IsNotEmpty, IsArray, IsNumber } from 'class-validator';

export class CreateMaintenceDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  maintenanceStatus: string;

  @IsArray()
  @IsNotEmpty()
  details: {
    description: string;
    price: number;
  }[];

  @IsNumber()
  @IsNotEmpty()
  estimatedTime: number;
}
