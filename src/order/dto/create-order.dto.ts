import {
  IsArray,
  isNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateOrderDto {
  readonly customer: string;
  @IsNotEmpty()
  readonly name: string;
  @IsNotEmpty()
  readonly email: string;
  @IsNotEmpty()
  readonly phone: string;
  @IsNotEmpty()
  readonly address: string;
  @IsNotEmpty()
  readonly city: string;
  @IsNotEmpty()
  readonly building: string;
  @IsNotEmpty()
  readonly zip: string;
  @IsNotEmpty()
  readonly country: string;

  readonly cartId: string;

  @IsNotEmpty()
  @IsNumber()
  readonly rentDays: number;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsArray()
  readonly items: string[];
}
