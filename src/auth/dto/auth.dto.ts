import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsOptional()
  name: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}
