import { IsString } from 'class-validator';

export class CreateNavigationDto {
  @IsString()
  readonly name: string;
  @IsString()
  readonly href: string;
  @IsString()
  readonly type: string;
  @IsString()
  readonly iconPath: string;
}
