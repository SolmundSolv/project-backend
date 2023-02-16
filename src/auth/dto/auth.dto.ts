import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  name: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}
