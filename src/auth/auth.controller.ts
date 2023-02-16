import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() user: AuthDto) {
    console.log(user);
    return this.authService.signup(user);
  }
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() user: AuthDto) {
    return this.authService.signin(user);
  }
  @Post('logout')
  logout(@Body() token: { token: string }) {
    return this.authService.logout(token.token);
  }
}
