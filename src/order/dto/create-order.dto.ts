import {
  IsArray,
  isNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  readonly contractor: string;

  @IsNotEmpty()
  @IsNumber()
  readonly rentDays: number;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsArray()
  readonly items: string[];
}
