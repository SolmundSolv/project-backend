import { IsDate, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  serialNumber: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfPurchase: Date;

  @IsString()
  @IsNotEmpty()
  warranty: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}
