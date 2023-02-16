import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
    name: string;
    role: string;
  }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });
    const customer = await this.prisma.customer.findFirst({
      where: {
        userId: user.id,
      },
      select: {
        phone: true,
        adress: true,
      },
    });

    return { ...user, ...customer };
  }
}
