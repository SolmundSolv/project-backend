import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  readonly customer: string;
  @IsOptional()
  readonly rentStart: string;
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

  @IsString()
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
