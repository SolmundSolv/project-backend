import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
  IsArray,
} from 'class-validator';

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
  readonly img: string;

  @IsString()
  readonly category: string;

  @IsBoolean()
  readonly isActive: boolean;

  @IsArray()
  readonly attributes: { name: string; value: string }[];
}
