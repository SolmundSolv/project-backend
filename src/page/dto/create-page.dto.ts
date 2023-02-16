import { IsString } from 'class-validator';

export class CreatePageDto {
  @IsString()
  name: string;
  @IsString()
  title: string;
  @IsString()
  status: string;
  @IsString()
  type: string;
  @IsString()
  href: string;
}
