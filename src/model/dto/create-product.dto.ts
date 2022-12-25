import { IsString, IsNumber, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  readonly price: number;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  readonly img: string;

  @IsString()
  readonly category: string;

  @IsBoolean()
  readonly isActive: boolean;
}
